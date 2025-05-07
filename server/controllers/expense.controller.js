import Expense from "../models/expense.model.js";
export const createExpense = async (req, res) => {
  try {
    const { category, amount, date, description } = req.body;
    const newExpense = new Expense({
      category,
      amount,
      date,
      description,
    });
    await newExpense.save();
    res
      .status(201)
      .json({ message: "Expense created successfully", expense: newExpense });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const totalExpense = async (req, res) => {
  try {
    const total = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);
    res.status(200).json(total[0].totalAmount);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExpenseByMonth = async (req, res) => {
  try {
    const { month } = req.params;
    const expenses = await Expense.find({
      date: {
        $gte: new Date(`${month}-01`),
        $lt: new Date(`${month}-31`),
      },
    });
    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, date, description } = req.body;
    const updatedEpense = await Expense.findByIdAndUpdate(
      id,
      { category, amount, date, description },
      { new: true }
    );
    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedEpense,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createIncome = async (req, res) => {
  try {
    const { category, amount, date, description } = req.body;
    const newIncome = new Expense({
      category,
      amount,
      date,
      description,
    });
    await newIncome.save();
    res
      .status(201)
      .json({ message: "Income created successfully", income: newIncome });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllIncomes = async (req, res) => {
  try {
    const incomes = await Expense.find().sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
