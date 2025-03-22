import React, { useState } from "react";
import OpenAI from "openai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const openaiq = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Get API key from .env
  dangerouslyAllowBrowser: true, // Required for frontend requests
});

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!input.trim()) {
      toast.warn("Please enter text to check!");
      return;
    }

    setLoading(true);
    try {
      const moderation = await openaiq.moderations.create({
        model: "text-moderation-latest",
        input: input,
      });

      setResult(moderation.results[0]);
      toast.success("Moderation check completed!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to check moderation.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🛡 Moderation Check</h1>
      <textarea
        className="input-box"
        rows="4"
        placeholder="Enter text to moderate..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="btn" onClick={handleCheck} disabled={loading}>
        {loading ? "Checking..." : "Check Moderation"}
      </button>

      {result && (
        <div className="result-box">
          <h2>Moderation Result</h2>
          <div className="result-content">
            <p><strong>Flagged:</strong> {result.flagged ? "✅ Yes" : "❌ No"}</p>
            <h3>Categories:</h3>
            <ul>
              {Object.entries(result.categories).map(([key, value]) => (
                <li key={key} className={value ? "flagged" : "safe"}>
                  {key.replace(/_/g, " ")}: {value ? "⚠️ Flagged" : "✔ Safe"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
