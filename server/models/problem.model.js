import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  user: {
    // <-- This is the reference you'll populate
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: { type: String },
  description: { type: String },
  image: { type: String },
  status: {
    type: String,
    enum: ["reported", "in-progress", "resolved"],
    default: "reported",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Problem", problemSchema);
