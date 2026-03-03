import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  AlertCircle,
  HomeIcon,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { analyzeJobMatch } from "@/Services/jobMatchAPI";
import { toast } from "sonner";

function ScoreRing({ score, label }) {
  const getColor = (value) => {
    if (value >= 80) return { ring: "text-green-600", bg: "bg-green-100" };
    if (value >= 60) return { ring: "text-blue-600", bg: "bg-blue-100" };
    if (value >= 40) return { ring: "text-yellow-600", bg: "bg-yellow-100" };
    return { ring: "text-red-600", bg: "bg-red-100" };
  };

  const colors = getColor(score);

  return (
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-2">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="48"
            cy="48"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${(score / 100) * 263.89} 263.89`}
            className={`transition-all duration-500 ${colors.ring}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${colors.ring}`}>{score}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700">{label}</p>
    </div>
  );
}

function JobMatchAnalyzer() {
  const { resume_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [matchData, setMatchData] = useState(null);

  // Form inputs
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast.error("Please fill in job title and job description");
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeJobMatch(
        resume_id,
        jobTitle,
        company,
        jobDescription
      );
      setMatchData(response.data.jobMatch);
      setShowForm(false);
      toast.success("Job match analysis completed!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to analyze job match");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Job Match Analyzer</h1>
          <p className="text-gray-600">
            See how well your resume matches the job description
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline">
            <HomeIcon className="mr-2" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {showForm && !matchData ? (
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Paste Job Description</h2>
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Job Title *
                </label>
                <Input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name
                </label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Google, Microsoft"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description *
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Copy and paste the complete job description here..."
                className="w-full min-h-64"
              />
              <p className="text-sm text-gray-500 mt-2">
                Include responsibilities, required skills, experience, and education
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Briefcase className="mr-2" /> Analyze Job Match
                </>
              )}
            </Button>
          </form>
        </Card>
      ) : matchData ? (
        <div className="space-y-8">
          {/* Header with Match Score */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">{matchData.jobTitle}</h2>
              {matchData.company && (
                <p className="text-gray-600">at {matchData.company}</p>
              )}
            </div>
            <Button onClick={() => setShowForm(true)} variant="outline">
              <RefreshCw className="mr-2 w-4 h-4" /> Analyze Another Job
            </Button>
          </div>

          {/* Overall Match Score */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-xl font-bold mb-6">Overall Match Score</h3>
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-40 h-40">
                  <svg className="transform -rotate-90 w-40 h-40">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke={
                        matchData.matchScore >= 80
                          ? "#16a34a"
                          : matchData.matchScore >= 60
                          ? "#2563eb"
                          : matchData.matchScore >= 40
                          ? "#eab308"
                          : "#dc2626"
                      }
                      strokeWidth="8"
                      strokeDasharray={`${(matchData.matchScore / 100) * 439.8} 439.8`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-3xl font-bold ${
                        matchData.matchScore >= 80
                          ? "text-green-600"
                          : matchData.matchScore >= 60
                          ? "text-blue-600"
                          : matchData.matchScore >= 40
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {matchData.matchScore}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-grow">
                <p className="text-lg font-semibold mb-4">
                  {matchData.matchScore >= 80
                    ? "🌟 You're a great fit for this role!"
                    : matchData.matchScore >= 60
                    ? "✓ You have significant relevant experience"
                    : matchData.matchScore >= 40
                    ? "⚠️ You have some relevant experience"
                    : "❌ Job needs significant skill development"}
                </p>
                <p className="text-gray-600">
                  Your resume matches {matchData.matchScore}% of the job requirements.
                  Focus on the recommendations below to improve your chances.
                </p>
              </div>
            </div>
          </Card>

          {/* Score Breakdown */}
          <div>
            <h3 className="text-xl font-bold mb-6">Match Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <ScoreRing
                  score={matchData.skillMatch?.score || 0}
                  label="Skills Match"
                />
              </Card>
              <Card className="p-6 text-center">
                <ScoreRing
                  score={matchData.keywordMatch?.score || 0}
                  label="Keyword Match"
                />
              </Card>
              <Card className="p-6 text-center">
                <ScoreRing
                  score={matchData.experienceMatch?.score || 0}
                  label="Experience"
                />
              </Card>
              <Card className="p-6 text-center">
                <ScoreRing
                  score={matchData.educationMatch?.score || 0}
                  label="Education"
                />
              </Card>
            </div>
          </div>

          {/* Overall Feedback */}
          {matchData.overallFeedback && matchData.overallFeedback.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Detailed Feedback</h3>
              <div className="space-y-4">
                {matchData.overallFeedback.map((feedback, idx) => (
                  <Card
                    key={idx}
                    className={`p-4 border-l-4 ${
                      feedback.status === "excellent"
                        ? "border-l-green-500 bg-green-50"
                        : feedback.status === "good"
                        ? "border-l-blue-500 bg-blue-50"
                        : "border-l-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div className="flex gap-4">
                      {feedback.status === "excellent" ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {feedback.category}
                        </h4>
                        <p className="text-gray-700 text-sm mt-1">
                          {feedback.details}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Skills Match */}
          {matchData.skillMatch && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchData.skillMatch.matchedSkills?.length > 0 && (
                <Card className="p-6 border-green-200 bg-green-50">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Matched Skills ({matchData.skillMatch.matchedSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchData.skillMatch.matchedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {matchData.skillMatch.missingSkills?.length > 0 && (
                <Card className="p-6 border-red-200 bg-red-50">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    Missing Skills ({matchData.skillMatch.missingSkills.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchData.skillMatch.missingSkills.slice(0, 10).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Experience Details */}
          {matchData.experienceMatch && (
            <Card
              className={`p-6 border-l-4 ${
                matchData.experienceMatch.match
                  ? "border-l-green-500 bg-green-50"
                  : "border-l-yellow-500 bg-yellow-50"
              }`}
            >
              <h3 className="text-lg font-bold mb-3">Experience Analysis</h3>
              <p className="text-gray-700 mb-4">
                {matchData.experienceMatch.feedback}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Years Required</p>
                  <p className="text-2xl font-bold">
                    {matchData.experienceMatch.yearsSought}+
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Your Experience</p>
                  <p className="text-2xl font-bold">
                    {matchData.experienceMatch.yearsProvided} years
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Keywords Match */}
          {matchData.keywordMatch && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchData.keywordMatch.matchedKeywords?.length > 0 && (
                <Card className="p-6 border-green-200 bg-green-50">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Matched Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchData.keywordMatch.matchedKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {matchData.keywordMatch.missingKeywords?.length > 0 && (
                <Card className="p-6 border-orange-200 bg-orange-50">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {matchData.keywordMatch.missingKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Recommendations */}
          {matchData.recommendations && matchData.recommendations.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Recommendations</h3>
              <div className="space-y-4">
                {matchData.recommendations.map((rec, idx) => (
                  <Card
                    key={idx}
                    className={`p-6 border-l-4 ${
                      rec.priority === "high"
                        ? "border-l-red-500 bg-red-50"
                        : rec.priority === "medium"
                        ? "border-l-yellow-500 bg-yellow-50"
                        : "border-l-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-gray-900">
                        {rec.title}
                      </h4>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          rec.priority === "high"
                            ? "bg-red-200 text-red-800"
                            : rec.priority === "medium"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{rec.description}</p>
                    {rec.keywords?.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {rec.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default JobMatchAnalyzer;
