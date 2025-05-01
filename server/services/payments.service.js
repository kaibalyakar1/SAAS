import dotenv from "dotenv";
import Razorpay from "razorpay";

// Load environment variables FIRST
dotenv.config({ path: "../../.env" });

// Verify environment variables are loaded
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay credentials missing in environment variables");
}
console.log(
  "Razorpay credentials loaded",
  process.env.RAZORPAY_KEY_ID,
  process.env.RAZORPAY_KEY_SECRET
);
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (amountInRupees, receiptId) => {
  try {
    const options = {
      amount: amountInRupees * 100, // paise
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    throw new Error("Failed to create Razorpay order");
  }
};
