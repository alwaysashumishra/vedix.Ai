import express from "express";
import { getLiveMatches } from "../controllers/cricketController.js";

const router = express.Router();

router.get("/matches", getLiveMatches);

export default router;
