import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
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

export default mongoose.model("Income", incomeSchema);
