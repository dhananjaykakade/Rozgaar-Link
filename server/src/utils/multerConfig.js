import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger } from './logger.js';

// 🔹 Ensure `uploads/` directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 🔹 Log to check if `req.body` exists
    console.log("➡️ Multer Req Body:", req.body);

    // 🔹 Extract `userNumber` and `documentType`
    setTimeout(() => {  // ⚠️ Delayed execution to access `req.body`
      const userNumber = req.body?.userNumber?.replace(/\s+/g, '_') || 'unknown';
      const documentType = file.fieldname || 'document'; // Use `file.fieldname` directly
      const ext = path.extname(file.originalname);
      cb(null, `${userNumber}_${documentType}${ext}`);
    }, 100); // ✅ Ensures `req.body` is available
  }
});

// 🔹 File validation and limits
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      logger.error(`❌ Invalid file type: ${file.originalname} (${file.mimetype})`);
      cb(new Error('❌ Invalid file type. Only PDF, JPG, and PNG allowed.'));
    }
  },
});

export default upload;
