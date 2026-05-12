import express from "express";

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();


// REGISTER
router.post("/register", registerUser);


// LOGIN
router.post("/login", loginUser);


export default router;