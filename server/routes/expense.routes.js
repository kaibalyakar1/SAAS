import express from "express";
import {
  createExpense,
  getAllExpenses,
  deleteExpense,
  updateExpense,
  getExpenseByMonth,
  totalExpense,
} from "../controllers/expense.controller.js";
const router = express.Router();

router.post("/add", createExpense);
router.get("/all", getAllExpenses);
router.get("/sum", totalExpense);
router.get("/get/:month", getExpenseByMonth);
router.delete("/delete/:id", deleteExpense);
router.put("/update/:id", updateExpense);

export default router;
