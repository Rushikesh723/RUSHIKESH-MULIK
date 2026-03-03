import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import Resume from "../models/resume.model.js";

const analyzeExperience = (resume) => {
  let score = 100;
  const issues = [];
  let totalYears = 0;

  if (!resume.experience || resume.experience.length === 0) {
    return {
      score: 0,
      totalYears: 0,
      issues: [
        {
          position: 0,
          issue: "No work experience found",
          suggestion:
            "Add at least one position with company name, job title, and responsibilities",
        },
      ],
    };
  }

  resume.experience.forEach((exp, index) => {
    if (!exp.companyName || !exp.companyName.trim()) {
      score -= 10;
      issues.push({
        position: index + 1,
        issue: "Missing company name",
        suggestion: `For position ${index + 1}, add the company name`,
      });
    }

    if (!exp.title || !exp.title.trim()) {
      score -= 10;
      issues.push({
        position: index + 1,
        issue: "Missing job title",
        suggestion: `For position ${index + 1}, add your job title`,
      });
    }

    if (!exp.workSummary || exp.workSummary.trim().length < 50) {
      score -= 15;
      issues.push({
        position: index + 1,
        issue: "Weak job description",
        suggestion: `Use action verbs and quantifiable results. Example: "Led team of 5 engineers, reducing deployment time by 40%"`,
      });
    }

    if (!exp.startDate) {
      score -= 5;
      issues.push({
        position: index + 1,
        issue: "Missing start date",
        suggestion: `Add the start date for position ${index + 1}`,
      });
    }

    if (exp.startDate && exp.endDate && !exp.currentlyWorking) {
      const start = new Date(exp.startDate);
      const end = new Date(exp.endDate);
      totalYears += (end - start) / (1000 * 60 * 60 * 24 * 365);
    } else if (exp.currentlyWorking) {
      const start = new Date(exp.startDate);
      const now = new Date();
      totalYears += (now - start) / (1000 * 60 * 60 * 24 * 365);
    }
  });

  return {
    score: Math.max(0, score),
    totalYears: Math.round(totalYears * 10) / 10,
    issues,
  };
};

const analyzeEducation = (resume) => {
  let score = 100;
  const issues = [];

  if (!resume.education || resume.education.length === 0) {
    return {
      score: 50,
      issues: [
        {
          issue: "No education information",
          suggestion:
            "Add your educational background including school/university name, degree, and graduation date",
        },
      ],
    };
  }

  resume.education.forEach((edu, index) => {
    if (!edu.universityName || !edu.universityName.trim()) {
      score -= 15;
      issues.push({
        issue: `Education ${index + 1}: Missing school/university name`,
        suggestion: "Add the name of your educational institution",
      });
    }

    if (!edu.degree || !edu.degree.trim()) {
      score -= 15;
      issues.push({
        issue: `Education ${index + 1}: Missing degree type`,
        suggestion:
          "Specify your degree (B.Tech, B.S., M.S., MBA, etc.)",
      });
    }

    if (!edu.field || !edu.field.trim()) {
      score -= 10;
      issues.push({
        issue: `Education ${index + 1}: Missing field of study`,
        suggestion: "Add your major or field of study",
      });
    }

    if (!edu.endDate) {
      score -= 10;
      issues.push({
        issue: `Education ${index + 1}: Missing graduation date`,
        suggestion: "Add your graduation date",
      });
    }
  });

  return {
    score: Math.max(0, score),
    issues,
  };
};

const analyzeSkills = (resume) => {
  let score = 100;
  const issues = [];

  if (!resume.skills || resume.skills.length === 0) {
    return {
      score: 0,
      totalSkills: 0,
      averageRating: 0,
      issues: [
        {
          issue: "No skills listed",
          suggestion:
            "Add relevant technical and soft skills with proficiency ratings",
        },
      ],
    };
  }

  let totalRating = 0;
  const weakSkills = [];
  const missingRatings = [];

  resume.skills.forEach((skill, index) => {
    if (!skill.name || !skill.name.trim()) {
      score -= 5;
      issues.push({
        issue: `Skill ${index + 1}: Missing skill name`,
        suggestion: "Add the name of the skill",
      });
    }

    if (!skill.rating || skill.rating === 0) {
      missingRatings.push(skill.name || `Skill ${index + 1}`);
    } else {
      totalRating += skill.rating;
      if (skill.rating === 1) {
        weakSkills.push(skill.name);
      }
    }
  });

  if (missingRatings.length > 0) {
    score -= 10;
    issues.push({
      issue: `${missingRatings.length} skills missing proficiency rating`,
      suggestion:
        "Rate your skills on a scale to show your proficiency level",
    });
  }

  if (weakSkills.length > 3) {
    score -= 15;
    issues.push({
      issue: "Too many novice-level skills",
      suggestion:
        "Consider removing beginner skills or only include skills you're proficient at",
    });
  }

  if (resume.skills.length < 5) {
    score -= 20;
    issues.push({
      issue: "Too few skills listed",
      suggestion: "Add at least 5-8 relevant skills to strengthen your resume",
    });
  }

  const avgRating =
    resume.skills.length > 0
      ? (totalRating / resume.skills.length).toFixed(2)
      : 0;

  return {
    score: Math.max(0, score),
    totalSkills: resume.skills.length,
    averageRating: parseFloat(avgRating),
    issues,
  };
};

const generateRecommendations = (experience, education, skills, resume) => {
  const recommendations = [];

  // High priority recommendations
  if (experience.score < 50) {
    recommendations.push({
      priority: "high",
      title: "Strengthen Your Work Experience",
      description:
        "Your experience section needs improvement. Add more details about achievements and impact.",
      expectedImpact: "Increase attractiveness to 40% more employers",
    });
  }

  if (skills.totalSkills < 5) {
    recommendations.push({
      priority: "high",
      title: "Expand Skills Section",
      description: "Add more relevant skills to match job descriptions better",
      expectedImpact: "Increase ATS match rate by 30%",
    });
  }

  // Medium priority recommendations
  if (!resume.summary || resume.summary.trim().length < 100) {
    recommendations.push({
      priority: "medium",
      title: "Add Professional Summary",
      description:
        "Create a compelling 2-3 sentence summary highlighting your key strengths",
      expectedImpact: "Grab recruiter's attention in first 6 seconds",
    });
  }

  if (resume.experience && resume.experience.length > 0) {
    const jobDescWithMetrics = resume.experience.filter((exp) =>
      /\d+%|\d+\$|increased|reduced|improved/i.test(exp.workSummary || "")
    );

    if (jobDescWithMetrics.length < resume.experience.length / 2) {
      recommendations.push({
        priority: "medium",
        title: "Add Quantifiable Metrics",
        description:
          "Include numbers, percentages, and measurable outcomes in your job descriptions",
        expectedImpact: "Make achievements more impactful and credible",
      });
    }
  }

  // Low priority recommendations
  if (!resume.phone && !resume.address) {
    recommendations.push({
      priority: "low",
      title: "Add Contact Information",
      description: "Include phone number and location for better accessibility",
      expectedImpact: "Improve recruiter contact options",
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
};

const generateImprovementPlan = (recommendations) => {
  const plan = [];

  if (recommendations.length === 0) {
    return [
      {
        step: 1,
        action: "Regular Updates",
        description: "Keep your resume current with recent achievements",
        estimatedTime: "30 minutes/month",
      },
    ];
  }

  recommendations.forEach((rec, index) => {
    const timeEstimates = {
      high: "1-2 hours",
      medium: "30-45 minutes",
      low: "15-20 minutes",
    };

    plan.push({
      step: index + 1,
      action: rec.title,
      description: rec.description,
      estimatedTime: timeEstimates[rec.priority],
    });
  });

  return plan;
};

const generateStrengthsAndWeaknesses = (experience, education, skills, resume) => {
  const strengths = [];
  const weaknesses = [];

  // Analyze strengths
  if (experience.totalYears >= 3) {
    strengths.push(
      `${Math.round(experience.totalYears)}+ years of relevant experience`
    );
  }

  if (skills.totalSkills >= 8) {
    strengths.push("Comprehensive skill set");
  }

  if (
    resume.summary &&
    resume.summary.trim().length > 100
  ) {
    strengths.push("Strong professional summary");
  }

  if (resume.education && resume.education.length > 0) {
    strengths.push("Solid educational background");
  }

  // Analyze weaknesses
  if (experience.score < 60) {
    weaknesses.push("Work experience needs more detail");
  }

  if (skills.score < 60) {
    weaknesses.push("Skills section could be stronger");
  }

  if (education.score < 60) {
    weaknesses.push("Education details are incomplete");
  }

  if (!resume.summary || resume.summary.trim().length < 50) {
    weaknesses.push("Missing or weak professional summary");
  }

  return { strengths, weaknesses };
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

    // Perform detailed analysis
    const experienceAnalysis = analyzeExperience(resume);
    const educationAnalysis = analyzeEducation(resume);
    const skillsAnalysis = analyzeSkills(resume);

    // Calculate overall score (weighted average)
    const overallScore = Math.round(
      experienceAnalysis.score * 0.35 +
        educationAnalysis.score * 0.25 +
        skillsAnalysis.score * 0.25 +
        (resume.summary && resume.summary.trim().length > 100 ? 100 : 50) *
          0.15
    );

    const recommendations = generateRecommendations(
      experienceAnalysis,
      educationAnalysis,
      skillsAnalysis,
      resume
    );

    const improvementPlan = generateImprovementPlan(recommendations);
    const { strengths, weaknesses } = generateStrengthsAndWeaknesses(
      experienceAnalysis,
      educationAnalysis,
      skillsAnalysis,
      resume
    );

    // Save or update analysis
    const analysis = await ResumeAnalysis.findOneAndUpdate(
      { user: req.user._id, resume: resumeId },
      {
        overallScore,
        contentQuality: {
          score: Math.round(
            (experienceAnalysis.score + educationAnalysis.score) / 2
          ),
          issues: [
            ...experienceAnalysis.issues.slice(0, 2),
            ...educationAnalysis.issues.slice(0, 2),
          ],
        },
        experienceAnalysis,
        educationAnalysis,
        skillsAnalysis,
        overallRecommendations: recommendations,
        strengths,
        weaknesses,
        improvementPlan,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          analysis: {
            ...analysis.toObject(),
            overallScore,
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

const getResumeAnalysis = async (req, res) => {
  try {
    const { resumeId } = req.query;

    if (!resumeId) {
      return res
        .status(400)
        .json(new ApiError(400, "Resume ID is required."));
    }

    const analysis = await ResumeAnalysis.findOne({
      resume: resumeId,
      user: req.user._id,
    });

    if (!analysis) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Analysis not found. Please analyze the resume first."
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, analysis, "Resume analysis fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

export { analyzeResume, getResumeAnalysis };
