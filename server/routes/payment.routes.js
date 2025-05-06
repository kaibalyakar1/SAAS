import express from "express";
import {
  createPayment,
  verifyPayment,
  handleRazorpayWebhook,
  getMyPayments,
  getAllPayments,
  getPaymentById,
  failedPayment,
  cancelledPayment,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/create-order", protect, createPayment);
router.post("/failed", protect, failedPayment);
router.post("/cancelled", protect, cancelledPayment);
router.post("/verify", protect, verifyPayment);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleRazorpayWebhook
);

router.get("/my-payments", protect, getMyPayments);
router.get("/admin/all", getAllPayments);
router.get("/admin/:id", getPaymentById);

export default router;
