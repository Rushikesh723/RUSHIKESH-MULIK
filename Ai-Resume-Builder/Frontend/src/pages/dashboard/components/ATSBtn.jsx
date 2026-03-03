import React from "react";
import { Button } from "@/components/ui/button";
import { Zap, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ATSBtn({ resume }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/dashboard/ats-checker/${resume._id}`)}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Zap className="w-4 h-4" />
      Check ATS
    </button>
  );
}

export default ATSBtn;
