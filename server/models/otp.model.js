import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      // can be email or phone depending on usage
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
