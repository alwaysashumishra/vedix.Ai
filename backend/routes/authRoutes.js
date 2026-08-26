import express from "express";

import {
  registerUser,
  loginUser,
  googleAuth,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/reset-password", resetPassword);

export default router;
