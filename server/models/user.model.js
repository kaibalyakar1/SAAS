import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    houseNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    flatType: {
      type: String,
      required: true,
      trim: true,
      enum: ["1FLOOR", "2FLOOR", "2.5FLOOR", "3FLOOR"],
      default: "1FLOOR",
    },
    amount: {
      type: Number,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["OWNER", "TENANT"],

      default: "OWNER",
    },
    status: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
