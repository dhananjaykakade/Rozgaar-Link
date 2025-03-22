require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(express.json());
app.use(cors());

const openaiq = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Secure API key
});

app.post("/moderation", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input text is required." });
    }

    const moderation = await openaiq.moderations.create({
      model: "omni-moderation-latest",
      input,
    });

    res.json(moderation);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to fetch moderation results." });
  }
});

app.listen(5000, () => console.log("🚀 Backend running on port 5000"));
