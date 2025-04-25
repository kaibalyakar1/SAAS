import mongoose from "mongoose";

const expesnseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expesnseSchema);
