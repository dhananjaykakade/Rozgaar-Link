import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"; // ✅ Ensure API URL is set

export const sendOtpApi = async (phone: string, role: string) => {
  const response = await axios.post(`${API_URL}/auth/send-otp`, { phone, role });
  return response.data;
};

export const verifyOtpApi = async (phone: string, otp: string, role: string) => {
  if (!phone || !otp || !role) {
    console.log("Phone, OTP, and role are required");
  }
  const response = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp, role });
  return response.data.data;
};

export const fetchEmployerJobsApi = async (employerId: string) => {
  const response = await axios.get(`${API_URL}/job/67de8f6145cdb206f77da214/jobs`);
  return response.data.data;
};