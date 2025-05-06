import express from "express";
import {
  login,
  logout,
  sendOTP,
  signUp,
  verifyOTP,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", protect, logout);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

export default router;
