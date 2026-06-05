
import express from "express";

import multer from "multer";

import {

  analyzeResume,

  analyzeResearchPaper

}

from "../controllers/analyzeController.js";



const router =
  express.Router();



// MULTER STORAGE
const storage =
  multer.memoryStorage();



const upload =
  multer({
    storage,
    limits: {
      fileSize: 12 * 1024 * 1024
    }
  });




/* =================
   RESUME ANALYZER
================= */

router.post(

  "/resume",

  upload.single("resume"),

  analyzeResume
);




/* =================
   RESEARCH PAPER
================= */

router.post(

  "/research-paper",

  upload.single("paper"),

  analyzeResearchPaper
);




export default router;
