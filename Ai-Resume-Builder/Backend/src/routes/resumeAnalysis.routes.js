import { Router } from "express";
import {
  analyzeResume,
  getResumeAnalysis,
} from "../controller/resumeAnalysis.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.post("/analyzeResume", isUserAvailable, analyzeResume);
router.get("/getAnalysis", isUserAvailable, getResumeAnalysis);

export default router;
