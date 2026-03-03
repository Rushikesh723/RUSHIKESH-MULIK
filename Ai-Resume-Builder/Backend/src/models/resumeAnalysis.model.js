import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema({
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
  overallScore: { type: Number, default: 0 },
  contentQuality: {
    score: { type: Number, default: 0 },
    issues: [
      {
        section: String,
        issue: String,
        suggestion: String,
        severity: { type: String, enum: ["critical", "warning", "info"] },
      },
    ],
  },
  experienceAnalysis: {
    score: { type: Number, default: 0 },
    totalYears: { type: Number, default: 0 },
    issues: [
      {
        position: Number,
        issue: String,
        suggestion: String,
      },
    ],
  },
  educationAnalysis: {
    score: { type: Number, default: 0 },
    issues: [
      {
        issue: String,
        suggestion: String,
      },
    ],
  },
  skillsAnalysis: {
    score: { type: Number, default: 0 },
    totalSkills: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    issues: [
      {
        issue: String,
        suggestion: String,
      },
    ],
  },
  overallRecommendations: [
    {
      priority: { type: String, enum: ["high", "medium", "low"], default: "medium" },
      title: String,
      description: String,
      expectedImpact: String,
    },
  ],
  strengths: [String],
  weaknesses: [String],
  improvementPlan: [
    {
      step: Number,
      action: String,
      description: String,
      estimatedTime: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;
