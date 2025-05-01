import dotenv from "dotenv";
import Razorpay from "razorpay";
dotenv.config();

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
      method: "upi", // enforces UPI
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
