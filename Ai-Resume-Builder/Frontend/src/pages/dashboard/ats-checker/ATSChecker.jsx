import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle, 
  AlertCircle, 
  InfoIcon, 
  Zap, 
  RefreshCw, 
  HomeIcon 
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { analyzeResumeForATS, getATSScore } from "@/Services/atsAPI";
import { toast } from "sonner";

function ATSScoreCard({ score, label, color }) {
  const getColorClass = (value) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-4 border rounded-lg text-center bg-gray-50">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <div className={`text-4xl font-bold ${getColorClass(score)}`}>
        {score}%
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );
}

function ATSChecker({ resumeId, resumeTitle }) {
  const params = useParams();
  const actualResumeId = resumeId || params.resume_id;
  const [loading, setLoading] = useState(false);
  const [atsData, setAtsData] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    fetchATSScore();
  }, [actualResumeId]);

  const fetchATSScore = async () => {
    try {
      const response = await getATSScore(actualResumeId);
      setAtsData(response.data);
      setAnalyzed(true);
    } catch (error) {
      console.log("ATS score not yet calculated");
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await analyzeResumeForATS(actualResumeId);
      setAtsData(response.data.atsScore);
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
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">ATS Score Checker</h1>
          <p className="text-gray-600">Resume ID: {actualResumeId}</p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline">
            <HomeIcon className="mr-2" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      {!analyzed ? (
        <Card className="p-12 text-center">
          <Zap className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h2 className="text-2xl font-bold mb-4">Ready to Check ATS Compatibility?</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Our ATS Score Checker analyzes your resume for compatibility with Applicant 
            Tracking Systems. Get detailed feedback on formatting, keywords, sections, and readability.
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
                <Zap className="mr-2" /> Analyze Now
              </>
            )}
          </Button>
        </Card>
      ) : atsData ? (
        <div className="space-y-8">
          {/* Overall Score */}
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-2xl font-bold mb-6">Overall ATS Score</h2>
            <div className="flex items-center justify-between">
              <div className="flex-1">
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
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${(atsData.overallScore / 100) * 439.8} 439.8`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600">
                      {atsData.overallScore}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 ml-8">
                <p className="text-gray-600 mb-4">
                  {atsData.overallScore >= 80
                    ? "Your resume is ATS-optimized! 🎉"
                    : atsData.overallScore >= 60
                    ? "Good! Consider implementing suggestions below."
                    : "Your resume needs improvements for better ATS compatibility."}
                </p>
                <Button onClick={handleAnalyze} disabled={loading} variant="outline">
                  <RefreshCw className="mr-2 w-4 h-4" /> Re-analyze
                </Button>
              </div>
            </div>
          </Card>

          {/* Score Breakdown */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Score Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ATSScoreCard
                score={atsData.formatScore}
                label="Format Score"
                color="bg-blue-500"
              />
              <ATSScoreCard
                score={atsData.sectionScore}
                label="Section Score"
                color="bg-green-500"
              />
              <ATSScoreCard
                score={atsData.keywordScore}
                label="Keyword Score"
                color="bg-purple-500"
              />
              <ATSScoreCard
                score={atsData.readabilityScore}
                label="Readability Score"
                color="bg-orange-500"
              />
            </div>
          </div>

          {/* Issues and Recommendations */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Issues & Recommendations</h2>
            {atsData.issues && atsData.issues.length > 0 ? (
              <div className="space-y-4">
                {atsData.issues.map((issue, index) => (
                  <Card key={index} className={`p-4 border-l-4 ${
                    issue.severity === "critical"
                      ? "border-l-red-500 bg-red-50"
                      : issue.severity === "warning"
                      ? "border-l-yellow-500 bg-yellow-50"
                      : "border-l-blue-500 bg-blue-50"
                  }`}>
                    <div className="flex gap-4">
                      {issue.severity === "critical" ? (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                      ) : issue.severity === "warning" ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                      ) : (
                        <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {issue.message}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          💡 {issue.suggestion}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center bg-green-50 border-green-200">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 font-semibold">
                  No critical issues found! Your resume looks good.
                </p>
              </Card>
            )}
          </div>

          {/* Keywords Analysis */}
          {(atsData.detectedKeywords?.length > 0 || atsData.missingKeywords?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {atsData.detectedKeywords?.length > 0 && (
                <Card className="p-6 bg-green-50 border-green-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    Detected Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {atsData.detectedKeywords.slice(0, 15).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {atsData.detectedKeywords.length > 15 && (
                    <p className="text-sm text-gray-600 mt-2">
                      +{atsData.detectedKeywords.length - 15} more
                    </p>
                  )}
                </Card>
              )}

              {atsData.missingKeywords?.length > 0 && (
                <Card className="p-6 bg-orange-50 border-orange-200">
                  <h3 className="font-bold text-lg mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    Keywords to Add
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {atsData.missingKeywords.slice(0, 10).map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Additional Analysis */}
          {atsData.analysis && (
            <Card className="p-6 bg-gray-50">
              <h3 className="font-bold text-lg mb-4">Additional Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Total Words</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {atsData.analysis.totalWords}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Bullet Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {atsData.analysis.bulletPoints}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Sections Found</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {atsData.analysis.sections?.length || 0}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default ATSChecker;
