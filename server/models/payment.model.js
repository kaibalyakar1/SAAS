import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    houseNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: Date.now,
    },
    month: {
      type: String, // e.g., "April 2025"
      required: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
