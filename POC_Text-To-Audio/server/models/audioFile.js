const mongoose = require("mongoose");

const audioFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pdfFilename: { type: String, required: true },
  audioFilename: { type: String, required: true },
  voiceOptions: { type: Object }, // e.g., { language: 'en-US', speed: 1.0 }
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AudioFile", audioFileSchema);
