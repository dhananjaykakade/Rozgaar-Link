import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the correct directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to Firebase service account key
const serviceAccountPath = path.join(__dirname, "firebaseServiceKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Firebase service account JSON file is missing! Expected at: ${serviceAccountPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin SDK for authentication
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("✅ Firebase Admin SDK Initialized (Authentication Only)!");

export default admin;
