import axios from "axios";
import { VITE_APP_URL } from "@/config/config";

const axiosInstance = axios.create({
  baseURL: VITE_APP_URL + "api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const createNewCoverLetter = async (data) => {
  try {
    const response = await axiosInstance.post(
      "coverLetters/createCoverLetter",
      data.data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getAllCoverLettersData = async () => {
  try {
    const response = await axiosInstance.get("coverLetters/getAllCoverLetters");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const getCoverLetterData = async (coverLetterID) => {
  try {
    const response = await axiosInstance.get(
      `coverLetters/getCoverLetter?id=${coverLetterID}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const updateThisCoverLetter = async (coverLetterID, data) => {
  try {
    const response = await axiosInstance.put(
      `coverLetters/updateCoverLetter?id=${coverLetterID}`,
      data.data
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

const deleteThisCoverLetter = async (coverLetterID) => {
  try {
    const response = await axiosInstance.delete(
      `coverLetters/removeCoverLetter?id=${coverLetterID}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || error?.message || "Something Went Wrong"
    );
  }
};

export {
  getAllCoverLettersData,
  deleteThisCoverLetter,
  getCoverLetterData,
  updateThisCoverLetter,
  createNewCoverLetter,
};
