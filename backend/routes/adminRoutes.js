import express from "express";
import {
  getAdminConfig,
  getAdminSummary,
  getAdminUsers,
  getPublicConfig,
  updateAdminConfig,
  updateAdminUser,
} from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/public-config", getPublicConfig);

router.use(adminAuth);

router.get("/summary", getAdminSummary);
router.get("/users", getAdminUsers);
router.patch("/users/:id", updateAdminUser);
router.get("/config", getAdminConfig);
router.put("/config", updateAdminConfig);

export default router;

