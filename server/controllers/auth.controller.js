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
