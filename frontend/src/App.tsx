
import { useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api/story";

function App() {
  const [prompt, setPrompt] = useState("");
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    const currentPrompt = prompt.trim();

    if (!currentPrompt || loading) return;

    // Clear the previous story when a new prompt is submitted
    setStory("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      const data: { story?: string; error?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Story generation failed.");
      }

      if (!data.story) {
        throw new Error("No story returned. Please try again.");
      }

      setStory(data.story);
      setPrompt("");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app">
      <div className="moon" aria-hidden="true">
        ☾
      </div>

      <p className="eyebrow">AN OPEN-SOURCE AI EXPERIMENT</p>

      <h1>
        Ghost in the Machine<span>.</span>
      </h1>

      <p className="subtitle">
        Every machine has a story. Some should stay forgotten.
      </p>

      <section className="terminal">
        <div className="terminal-header">
          <div className="dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <span>unknown_process.exe</span>

          <span className="status">
            {loading ? "SUMMONING..." : "LOCAL AI"}
          </span>
        </div>

        <label htmlFor="ghost-prompt">ENTER YOUR HAUNTED INPUT</label>

        <textarea
          id="ghost-prompt"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="A computer starts receiving messages from its previous owner..."
          rows={4}
          disabled={loading}
        />

        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={loading || !prompt.trim()}
        >
          {loading ? "GENERATING STORY..." : "GENERATE GHOST STORY ↗"}
        </button>

        <div className="output" aria-live="polite">
          <p className="output-label">THE MACHINE WHISPERS</p>

          {loading && (
            <p className="loading-state">
              <span className="loading-orb" />
              The machine is remembering...
            </p>
          )}

          {!loading && error && (
            <p className="error-message">{error}</p>
          )}

          {!loading && !error && story && (
            <div className="story-text">{story}</div>
          )}

          {!loading && !error && !story && (
            <p className="empty-state">
              No whispers yet. Enter a prompt and awaken the machine.
            </p>
          )}
        </div>
      </section>

      <footer>
        BUILT WITH CURIOSITY · POWERED BY LOCAL AI
        <br />
        YOUR STORIES BEGIN IN THE DARK.
      </footer>
    </main>
  );
}

export default App;
