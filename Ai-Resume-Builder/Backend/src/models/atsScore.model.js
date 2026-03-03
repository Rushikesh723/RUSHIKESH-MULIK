import mongoose from "mongoose";

const atsScoreSchema = new mongoose.Schema({
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
  formatScore: { type: Number, default: 0 },
  keywordScore: { type: Number, default: 0 },
  sectionScore: { type: Number, default: 0 },
  readabilityScore: { type: Number, default: 0 },
  issues: [
    {
      category: { type: String }, // format, keywords, sections, readability
      severity: { type: String, enum: ["critical", "warning", "info"] },
      message: { type: String },
      suggestion: { type: String },
    },
  ],
  missingKeywords: [{ type: String }],
  detectedKeywords: [{ type: String }],
  missingEducation: { type: Boolean, default: false },
  missingExperience: { type: Boolean, default: false },
  missingSkills: { type: Boolean, default: false },
  analysis: {
    totalWords: { type: Number, default: 0 },
    bulletPoints: { type: Number, default: 0 },
    sections: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ATSScore = mongoose.model("ATSScore", atsScoreSchema);

export default ATSScore;
