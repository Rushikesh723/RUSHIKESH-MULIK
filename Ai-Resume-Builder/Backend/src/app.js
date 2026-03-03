import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import coverLetterRouter from "./routes/coverLetter.routes.js";
import atsScoreRouter from "./routes/atsScore.routes.js";
import resumeAnalysisRouter from "./routes/resumeAnalysis.routes.js";
import jobMatchRouter from "./routes/jobMatch.routes.js";
import cors from "cors";
import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions = {
    origin: [process.env.ALLOWED_SITE],
    credentials: true
};

app.use(cors(corsOptions));

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);
app.use("/api/coverLetters", coverLetterRouter);
app.use("/api/atsScore", atsScoreRouter);
app.use("/api/resumeAnalysis", resumeAnalysisRouter);
app.use("/api/jobMatch", jobMatchRouter);

export default app;
