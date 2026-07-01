import express from "express";
import { getNewsFeed } from "../controllers/newsController.js";

const router = express.Router();

router.get("/", getNewsFeed);

export default router;
