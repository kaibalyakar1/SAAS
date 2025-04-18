import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

//send OTP

export const sendOTP = async (requestAnimationFrame, res) => {
  try {
    const { identifier } = req.body; // identifier can be email or phone depending on usage
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes
    const otpDoc = await Otp.create({ identifier, otp, expiresAt });

    //Integrate SMS/EMAIL service to send OTP to user
    console.log(`OTP for ${identifier}: ${otp}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

//verify & Signup
export const verifyOTPandSignup = async (req, res) => {
  try {
    const { identifier, otp, ...userData } = req.body; // identifier can be email or phone depending on usage

    //check existence of OTP
    const isExistOTP = await Otp.findOne({ identifier, otp, isUsed: true });

    if (isExistOTP || isExistOTP.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    //check existence of user
    const isExistUser = await User.findOne({
      $or: [{ email: userData.email }, { phoneNumber: userData.phoneNumber }],
    });

    if (isExistUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await User.create({
      ...userData,
      password: hashedPassword,
    });

    //mark OTP as used
    await Otp.updateOne({ identifier, otp }, { isUsed: true });
    await isExistOTP.save();
    //   //generate JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: err.message });
  }
};
