import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import JobMatch from "../models/jobMatch.model.js";
import Resume from "../models/resume.model.js";

// Common job-related keywords and skills
const technicalSkills = [
  "javascript",
  "python",
  "java",
  "cpp",
  "csharp",
  "react",
  "angular",
  "vue",
  "nodejs",
  "express",
  "django",
  "flask",
  "spring",
  "dotnet",
  "sql",
  "mongodb",
  "postgresql",
  "mysql",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "git",
  "ci/cd",
  "devops",
  "machine learning",
  "ai",
  "data science",
  "analytics",
  "rest api",
  "graphql",
  "html",
  "css",
  "typescript",
  "golang",
  "rust",
  "kotlin",
];

const softSkills = [
  "communication",
  "leadership",
  "teamwork",
  "problem solving",
  "critical thinking",
  "time management",
  "adaptability",
  "collaboration",
  "project management",
  "analytical",
  "organizational",
  "creative",
  "attention to detail",
  "decision making",
  "negotiation",
  "presentation",
  "public speaking",
];

const experienceLevels = {
  junior: 0,
  entry: 0,
  graduate: 0.5,
  intermediate: 3,
  mid: 3,
  senior: 5,
  lead: 7,
  principal: 10,
  executive: 12,
};

const educationKeywords = {
  bachelors: ["bachelor", "b.s.", "b.a.", "b.tech", "bsc"],
  masters: ["master", "m.s.", "m.a.", "mtech", "msc", "mba"],
  phd: ["phd", "doctorate", "doctoral"],
};

const extractYearsRequired = (jobDesc) => {
  const yearsMatch = jobDesc.match(/(\d+)\+?\s+years?/gi);
  if (yearsMatch) {
    const numbers = yearsMatch.map((m) => parseInt(m));
    return Math.max(...numbers);
  }
  return 0;
};

const extractEducationRequired = (jobDesc) => {
  const required = [];
  const lowerDesc = jobDesc.toLowerCase();

  if (lowerDesc.includes("phd") || lowerDesc.includes("doctorate")) {
    required.push("PhD");
  } else if (
    lowerDesc.includes("master") ||
    lowerDesc.includes("mba") ||
    lowerDesc.includes("mtech")
  ) {
    required.push("Master's Degree");
  } else if (lowerDesc.includes("bachelor") || lowerDesc.includes("b.s.")) {
    required.push("Bachelor's Degree");
  }

  if (lowerDesc.includes("certification")) {
    required.push("Relevant Certification");
  }

  return required.length > 0 ? required : ["High School Diploma (or equivalent)"];
};

const matchSkills = (resumeText, jobDesc) => {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDesc.toLowerCase();

  const matched = [];
  const missing = [];
  let score = 0;

  const allSkills = [...technicalSkills, ...softSkills];
  const jobSkills = new Set();

  allSkills.forEach((skill) => {
    if (jobLower.includes(skill.toLowerCase())) {
      jobSkills.add(skill);
    }
  });

  jobSkills.forEach((skill) => {
    if (resumeLower.includes(skill.toLowerCase())) {
      matched.push(skill);
      score += 10;
    } else {
      missing.push(skill);
    }
  });

  if (jobSkills.size > 0) {
    score = Math.round((matched.length / jobSkills.size) * 100);
  }

  return {
    score: Math.min(100, score),
    matchedSkills: matched,
    missingSkills: missing,
  };
};

const matchKeywords = (resumeText, jobDesc) => {
  const keywords = jobDesc.match(/\b[a-z0-9]+(?:\s[a-z0-9]+)?\b/gi) || [];
  const uniqueKeywords = new Set(keywords.map((k) => k.toLowerCase()));
  const resumeLower = resumeText.toLowerCase();

  const matched = [];
  const missing = [];

  uniqueKeywords.forEach((kw) => {
    if (resumeLower.includes(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const score = Math.round((matched.length / uniqueKeywords.size) * 100);

  return {
    score: Math.min(100, score),
    matchedKeywords: matched.slice(0, 15),
    missingKeywords: missing.slice(0, 10),
  };
};

const matchExperience = (resume, yearsRequired) => {
  let yearsProvided = 0;

  if (resume.experience && Array.isArray(resume.experience)) {
    resume.experience.forEach((exp) => {
      if (exp.startDate && exp.endDate && !exp.currentlyWorking) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        yearsProvided += (end - start) / (1000 * 60 * 60 * 24 * 365);
      } else if (exp.currentlyWorking && exp.startDate) {
        const start = new Date(exp.startDate);
        const now = new Date();
        yearsProvided += (now - start) / (1000 * 60 * 60 * 24 * 365);
      }
    });
  }

  yearsProvided = Math.round(yearsProvided * 10) / 10;
  const match = yearsProvided >= yearsRequired;
  let score = 100;

  if (yearsProvided < yearsRequired) {
    const deficit = yearsRequired - yearsProvided;
    score = Math.max(30, 100 - deficit * 15);
  } else {
    score = Math.min(100, 100 + (yearsProvided - yearsRequired) * 2);
  }

  return {
    score: Math.round(score),
    yearsSought: yearsRequired,
    yearsProvided,
    match,
    feedback: match
      ? `You have ${yearsProvided} years of experience, which meets the requirement of ${yearsRequired}+ years.`
      : `You have ${yearsProvided} years but the role requires ${yearsRequired}+ years. Consider highlighting relevant skills and achievements.`,
  };
};

const matchEducation = (resume, requiredEducation) => {
  const providedEducation = [];

  if (resume.education && Array.isArray(resume.education)) {
    resume.education.forEach((edu) => {
      if (edu.degree) {
        providedEducation.push(edu.degree);
      }
    });
  }

  return {
    score: providedEducation.length > 0 ? 80 : 40,
    required: requiredEducation,
    provided: providedEducation,
  };
};

const analyzeJobMatch = async (req, res) => {
  try {
    const { resumeId, jobTitle, company, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res
        .status(400)
        .json(new ApiError(400, "Resume ID and Job Description are required."));
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
          new ApiError(
            403,
            "You are not authorized to analyze this resume."
          )
        );
    }

    const resumeText = JSON.stringify(resume);

    // Perform detailed matching
    const skillMatch = matchSkills(resumeText, jobDescription);
    const keywordMatch = matchKeywords(resumeText, jobDescription);
    const yearsRequired = extractYearsRequired(jobDescription);
    const experienceMatch = matchExperience(resume, yearsRequired);
    const requiredEducation = extractEducationRequired(jobDescription);
    const educationMatch = matchEducation(resume, requiredEducation);

    // Calculate overall match score (weighted)
    const matchScore = Math.round(
      skillMatch.score * 0.35 +
        keywordMatch.score * 0.25 +
        experienceMatch.score * 0.25 +
        educationMatch.score * 0.15
    );

    // Generate feedback
    const overallFeedback = [];

    if (skillMatch.score >= 80) {
      overallFeedback.push({
        category: "Skills",
        status: "excellent",
        details: `You have ${skillMatch.matchedSkills.length} of the required skills`,
      });
    } else if (skillMatch.score >= 60) {
      overallFeedback.push({
        category: "Skills",
        status: "good",
        details: `You have ${skillMatch.matchedSkills.length} of the required skills. Consider adding ${skillMatch.missingSkills.slice(0, 3).join(", ")}`,
      });
    } else {
      overallFeedback.push({
        category: "Skills",
        status: "fair",
        details: `Missing key skills: ${skillMatch.missingSkills.slice(0, 3).join(", ")}`,
      });
    }

    if (experienceMatch.match) {
      overallFeedback.push({
        category: "Experience",
        status: "excellent",
        details: experienceMatch.feedback,
      });
    } else {
      overallFeedback.push({
        category: "Experience",
        status: "fair",
        details: experienceMatch.feedback,
      });
    }

    if (educationMatch.score >= 80) {
      overallFeedback.push({
        category: "Education",
        status: "good",
        details: `Your education matches the role requirements`,
      });
    } else {
      overallFeedback.push({
        category: "Education",
        status: "fair",
        details: `Role prefers: ${requiredEducation.join(", ")}`,
      });
    }

    // Generate recommendations
    const recommendations = [];

    if (skillMatch.missingSkills.length > 0) {
      recommendations.push({
        priority: "high",
        title: "Add Missing Skills",
        description: `Learn and add these skills to strengthen your profile: ${skillMatch.missingSkills.slice(0, 5).join(", ")}`,
        keywords: skillMatch.missingSkills.slice(0, 5),
      });
    }

    if (!experienceMatch.match) {
      recommendations.push({
        priority: "high",
        title: "Highlight Relevant Experience",
        description:
          "Add more details to your current experience or include contract/freelance work relevant to this role",
        keywords: [],
      });
    }

    if (keywordMatch.missingKeywords.length > 0) {
      recommendations.push({
        priority: "medium",
        title: "Incorporate Job Keywords",
        description: `Use job description keywords in your resume: ${keywordMatch.missingKeywords.slice(0, 5).join(", ")}`,
        keywords: keywordMatch.missingKeywords.slice(0, 5),
      });
    }

    recommendations.push({
      priority: "medium",
      title: "Tailor Your Cover Letter",
      description:
        "Create a compelling cover letter explaining why you're interested in this specific role",
      keywords: [jobTitle, company],
    });

    // Save job match analysis
    const jobMatch = await JobMatch.findOneAndUpdate(
      {
        user: req.user._id,
        resume: resumeId,
        jobTitle,
        jobDescription,
      },
      {
        jobTitle,
        company: company || "",
        jobDescription,
        matchScore,
        skillMatch,
        experienceMatch,
        keywordMatch,
        educationMatch,
        overallFeedback,
        recommendations: recommendations.slice(0, 4),
        analyzedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          jobMatch: {
            ...jobMatch.toObject(),
            matchScore,
          },
        },
        "Job match analysis completed successfully"
      )
    );
  } catch (error) {
    console.error("Error analyzing job match:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

export { analyzeJobMatch };
