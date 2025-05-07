import Income from "../models/income.model.js";

export const createIncome = async (req, res) => {
  try {
    const { category, amount, date, description } = req.body;
    const newIncome = new Income({
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
    const incomes = await Income.find({}).sort({ date: -1 });
    res.status(200).json(incomes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, date, description } = req.body;
    const updatedIncome = await Income.findByIdAndUpdate(
      id,
      { category, amount, date, description },
      { new: true }
    );
    res.status(200).json({
      message: "Income updated successfully",
      income: updatedIncome,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    await Income.findByIdAndDelete(id);
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
