import { Router } from "express";
import {
  start,
  createCoverLetter,
  getAllCoverLetters,
  getCoverLetter,
  updateCoverLetter,
  removeCoverLetter,
} from "../controller/coverLetter.controller.js";
import { isUserAvailable } from "../middleware/auth.js";

const router = Router();

router.get("/", start);
router.post("/createCoverLetter", isUserAvailable, createCoverLetter);
router.get("/getAllCoverLetters", isUserAvailable, getAllCoverLetters);
router.get("/getCoverLetter", isUserAvailable, getCoverLetter);
router.put("/updateCoverLetter", isUserAvailable, updateCoverLetter);
router.delete("/removeCoverLetter", isUserAvailable, removeCoverLetter);

export default router;
