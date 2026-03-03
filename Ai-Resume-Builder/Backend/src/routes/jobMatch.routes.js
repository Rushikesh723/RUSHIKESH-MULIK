import { Router } from "express";
import { analyzeJobMatch } from "../controller/jobMatch.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.post("/analyzeMatch", isUserAvailable, analyzeJobMatch);

export default router;
