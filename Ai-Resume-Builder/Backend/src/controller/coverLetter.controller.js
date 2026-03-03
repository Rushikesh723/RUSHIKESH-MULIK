import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import CoverLetter from "../models/coverLetter.model.js";

const start = async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Welcome to Cover Letter Builder API"));
};

const createCoverLetter = async (req, res) => {
  const { title, themeColor } = req.body;

  // Validate that the title is provided
  if (!title) {
    return res
      .status(400)
      .json(new ApiError(400, "Title is required."));
  }

  try {
    // Create a new cover letter with empty fields for other attributes
    const coverLetter = await CoverLetter.create({
      title,
      themeColor: themeColor || "#ff6666",
      user: req.user._id,
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      jobTitle: "",
      companyName: "",
      hiringManager: "",
      summary: "",
      keySkills: [],
      workExperience: "",
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, { coverLetter }, "Cover letter created successfully")
      );
  } catch (error) {
    console.error("Error creating cover letter:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

const getAllCoverLetters = async (req, res) => {
  try {
    const coverLetters = await CoverLetter.find({ user: req.user });
    return res
      .status(200)
      .json(
        new ApiResponse(200, coverLetters, "Cover letters fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const getCoverLetter = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res
        .status(400)
        .json(new ApiError(400, "Cover Letter ID is required."));
    }

    // Find the cover letter by ID
    const coverLetter = await CoverLetter.findById(id);

    if (!coverLetter) {
      return res
        .status(404)
        .json(new ApiError(404, "Cover letter not found."));
    }

    // Check if the cover letter belongs to the current user
    if (coverLetter.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json(
          new ApiError(403, "You are not authorized to access this cover letter.")
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, coverLetter, "Cover letter fetched successfully")
      );
  } catch (error) {
    console.error("Error fetching cover letter:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal Server Error", [], error.stack));
  }
};

const updateCoverLetter = async (req, res) => {
  console.log("Cover Letter update request received:");
  const id = req.query.id;

  try {
    // Find and update the cover letter with the provided ID and user ID
    console.log("Database update request started");
    const updatedCoverLetter = await CoverLetter.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: req.body, $currentDate: { updatedAt: true } },
      { new: true }
    );

    if (!updatedCoverLetter) {
      console.log("Cover letter not found or unauthorized");
      return res
        .status(404)
        .json(
          new ApiResponse(404, null, "Cover letter not found or unauthorized")
        );
    }

    console.log("Cover letter updated successfully:");

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedCoverLetter, "Cover letter updated successfully")
      );
  } catch (error) {
    console.error("Error updating cover letter:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Internal Server Error", [error.message], error.stack)
      );
  }
};

const removeCoverLetter = async (req, res) => {
  const id = req.query.id;

  try {
    // Check if the cover letter exists and belongs to the current user
    const coverLetter = await CoverLetter.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!coverLetter) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            null,
            "Cover letter not found or not authorized to delete this cover letter"
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Cover letter deleted successfully"));
  } catch (error) {
    console.error("Error while deleting cover letter:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal Server Error"));
  }
};

export {
  start,
  createCoverLetter,
  getAllCoverLetters,
  getCoverLetter,
  updateCoverLetter,
  removeCoverLetter,
};
