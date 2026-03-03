import { Router } from "express";
import {
  analyzeResume,
  getATSScore,
  getAllATSScores,
} from "../controller/atsScore.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.post("/analyzeResume", isUserAvailable, analyzeResume);
router.get("/getScore", isUserAvailable, getATSScore);
router.get("/getAllScores", isUserAvailable, getAllATSScores);

export default router;
