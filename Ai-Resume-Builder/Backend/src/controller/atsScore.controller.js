import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ATSScore from "../models/atsScore.model.js";
import Resume from "../models/resume.model.js";

// Common ATS Keywords to check for
const commonATSKeywords = [
  "experience",
  "responsible",
  "developed",
  "implemented",
  "managed",
  "designed",
  "created",
  "led",
  "coordinated",
  "organized",
  "directed",
  "accomplished",
  "achieved",
  "improved",
  "increased",
  "reduced",
  "enhanced",
  "established",
  "initiated",
  "maintained",
  "administered",
  "monitored",
  "oversaw",
  "supervised",
  "trained",
  "mentored",
  "collaborated",
  "communicated",
  "analyzed",
  "evaluated",
  "identified",
  "resolved",
  "optimized",
  "streamlined",
  "automated",
];

const requiredSections = [
  "summary",
  "experience",
  "education",
  "skills",
];

const checkFormatScore = (resume) => {
  let score = 100;
  const issues = [];

  // Check if essential fields are present and filled
  if (!resume.firstName || !resume.lastName) {
    score -= 10;
    issues.push({
      category: "format",
      severity: "critical",
      message: "Missing full name",
      suggestion: "Add your first and last name",
    });
  }

  if (!resume.email) {
    score -= 10;
    issues.push({
      category: "format",
      severity: "critical",
      message: "Missing email address",
      suggestion: "Add a valid email address",
    });
  }

  if (!resume.phone) {
    score -= 5;
    issues.push({
      category: "format",
      severity: "warning",
      message: "Missing phone number",
      suggestion: "Add your phone number",
    });
  }

  return { score: Math.max(0, score), issues };
};

const checkSectionScore = (resume) => {
  let score = 0;
  const issues = [];
  const presentSections = [];

  if (resume.summary && resume.summary.trim()) {
    score += 25;
    presentSections.push("summary");
  } else {
    issues.push({
      category: "sections",
      severity: "warning",
      message: "Missing professional summary",
      suggestion: "Add a compelling 2-3 sentence professional summary",
    });
  }

  if (
    resume.experience &&
    Array.isArray(resume.experience) &&
    resume.experience.length > 0
  ) {
    score += 25;
    presentSections.push("experience");
  } else {
    issues.push({
      category: "sections",
      severity: "critical",
      message: "Missing work experience",
      suggestion: "Add at least one position with details",
    });
  }

  if (
    resume.education &&
    Array.isArray(resume.education) &&
    resume.education.length > 0
  ) {
    score += 25;
    presentSections.push("education");
  } else {
    issues.push({
      category: "sections",
      severity: "warning",
      message: "Missing education information",
      suggestion: "Add your educational background",
    });
  }

  if (resume.skills && Array.isArray(resume.skills) && resume.skills.length > 0) {
    score += 25;
    presentSections.push("skills");
  } else {
    issues.push({
      category: "sections",
      severity: "critical",
      message: "Missing skills section",
      suggestion: "Add relevant skills with ratings",
    });
  }

  return { score, issues, presentSections };
};

const checkKeywordScore = (resume) => {
  let totalKeywordsFound = 0;
  const detectedKeywords = [];
  const resumeText = JSON.stringify(resume).toLowerCase();

  commonATSKeywords.forEach((keyword) => {
    if (resumeText.includes(keyword.toLowerCase())) {
      totalKeywordsFound++;
      detectedKeywords.push(keyword);
    }
  });

  const score = Math.min(100, (totalKeywordsFound / 20) * 100);
  const missingKeywords = commonATSKeywords.filter(
    (k) => !detectedKeywords.includes(k)
  );

  return {
    score,
    detectedKeywords: [...new Set(detectedKeywords)],
    missingKeywords: missingKeywords.slice(0, 10),
  };
};

const checkReadabilityScore = (resume) => {
  let score = 100;
  const issues = [];

  // Check for proper formatting in experience
  if (resume.experience && Array.isArray(resume.experience)) {
    resume.experience.forEach((exp, index) => {
      if (!exp.workSummary || exp.workSummary.trim().length < 20) {
        score -= 5;
        issues.push({
          category: "readability",
          severity: "warning",
          message: `Experience entry ${index + 1} has weak description`,
          suggestion: "Use action verbs and be specific about accomplishments",
        });
      }
    });
  }

  // Check skill ratings
  if (resume.skills && Array.isArray(resume.skills)) {
    const unskilled = resume.skills.filter((s) => s.rating === 1);
    if (unskilled.length > 0) {
      score -= 10;
      issues.push({
        category: "readability",
        severity: "info",
        message: "Some skills marked as novice level",
        suggestion: "Consider only including skills you're proficient in",
      });
    }
  }

  return { score: Math.max(0, score), issues };
};

const analyzeResume = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res
        .status(400)
        .json(new ApiError(400, "Resume ID is required."));
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res
        .status(404)
        .json(new ApiError(404, "Resume not found."));
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          new ApiError(403, "You are not authorized to analyze this resume.")
        );
    }

    // Check different scores
    const formatResult = checkFormatScore(resume);
    const sectionResult = checkSectionScore(resume);
    const keywordResult = checkKeywordScore(resume);
    const readabilityResult = checkReadabilityScore(resume);

    // Calculate overall score
    const overallScore = Math.round(
      (formatResult.score * 0.2 +
        sectionResult.score * 0.3 +
        keywordResult.score * 0.3 +
        readabilityResult.score * 0.2) /
        100 * 100
    );

    const allIssues = [
      ...formatResult.issues,
      ...sectionResult.issues,
      ...keywordResult.missingKeywords.slice(0, 3).map((kw) => ({
        category: "keywords",
        severity: "info",
        message: `Missing ATS keyword: "${kw}"`,
        suggestion: `Try incorporating "${kw}" naturally in your resume`,
      })),
      ...readabilityResult.issues,
    ];

    // Save or update ATS score
    let atsScore = await ATSScore.findOneAndUpdate(
      { user: req.user._id, resume: resumeId },
      {
        overallScore,
        formatScore: Math.round(formatResult.score),
        keywordScore: Math.round(keywordResult.score),
        sectionScore: Math.round(sectionResult.score),
        readabilityScore: Math.round(readabilityResult.score),
        issues: allIssues,
        missingKeywords: keywordResult.missingKeywords,
        detectedKeywords: keywordResult.detectedKeywords,
        analysis: {
          totalWords: JSON.stringify(resume).split(/\s+/).length,
          bulletPoints: (resume.summary || "").split("\n").length,
          sections: sectionResult.presentSections,
        },
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          atsScore: {
            ...atsScore.toObject(),
            overallScore,
            formatScore: Math.round(formatResult.score),
            keywordScore: Math.round(keywordResult.score),
            sectionScore: Math.round(sectionResult.score),
            readabilityScore: Math.round(readabilityResult.score),
          },
        },
        "Resume analyzed successfully"
      )
    );
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

const getATSScore = async (req, res) => {
  try {
    const { resumeId } = req.query;

    if (!resumeId) {
      return res
        .status(400)
        .json(new ApiError(400, "Resume ID is required."));
    }

    const atsScore = await ATSScore.findOne({
      resume: resumeId,
      user: req.user._id,
    });

    if (!atsScore) {
      return res
        .status(404)
        .json(new ApiError(404, "ATS score not found. Please analyze the resume first."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, atsScore, "ATS score fetched successfully"));
  } catch (error) {
    console.error("Error fetching ATS score:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const getAllATSScores = async (req, res) => {
  try {
    const atsScores = await ATSScore.find({ user: req.user._id }).populate(
      "resume",
      "title"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, atsScores, "All ATS scores fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching ATS scores:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

export { analyzeResume, getATSScore, getAllATSScores };
