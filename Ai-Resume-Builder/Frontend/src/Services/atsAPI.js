import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

const axiosInstance = axios.create({
  baseURL: VITE_APP_URL + "api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const analyzeResumeForATS = async (resumeId) => {
  try {
    const response = await axiosInstance.post("atsScore/analyzeResume", {
      resumeId,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getATSScore = async (resumeId) => {
  try {
    const response = await axiosInstance.get(
      `atsScore/getScore?resumeId=${resumeId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getAllATSScores = async () => {
  try {
    const response = await axiosInstance.get("atsScore/getAllScores");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export { analyzeResumeForATS, getATSScore, getAllATSScores };
