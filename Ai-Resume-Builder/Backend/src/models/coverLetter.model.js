import mongoose from "mongoose";

const coverLetterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  companyName: { type: String, default: "" },
  hiringManager: { type: String, default: "" },
  summary: { type: String, default: "" },
  keySkills: [
    {
      type: String,
    },
  ],
  workExperience: { type: String, default: "" },
  themeColor: { type: String, required: true, default: "#ff6666" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CoverLetter = mongoose.model("CoverLetter", coverLetterSchema);

export default CoverLetter;
