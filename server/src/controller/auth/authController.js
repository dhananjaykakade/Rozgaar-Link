import twilioClient from "../../config/twilio_config.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../../utils/prisma.js";
import ResponseHandler from "../../utils/CustomResponse.js";
import  apiHandler from "../../helpers/ApiHandler.js";


dotenv.config();

const otpStore = new Map(); // Temporary OTP storage

// ✅ Send OTP
export const sendOtp = apiHandler(async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return ResponseHandler.badRequest(res, "Phone number is required.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

        // 🔹 Ensure TWILIO_PHONE_NUMBER is loaded
        if (!process.env.TWILIO_PHONE_NUMBER) {
            return ResponseHandler.error(res, message="Twilio phone number is missing in environment variables.");
        }

        // 🔹 Send OTP via Twilio
        const message = await twilioClient.messages.create({
            body: `Your OTP is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });

        // 🔹 Store OTP temporarily (expires after 5 mins)
        otpStore.set(phone, otp);

        console.log(`✅ OTP sent to ${phone}: ${otp}`);
        return ResponseHandler.success(res, 200, "OTP sent successfully!", { sid: message.sid });


});

// ✅ Verify OTP & Generate JWT
export const verifyOtp = apiHandler(async (req, res) => {
    const { phone, otp, role } = req.body; // 🔹 Accept `role` from frontend

    if (!phone || !otp || !role) {
        return ResponseHandler.badRequest(res, "Phone number, OTP, and role are required.");
    }

    const storedOtp = otpStore.get(phone);
    if (!storedOtp) {
        return ResponseHandler.unauthorized(res, "Invalid OTP.");
    }

    let user = await prisma.worker.findUnique({ where: { Number: phone } }) ||
               await prisma.employer.findUnique({ where: { Number: phone } });

    // 🔹 If user not found, create a new user based on role
    if (!user) {
        if (role === "Worker") {
            user = await prisma.worker.create({
                data: { Number: phone }
            });
        } else if (role === "Employer") {
            user = await prisma.employer.create({
                data: { Number: phone}
            });
        } else {
            return ResponseHandler.badRequest(res, "Invalid role. Must be 'Worker' or 'Employer'.");
        }
    }

    // 🔹 Generate JWT Token
    const token = jwt.sign(
        { id: user.Id, role: role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    // 🔹 Remove OTP after successful login
    otpStore.delete(phone);

    return ResponseHandler.success(res, 200, "OTP verified successfully!", { token, user });
});
