require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdf = require("pdf-parse");
const gTTS = require("gtts");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve static files from the 'audio' directory
app.use("/audio", express.static(path.join(__dirname, "audio")));

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle PDF file upload and conversion
app.post("/upload-pdf", upload.single("pdfFile"), async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const dataBuffer = fs.readFileSync(pdfPath);

    // Parse PDF to extract text
    const data = await pdf(dataBuffer);
    const text = data.text;

    // Convert text to speech and save as MP3
    const gtts = new gTTS(text, "en");
    const audioFileName = `${req.file.filename}.mp3`;
    const audioPath = path.join(__dirname, "audio", audioFileName);

    gtts.save(audioPath, function (err, result) {
      if (err) {
        throw new Error(err);
      }

      // Return the full URL to the audio file
      const audioUrl = `/audio/${audioFileName}`;
      res.status(200).json({ message: "PDF converted to audio", audioPath: audioUrl });
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing PDF", error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
