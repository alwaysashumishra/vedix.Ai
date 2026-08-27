import express from "express";
import {
  getAdminPayments,
  getUserPayments,
  submitQRPayment,
  updatePaymentStatus,
} from "../controllers/paymentController.js";
import { adminAuth } from "../middleware/adminAuth.js";
import { authUser } from "../middleware/authUser.js";

const router = express.Router();

// User endpoints
router.post("/submit-qr", authUser, submitQRPayment);
router.get("/my-payments", authUser, getUserPayments);

// Admin endpoints
router.get("/admin/all", adminAuth, getAdminPayments);
router.patch("/admin/:id", adminAuth, updatePaymentStatus);

export default router;
