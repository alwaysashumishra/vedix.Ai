import express from "express";
import {
  getAdminConfig,
  getAdminSummary,
  getAdminUsers,
  getPublicConfig,
  updateAdminConfig,
  updateAdminUser,
  deleteAdminUser,
  getServerStatus,
  clearServerCache,
  restartServer,
} from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/public-config", getPublicConfig);

router.use(adminAuth);

router.get("/summary", getAdminSummary);
router.get("/users", getAdminUsers);
router.patch("/users/:id", updateAdminUser);
router.delete("/users/:id", deleteAdminUser);

router.get("/config", getAdminConfig);
router.put("/config", updateAdminConfig);

router.get("/server/status", getServerStatus);
router.post("/server/clear-cache", clearServerCache);
router.post("/server/restart", restartServer);

export default router;
