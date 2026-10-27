
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Ghost in the Machine API is running 👻" });
});

app.post("/api/story", async (req, res) => {
  try {
    const { prompt } = req.body || {};

    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Enter a story idea." });
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: `Write a spooky story under 250 words based on this idea: ${prompt.trim()}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Ollama request failed.");
    }

    const data = await response.json();
    res.json({ story: data.response });
  } catch (error) {
    console.error(error.message);
    res.status(503).json({
      error: "AI unavailable. Make sure Ollama is running.",
    });
  }
});

app.listen(3001, () => {
  console.log("Ghost API running at http://localhost:3001");
});
