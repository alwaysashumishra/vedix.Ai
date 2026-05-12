import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


// AUTH ROUTES
app.use("/api/auth", authRoutes);

// USER ROUTES
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("Vedix AI Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});