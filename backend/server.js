import "./config/polyfills.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import zlib from "zlib";
import cluster from "cluster";
import os from "os";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cricketRoutes from "./routes/cricketRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

import { trackUsage } from "./middleware/trackUsage.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const ENABLE_CLUSTER = process.env.CLUSTER_MODE === "true" && cluster.isPrimary;

// Multi-Core CPU Worker Clustering for High Scale Production
if (ENABLE_CLUSTER) {
  const numCPUs = os.cpus().length;
  console.log(`Primary Master Process ${process.pid} is running. Forking ${numCPUs} CPU workers... 🚀`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Forking replacement worker...`);
    cluster.fork();
  });
} else {
  const app = express();

  // CORS Security & Allowed Methods
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["*"],
    })
  );

  // High-Throughput Gzip Compression Middleware
  app.use((req, res, next) => {
    if (req.method === "OPTIONS") return next();
    const acceptEncoding = req.headers["accept-encoding"] || "";
    if (!acceptEncoding.includes("gzip")) return next();

    const originalSend = res.send;
    res.send = function (body) {
      if ((typeof body === "string" || Buffer.isBuffer(body)) && res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const compressed = zlib.gzipSync(body);
          res.setHeader("Content-Encoding", "gzip");
          res.setHeader("Vary", "Accept-Encoding");
          res.setHeader("Content-Length", compressed.length);
          return originalSend.call(this, compressed);
        } catch (err) {
          console.error("Gzip compression error:", err);
        }
      }
      return originalSend.call(this, body);
    };
    next();
  });

  // Body Parsing with Payload Boundaries
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Global Rate Limiter & DDOS Protection (300 requests per minute per IP)
  app.use(rateLimiter({ windowMs: 60000, maxRequests: 300 }));

  // Usage Tracking & Metrics
  app.use("/api", trackUsage("api"));

  // Strictly Scoped Rate Limiting on Auth & Heavy AI Routes
  app.use("/api/auth", rateLimiter({ windowMs: 60000, maxRequests: 60 }), authRoutes);
  app.use("/api/analyze", rateLimiter({ windowMs: 60000, maxRequests: 40 }), analyzeRoutes);

  // API Routes
  app.use("/api/users", userRoutes);
  app.use("/api/news", newsRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/cricket", cricketRoutes);
  app.use("/api/payments", paymentRoutes);

  // Health Check Endpoint for Load Balancers (AWS / Railway / Render)
  app.get("/", (_req, res) => {
    res.status(200).json({
      status: "online",
      service: "Vedix.AI Scalable Cluster Engine",
      pid: process.pid,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  });

  // Global Error Handler
  app.use((err, _req, res, _next) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Process ${process.pid} listening on port ${PORT} ✅`);
  });

  // Connect MongoDB Pool
  connectDB();
}
