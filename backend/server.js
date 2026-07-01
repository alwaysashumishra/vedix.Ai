import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/news", newsRoutes);

app.get("/", (_req, res) => {
  res.send("Vedix AI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
