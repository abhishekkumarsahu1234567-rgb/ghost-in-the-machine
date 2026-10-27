
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
      return res.status(400).json({ error: "Prompt must be under 1000 characters." });
    }

    const apiKey = process.env.OLLAMA_API_KEY;
    let response;
    let story;

    if (apiKey) {
      response = await fetch("https://ollama.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || "gemma4:31b",
          messages: [
            {
              role: "user",
              content: `Write a spooky story under 250 words based on this idea: ${prompt.trim()}`,
            },
          ],
          stream: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Ollama Cloud error:", response.status);
        return res.status(502).json({ error: "Hosted AI could not generate a story." });
      }

      story = data.message?.content;
    } else {
      response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:1b",
          prompt: `Write a spooky story under 250 words based on this idea: ${prompt.trim()}`,
          stream: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(502).json({ error: "Local Ollama could not generate a story." });
      }

      story = data.response;
    }

    if (!story) {
      return res.status(502).json({ error: "No story returned. Please try again." });
    }

    res.json({ story });
  } catch (error) {
    console.error("Story generation failed:", error.message);
    res.status(503).json({ error: "AI service unavailable. Please try again." });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Ghost API listening on port ${PORT}`);
});
