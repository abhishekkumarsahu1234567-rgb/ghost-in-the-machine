
const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({ message: "Ghost in the Machine API is running 👻" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/story", async (req, res) => {
  try {
    const { prompt } = req.body || {};

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Enter a story idea." });
    }

    if (prompt.length > 1000) {
      return res.status(400).json({
        error: "Prompt must be under 1000 characters.",
      });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error("GROQ_API_KEY is missing");
      return res.status(500).json({
        error: "AI service is not configured.",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "You are a creative horror storyteller. Write original, atmospheric spooky stories under 250 words.",
            },
            {
              role: "user",
              content: `Write a spooky story based on this idea: ${prompt.trim()}`,
            },
          ],
          max_completion_tokens: 700,
          stream: false,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "Groq API error:",
        response.status,
        data?.error?.message || "Unknown API error"
      );

      return res.status(502).json({
        error: "Hosted AI could not generate a story. Please try again later.",
      });
    }

    const story = data.choices?.[0]?.message?.content;

    if (!story) {
      console.error("Groq returned no story");
      return res.status(502).json({
        error: "No story returned. Please try again.",
      });
    }

    return res.json({ story });
  } catch (error) {
    console.error("Story generation failed:", error.message);

    return res.status(503).json({
      error: "AI service unavailable. Please try again.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Ghost API listening on port ${PORT}`);
});
