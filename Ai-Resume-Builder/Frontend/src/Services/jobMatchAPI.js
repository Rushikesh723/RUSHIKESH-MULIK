import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

const axiosInstance = axios.create({
  baseURL: VITE_APP_URL + "api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const analyzeJobMatch = async (resumeId, jobTitle, company, jobDescription) => {
  try {
    const response = await axiosInstance.post("jobMatch/analyzeMatch", {
      resumeId,
      jobTitle,
      company,
      jobDescription,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export { analyzeJobMatch };
