import { configureStore } from "@reduxjs/toolkit";
import resumeReducers from "../features/resume/resumeFeatures";
import coverLetterReducers from "../features/coverLetter/coverLetterFeatures";
import userReducers from "../features/user/userFeatures";

export const resumeStore = configureStore({
  reducer: {
    editResume: resumeReducers,
    editCoverLetter: coverLetterReducers,
    editUser: userReducers,
  },
});

export const userStore = configureStore({
  reducer: {
    editUser: userReducers,
  },
});
