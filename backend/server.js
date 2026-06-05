
import express from "express";

import cors from "cors";

import dotenv from "dotenv";



/* LOAD ENV FIRST */
dotenv.config();



import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";

import userRoutes from "./routes/userRoutes.js";

import analyzeRoutes from "./routes/analyzeRoutes.js";



const app = express();





/* ======================
   DATABASE
====================== */

connectDB();






/* ======================
   MIDDLEWARE
====================== */

app.use(cors());

app.use(express.json());






/* ======================
   ROUTES
====================== */

// AUTH
app.use(
  "/api/auth",
  authRoutes
);


// USERS
app.use(
  "/api/users",
  userRoutes
);


// AI ANALYZER
app.use(
  "/api/analyze",
  analyzeRoutes
);







/* ======================
   HOME ROUTE
====================== */

app.get("/", (req, res) => {

  res.send(
    "Vedix AI Backend Running 🚀"
  );
});








/* ======================
   DEBUG ENV
====================== */

console.log(

  "GROQ KEY EXISTS 👉",

  process.env.GROQ_API_KEY
);








/* ======================
   SERVER
====================== */

const PORT =
  process.env.PORT || 5000;



app.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`
  );
});

