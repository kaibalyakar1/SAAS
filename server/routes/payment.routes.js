import express from "express";
import {
  createPayment,
  verifyPayment,
  handleRazorpayWebhook,
  getMyPayments,
  getAllPayments,
  getPaymentById,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create-order", protect, createPayment);
router.post("/verify", protect, verifyPayment);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleRazorpayWebhook
);

router.get("/my-payments", protect, getMyPayments);
router.get("/admin/all", protect, getAllPayments);
router.get("/admin/:id", protect, getPaymentById);

export default router;
