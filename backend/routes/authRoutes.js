import express from "express";

import {
  registerUser,
  loginUser,
  googleAuth,
  resetPassword,
  updateProfile,
  submitStudentVerification,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/reset-password", resetPassword);
router.put("/update-profile", updateProfile);
router.post("/verify-student", submitStudentVerification);

export default router;
