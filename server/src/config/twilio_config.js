import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
    throw new Error("Twilio credentials are missing in .env");
}

const twilioClient = twilio(accountSid, authToken);
export default twilioClient;
