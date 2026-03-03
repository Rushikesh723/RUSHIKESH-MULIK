import React from "react";
import { useState } from "react";
import { CopyPlus, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewCoverLetter } from "@/Services/coverLetterAPI";
import { useNavigate } from "react-router-dom";

function AddCoverLetter() {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [coverLetterTitle, setCoverLetterTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const createCoverLetter = async () => {
    setLoading(true);
    if (coverLetterTitle === "")
      return console.log("Please add a title to your cover letter");
    const data = {
      data: {
        title: coverLetterTitle,
        themeColor: "#ff6666",
      },
    };
    console.log(`Creating Cover Letter ${coverLetterTitle}`);
    createNewCoverLetter(data)
      .then((res) => {
        console.log("Response from AddCoverLetter", res);
        Navigate(`/dashboard/edit-cover-letter/${res.data.coverLetter._id}`);
      })
      .finally(() => {
        setLoading(false);
        setCoverLetterTitle("");
      });
  };

  return (
    <>
      <div
        className="p-14 py-24 flex items-center justify-center border-2 bg-secondary rounded-lg h-[380px] hover:scale-105 transition-all duration-400 cursor-pointer hover:shadow-md transform-gpu"
        onClick={() => setOpenDialog(true)}
      >
        <CopyPlus className="transition-transform duration-300" />
      </div>
      <Dialog open={isDialogOpen}>
        <DialogContent setOpenDialog={setOpenDialog}>
          <DialogHeader>
            <DialogTitle>Create a New Cover Letter</DialogTitle>
            <DialogDescription>
              Add a title to your new cover letter
              <Input
                className="my-3"
                type="text"
                placeholder="Ex: Software Engineer Cover Letter"
                value={coverLetterTitle}
                onChange={(e) => setCoverLetterTitle(e.target.value.trimStart())}
              />
            </DialogDescription>
            <div className="gap-2 flex justify-end">
              <Button variant="ghost" onClick={() => setOpenDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createCoverLetter} disabled={!coverLetterTitle || loading}>
                {loading ? (
                  <Loader className=" animate-spin" />
                ) : (
                  "Create Cover Letter"
                )}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddCoverLetter;
