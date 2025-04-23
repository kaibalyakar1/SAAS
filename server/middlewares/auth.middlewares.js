import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  try {
    console.log("Authorization header:", req.headers.authorization); // Debug
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token provided"); // Debug
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debug

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("User not found for ID:", decoded.id); // Debug
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Authenticated user:", user._id); // Debug
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error); // Debug
    res.status(401).json({ message: "Not authorized" });
  }
};
