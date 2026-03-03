import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  InfoIcon,
  TrendingUp,
  RefreshCw,
  HomeIcon,
  Lightbulb,
  Target,
  Award,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { analyzeResumeDetailed, getResumeAnalysis } from "@/Services/resumeAnalysisAPI";
import { toast } from "sonner";

function ScoreDisplay({ score, label, size = "md" }) {
  const getColor = (value) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-blue-600";
    if (value >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case "lg":
        return "text-5xl";
      case "md":
        return "text-3xl";
      case "sm":
        return "text-xl";
      default:
        return "text-3xl";
    }
  };

  return (
    <div className="text-center">
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <div className={`font-bold ${getColor(score)} ${getSizeClasses(size)}`}>
        {score}%
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            score >= 80
              ? "bg-green-600"
              : score >= 60
              ? "bg-blue-600"
              : score >= 40
              ? "bg-yellow-600"
              : "bg-red-600"
          }`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}

function ResumeAnalyzer() {
  const { resume_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [resume_id]);

  const fetchAnalysis = async () => {
    try {
      const response = await getResumeAnalysis(resume_id);
      setAnalysisData(response.data);
      setAnalyzed(true);
    } catch (error) {
      console.log("Analysis not yet performed");
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await analyzeResumeDetailed(resume_id);
      setAnalysisData(response.data.analysis);
      setAnalyzed(true);
      toast.success("Resume analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast.error(error.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Resume Analyzer</h1>
          <p className="text-gray-600">Get detailed insights to improve your resume</p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline">
            <HomeIcon className="mr-2" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {!analyzed ? (
        <Card className="p-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-4">Ready for a Deep Dive?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Our Resume Analyzer provides comprehensive feedback on your experience,
            education, skills, and overall structure. Get actionable insights and an
            improvement plan.
          </p>
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2" /> Analyze Now
              </>
            )}
          </Button>
        </Card>
      ) : analysisData ? (
        <div className="space-y-8">
          {/* Overall Score */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold mb-6">Overall Resume Score</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${(analysisData.overallScore / 100) * 552.92} 552.92`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">
                      {analysisData.overallScore}%
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-gray-600 mb-6">
                  {analysisData.overallScore >= 80
                    ? "Excellent! Your resume is well-structured and compelling. 🌟"
                    : analysisData.overallScore >= 60
                    ? "Good foundation! Follow the recommendations below to strengthen it further."
                    : "There's room for improvement. Focus on the high-priority items below."}
                </p>
                <Button onClick={handleAnalyze} disabled={loading} variant="outline">
                  <RefreshCw className="mr-2 w-4 h-4" /> Re-analyze
                </Button>
              </div>
            </div>
          </Card>

          {/* Score Breakdown */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Detailed Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <ScoreDisplay
                  score={analysisData.experienceAnalysis?.score || 0}
                  label="Experience"
                  size="sm"
                />
                {analysisData.experienceAnalysis?.totalYears > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-3">
                    {analysisData.experienceAnalysis.totalYears.toFixed(1)} years
                  </p>
                )}
              </Card>
              <Card className="p-6">
                <ScoreDisplay
                  score={analysisData.educationAnalysis?.score || 0}
                  label="Education"
                  size="sm"
                />
              </Card>
              <Card className="p-6">
                <ScoreDisplay
                  score={analysisData.skillsAnalysis?.score || 0}
                  label="Skills"
                  size="sm"
                />
                {analysisData.skillsAnalysis?.totalSkills > 0 && (
                  <p className="text-center text-sm text-gray-600 mt-3">
                    {analysisData.skillsAnalysis.totalSkills} skills
                  </p>
                )}
              </Card>
              <Card className="p-6">
                <ScoreDisplay
                  score={analysisData.contentQuality?.score || 0}
                  label="Quality"
                  size="sm"
                />
              </Card>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisData.strengths && analysisData.strengths.length > 0 && (
              <Card className="p-6 border-green-200 bg-green-50">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Award className="w-5 h-5 text-green-600 mr-2" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysisData.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {analysisData.weaknesses && analysisData.weaknesses.length > 0 && (
              <Card className="p-6 border-red-200 bg-red-50">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {analysisData.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Detailed Issues by Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Detailed Feedback</h2>

            {/* Experience Issues */}
            {analysisData.experienceAnalysis?.issues &&
              analysisData.experienceAnalysis.issues.length > 0 && (
                <Card className="p-6 border-l-4 border-l-orange-500">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 text-orange-600 mr-2" />
                    Experience
                  </h3>
                  <div className="space-y-3">
                    {analysisData.experienceAnalysis.issues.map((issue, idx) => (
                      <div key={idx} className="p-3 bg-orange-50 rounded-lg">
                        <p className="font-semibold text-gray-900">{issue.issue}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          💡 {issue.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            {/* Education Issues */}
            {analysisData.educationAnalysis?.issues &&
              analysisData.educationAnalysis.issues.length > 0 && (
                <Card className="p-6 border-l-4 border-l-yellow-500">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {analysisData.educationAnalysis.issues.map((issue, idx) => (
                      <div key={idx} className="p-3 bg-yellow-50 rounded-lg">
                        <p className="font-semibold text-gray-900">{issue.issue}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          💡 {issue.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

            {/* Skills Issues */}
            {analysisData.skillsAnalysis?.issues &&
              analysisData.skillsAnalysis.issues.length > 0 && (
                <Card className="p-6 border-l-4 border-l-blue-500">
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 text-blue-600 mr-2" />
                    Skills
                  </h3>
                  <div className="space-y-3">
                    {analysisData.skillsAnalysis.issues.map((issue, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-semibold text-gray-900">{issue.issue}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          💡 {issue.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
          </div>

          {/* Recommendations */}
          {analysisData.overallRecommendations &&
            analysisData.overallRecommendations.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Target className="mr-2" /> Top Recommendations
                </h2>
                <div className="space-y-4">
                  {analysisData.overallRecommendations.map((rec, idx) => (
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
                        <h3 className="text-lg font-bold">{rec.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          rec.priority === "high"
                            ? "bg-red-200 text-red-800"
                            : rec.priority === "medium"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-blue-200 text-blue-800"
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{rec.description}</p>
                      <p className="text-sm text-gray-600">
                        <strong>Expected Impact:</strong> {rec.expectedImpact}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          {/* Improvement Plan */}
          {analysisData.improvementPlan && analysisData.improvementPlan.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Action Plan</h2>
              <div className="space-y-4">
                {analysisData.improvementPlan.map((step, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-bold mb-1">{step.action}</h3>
                        <p className="text-gray-600 mb-2">{step.description}</p>
                        <p className="text-sm text-gray-500">
                          ⏱️ {step.estimatedTime}
                        </p>
                      </div>
                    </div>
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

export default ResumeAnalyzer;
