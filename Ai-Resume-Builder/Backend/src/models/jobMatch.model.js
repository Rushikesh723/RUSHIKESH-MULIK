import mongoose from "mongoose";

const jobMatchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true,
  },
  jobTitle: { type: String, required: true },
  company: { type: String, default: "" },
  jobDescription: { type: String, required: true },
  matchScore: { type: Number, default: 0 },
  skillMatch: {
    score: { type: Number, default: 0 },
    matchedSkills: [String],
    missingSkills: [String],
  },
  experienceMatch: {
    score: { type: Number, default: 0 },
    yearsSought: { type: Number, default: 0 },
    yearsProvided: { type: Number, default: 0 },
    match: { type: Boolean, default: false },
    feedback: String,
  },
  keywordMatch: {
    score: { type: Number, default: 0 },
    matchedKeywords: [String],
    missingKeywords: [String],
  },
  educationMatch: {
    score: { type: Number, default: 0 },
    required: [String],
    provided: [String],
  },
  salaryMatch: {
    estimatedRange: String,
    feedback: String,
  },
  overallFeedback: [
    {
      category: String,
      status: { type: String, enum: ["excellent", "good", "fair", "poor"] },
      details: String,
    },
  ],
  recommendations: [
    {
      priority: { type: String, enum: ["high", "medium", "low"] },
      title: String,
      description: String,
      keywords: [String],
    },
  ],
  analyzedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const JobMatch = mongoose.model("JobMatch", jobMatchSchema);

export default JobMatch;
