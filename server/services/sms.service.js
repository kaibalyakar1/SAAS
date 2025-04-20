import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendSms = async (phoneNumber, message) => {
  try {
    const res = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        sender_id: "FSTSMS",
        message,
        language: "english",
        route: "v3",
        numbers: phoneNumber,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("SMS sending failed:", err.message);
    throw new Error("SMS sending failed");
  }
};

export default sendSms;
