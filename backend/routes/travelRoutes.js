/**
 * Travel API Routes
 */

import express from "express";
import { generateTravelPlan, parseRequirementsOnly, handleWhatIfScenario } from "../controllers/travelController.js";

const router = express.Router();

router.post("/plan", generateTravelPlan);
router.post("/analyze-requirements", parseRequirementsOnly);
router.post("/what-if", handleWhatIfScenario);

export default router;
