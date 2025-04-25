import Problem from "../models/problem.model.js";
import { v2 as cloudinary } from "cloudinary";

export const reportProblem = async (req, res) => {
  try {
    const { category, description } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "society_problems",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 800, height: 600, crop: "limit" }],
    });

    // Create new problem with Cloudinary image URL
    const newProblem = await Problem.create({
      user: req.user._id,
      category,
      description,
      image: cloudinaryResponse.secure_url, // Store Cloudinary URL
      status: "reported",
    });
    const populatedProblem = await Problem.findById(newProblem._id).populate(
      "user",
      "ownerName phoneNumber houseNumber"
    );
    return res.status(201).json({
      message: "Problem reported successfully",
      data: { populatedProblem },
    });
  } catch (error) {
    console.error("Error reporting problem:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problem = await Problem.find()
      .populate("user", "ownerName phoneNumber houseNumber")
      .sort({ createdAt: -1 });
    return res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching problems:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById(id).populate(
      "user",
      "ownerName phoneNumber houseNumber"
    );
    return res.status(200).json(problem);
  } catch (error) {
    console.error("Error fetching problem by ID:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProblemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const problem = await Problem.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return res.status(200).json(problem);
  } catch (error) {
    console.error("Error updating problem status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    await Problem.findByIdAndDelete(id);
    return res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProblemsByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const userProblems = await Problem.find({ user: userId })
      .populate("user", "ownerName phoneNumber houseNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: userProblems,
      message: "Reported problems retrieved successfully",
    });
  } catch (error) {
    console.error(`[getAllProblemsByUser] Error:`, error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching problems.",
    });
  }
};
