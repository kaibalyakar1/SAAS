import express from "express";
import {
  login,
  sendOTP,
  signUp,
  verifyOTP,
} from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/signup", signUp);
router.post("/login", login);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
