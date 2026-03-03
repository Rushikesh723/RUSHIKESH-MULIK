import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home/HomePage.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import { EditResume } from "./pages/dashboard/edit-resume/[resume_id]/EditResume.jsx";
import ViewResume from "./pages/dashboard/view-resume/[resume_id]/ViewResume.jsx";
import EditCoverLetter from "./pages/dashboard/edit-cover-letter/[cover_letter_id]/EditCoverLetter.jsx";
import ATSChecker from "./pages/dashboard/ats-checker/ATSChecker.jsx";
import ResumeAnalyzer from "./pages/dashboard/resume-analyzer/ResumeAnalyzer.jsx";
import JobMatchAnalyzer from "./pages/dashboard/job-match/JobMatchAnalyzer.jsx";
import AuthPage from "./pages/auth/customAuth/AuthPage.jsx";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";
const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/edit-resume/:resume_id",
        element: <EditResume />,
      },
      {
        path: "/dashboard/view-resume/:resume_id",
        element: <ViewResume />,
      },
      {
        path: "/dashboard/edit-cover-letter/:cover_letter_id",
        element: <EditCoverLetter />,
      },
      {
        path: "/dashboard/ats-checker/:resume_id",
        element: <ATSChecker />,
      },
      {
        path: "/dashboard/resume-analyzer/:resume_id",
        element: <ResumeAnalyzer />,
      },
      {
        path: "/dashboard/job-match/:resume_id",
        element: <JobMatchAnalyzer />,
      },
    ],
  },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/sign-in",
    element: <AuthPage />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={resumeStore}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>


);
