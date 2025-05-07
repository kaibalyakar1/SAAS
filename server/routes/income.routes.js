import express from "express";
import {
  createIncome,
  deleteIncome,
  getAllIncomes,
  updateIncome,
} from "../controllers/income.controller.js";

const router = express.Router();

router.post("/create", createIncome);
router.get("/get", getAllIncomes);
router.put("/update/:id", updateIncome);
router.delete("/delete/:id", deleteIncome);

export default router;
