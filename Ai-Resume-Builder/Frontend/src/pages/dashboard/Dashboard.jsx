import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import { getAllCoverLettersData } from "@/Services/coverLetterAPI";
import AddResume from "./components/AddResume";
import AddCoverLetter from "./components/AddCoverLetter";
import ResumeCard from "./components/ResumeCard";
import CoverLetterCard from "./components/CoverLetterCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const [resumeList, setResumeList] = useState([]);
  const [coverLetterList, setCoverLetterList] = useState([]);

  const fetchAllResumeData = async () => {
    try {
      const resumes = await getAllResumeData();
      console.log(
        `Printing from DashBoard List of Resumes got from Backend`,
        resumes.data
      );
      setResumeList(resumes.data);
    } catch (error) {
      console.log("Error from dashboard", error.message);
    }
  };

  const fetchAllCoverLettersData = async () => {
    try {
      const coverLetters = await getAllCoverLettersData();
      console.log(
        `Printing from DashBoard List of Cover Letters got from Backend`,
        coverLetters.data
      );
      setCoverLetterList(coverLetters.data);
    } catch (error) {
      console.log("Error fetching cover letters from dashboard", error.message);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
    fetchAllCoverLettersData();
  }, [user]);

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl mb-2">My Documents</h2>
      <p className="py-3">Start creating your AI resume and cover letters for your next job role</p>

      <Tabs defaultValue="resumes" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="coverLetters">Cover Letters</TabsTrigger>
        </TabsList>

        <TabsContent value="resumes">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
            <AddResume />
            {resumeList.length > 0 &&
              resumeList.map((resume, index) => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  refreshData={fetchAllResumeData}
                />
              ))}
          </div>
          {resumeList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No resumes yet. Create one to get started!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="coverLetters">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
            <AddCoverLetter />
            {coverLetterList.length > 0 &&
              coverLetterList.map((coverLetter, index) => (
                <CoverLetterCard
                  key={coverLetter._id}
                  coverLetter={coverLetter}
                  refreshData={fetchAllCoverLettersData}
                />
              ))}
          </div>
          {coverLetterList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No cover letters yet. Create one to get started!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
