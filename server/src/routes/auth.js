import express from "express";
import twilioClient from "../config/twilio_config.js";

const router = express.Router();
const otpStore = new Map(); // Temporary OTP storage

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  const { phone, phoneNumber } = req.body;
  const number = phone || phoneNumber; // Accept both formats

  if (!number) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Generate a 6-digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Send OTP via Twilio
    const message = await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: number,
    });

    // Store OTP temporarily
    otpStore.set(number, otp);
    console.log(`OTP sent to ${number}: ${otp}`); // Debugging

    res.json({ success: true, message: "OTP sent successfully!", sid: message.sid });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, phoneNumber, otp } = req.body;
  const number = phone || phoneNumber;

  if (!number || !otp) {
    return res.status(400).json({ error: "Phone number and OTP are required" });
  }

  // Check if OTP matches
  if (otpStore.get(number) === otp) {
    otpStore.delete(number);
    return res.json({ success: true, message: "OTP verified successfully!" });
  } else {
    return res.status(400).json({ error: "Invalid OTP or expired" });
  }
});

export default router;
