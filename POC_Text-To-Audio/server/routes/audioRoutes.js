const express = require("express");
const router = express.Router();
const { uploadAndConvertPDF } = require("../controllers/audioController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("pdfFile"), uploadAndConvertPDF);

module.exports = router;
