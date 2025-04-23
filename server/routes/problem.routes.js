import express from "express";
import upload from "../middlewares/upload.middlewares.js";
import { reportProblem } from "../controllers/problem.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post("/report", protect, upload.single("image"), reportProblem);

export default router;
