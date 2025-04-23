import express from "express";
import upload from "../middlewares/upload.middlewares.js";
import {
  deleteProblem,
  getAllProblems,
  getProblemById,
  reportProblem,
  updateProblemStatus,
} from "../controllers/problem.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post("/report", protect, upload.single("image"), reportProblem);
router.get("/all-problems", getAllProblems);

router.get("/problem/:id", getProblemById);

router.put("/problem-status/:id", upload.single("image"), updateProblemStatus);
router.delete("/problem-delete/:id", deleteProblem);

export default router;
