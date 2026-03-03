import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

const axiosInstance = axios.create({
  baseURL: VITE_APP_URL + "api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const analyzeResumeDetailed = async (resumeId) => {
  try {
    const response = await axiosInstance.post(
      "resumeAnalysis/analyzeResume",
      { resumeId }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getResumeAnalysis = async (resumeId) => {
  try {
    const response = await axiosInstance.get(
      `resumeAnalysis/getAnalysis?resumeId=${resumeId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export { analyzeResumeDetailed, getResumeAnalysis };
