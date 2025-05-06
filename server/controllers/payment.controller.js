import { createRazorpayOrder } from "../services/payments.service.js";
import Payment from "../models/payment.model.js";
import crypto from "crypto";
import userModel from "../models/user.model.js";

const FLAT_PRICING = {
  "1FLOOR": 5,
  "2FLOOR": 750,
  "2.5FLOOR": 1000,
  "3FLOOR": 1,
};

export const createPayment = async (req, res) => {
  const { month, year } = req.body;
  const user = req.user;
  console.log("blabsdlhih", user);
  console.log("user", user.houseNumber);
  try {
    const currentMonth = new Date().toLocaleString("default", {
      month: "long",
    });
    console.log("Current month:", currentMonth);

    const existingPayment = await Payment.findOne({
      houseNumber: user.houseNumber,
      month: currentMonth,
      status: "success", // Directly check for "paid" status
    });

    console.log("Existing payment:", existingPayment);

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already made for this period",
      });
    }
    const amount = user.amount;
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount not set for this user",
      });
    }

    const receiptId = `rcpt_${user.houseNumber}_${Date.now()}`;
    const order = await createRazorpayOrder(amount, receiptId);

    const newPayment = new Payment({
      houseNumber: user.houseNumber,
      amount,
      month,
      year: year || new Date().getFullYear().toString(),
      paymentId: order.id,
      status: "pending",
    });

    await newPayment.save();

    res.status(200).json({
      success: true,
      user: {
        houseNumber: user.houseNumber,
        ownerName: user.ownerName,
        flatType: user.flatType,
        amount,
      },
      order,
      amount,
      payment: newPayment,
    });
    console.log(order);
  } catch (err) {
    console.error("Error in createPayment:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const failedPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    error,
    houseNumber,
    month,
  } = req.body;

  try {
    // Find the pending payment for this order
    const payment = await Payment.findOneAndUpdate(
      {
        paymentId: razorpay_order_id,
        houseNumber: houseNumber,
        status: "pending",
      },
      {
        $set: {
          status: "failed",
          errorReason: error,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Pending payment not found for this order",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment failure recorded successfully",
      payment,
    });
  } catch (err) {
    console.error("Error in failedPayment:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error while recording payment failure",
    });
  }
};
// In your payment controller
export const cancelledPayment = async (req, res) => {
  const { razorpay_order_id, houseNumber, month } = req.body;

  try {
    // Find and update the payment
    const payment = await Payment.findOneAndUpdate(
      { paymentId: razorpay_order_id, houseNumber, month },
      {
        status: "cancelled",
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment cancellation recorded",
      payment,
    });
  } catch (err) {
    console.error("Error in cancelledPayment:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Payment.findOneAndUpdate(
        { paymentId: razorpay_order_id },
        {
          status: "success",
          paymentDate: new Date(),
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        }
      );
      await userModel.findOneAndUpdate(
        { houseNumber: req.user.houseNumber },
        { status: "paid" }
      );
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (err) {
    console.error("Error in verifyPayment:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const isValid = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (isValid !== signature) {
      return res.status(400).json({ status: "Invalid signature" });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment.entity;

    if (event === "payment.captured") {
      await Payment.findOneAndUpdate(
        { paymentId: payment.order_id },
        {
          status: "success",
          paymentDate: new Date(),
          razorpayPaymentId: payment.id,
        },
        { new: true }
      );
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Error in webhook:", err);
    res.status(500).json({ message: err.message });
  }
};

// In payment.controller.js
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      houseNumber: req.user.houseNumber,
    }).sort({ createdAt: -1 });

    // Transform invalid dates
    const formattedPayments = payments.map((payment) => {
      let month = payment.month;
      if (month === "Invalid Date" && payment.createdAt) {
        month = payment.createdAt.toLocaleString("default", { month: "long" });
      }

      return {
        ...payment._doc,
        month,
        year:
          payment.year ||
          (payment.createdAt && payment.createdAt.getFullYear().toString()),
      };
    });

    res.status(200).json({
      success: true,
      payments: formattedPayments,
    });
  } catch (err) {
    // ... error handling
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const getAllPayments = async (req, res) => {
  try {
    // Find all payments sorted by creation date
    const payments = await Payment.find().sort({ createdAt: -1 });

    // Get all unique houseNumbers from payments
    const houseNumbers = [...new Set(payments.map((p) => p.houseNumber))];

    // Find all users with these houseNumbers in a single query
    const users = await userModel.find({
      houseNumber: { $in: houseNumbers },
    });

    const userMap = users.reduce((map, user) => {
      map[user.houseNumber] = {
        name: user.ownerName,
        email: user.email,
        phone: user.phoneNumber,
      };
      return map;
    }, {});

    // Add user details to each payment
    const paymentsWithUserDetails = payments.map((payment) => ({
      ...payment._doc,
      user: userMap[payment.houseNumber] || null,
    }));

    res.status(200).json({
      success: true,
      payments: paymentsWithUserDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    res.status(200).json({ success: true, payment });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
