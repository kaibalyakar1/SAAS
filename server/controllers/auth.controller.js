import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import bcrypt from "bcrypt"; // ✅
import jwt from "jsonwebtoken";
import { sendOtpToUser, verifyOtp } from "../services/otp.service.js";
export const signUp = async (req, res) => {
  try {
    const {
      houseNumber,
      ownerName,
      phoneNumber,
      email,
      flatType,
      role,
      password,
    } = req.body;

    const checkExistingUser = await User.aggregate([
      {
        $match: {
          $or: [{ houseNumber }, { phoneNumber }],
        },
      },
    ]);

    if (checkExistingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const amountMap = {
      "1FLOOR": 1,
      "2FLOOR": 2,
      "2.5FLOOR": 3,
      "3FLOOR": 4,
    };
    const amount = amountMap[flatType] || 1; // Default to 1 if flatType is not recognized
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      houseNumber,
      ownerName,
      phoneNumber,
      email,
      flatType,
      role,
      password: hashedPassword,
      isVerified: false,
      amount,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const logout = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await User.findOneAndUpdate({ token }, { $set: { token: null } });

    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    await sendOtpToUser(phoneNumber);

    res
      .status(200)
      .json({ success: true, message: `OTP sent to ${phoneNumber}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    const isValid = await verifyOtp(phoneNumber, otp);

    if (isValid) {
      await User.updateOne({ phoneNumber }, { $set: { isVerified: true } });
      res
        .status(200)
        .json({ success: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid OTP" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
