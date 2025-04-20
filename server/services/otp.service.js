import Otp from "../models/otp.model.js";
import generateOtp from "../utils/otpGenerator.js";
import sendSms from "./sms.service.js";

export const sendOtpToUser = async (phoneNumber) => {
  const otp = generateOtp();

  await Otp.deleteMany({ phoneNumber }); // clear old
  await Otp.create({ phoneNumber, otp });

  const message = `Your OTP for Society App is ${otp}. Valid for 5 minutes.`;
  await sendSms(phoneNumber, message);

  return true;
};

export const verifyOtp = async (phoneNumber, inputOtp) => {
  const record = await Otp.findOne({ phoneNumber, otp: inputOtp });
  if (!record) return false;

  await Otp.deleteMany({ phoneNumber }); // cleanup
  return true;
};
