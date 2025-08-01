import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt) {
      setError("Please enter a prompt");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/generate-image",
        { prompt }
      );
      setImageUrl(response.data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!imageUrl || !caption) {
      setError("Image and caption are required");
      return;
    }
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/post-to-twitter",
        { imageUrl, caption }
      );
      alert(response.data.message);
    } catch (err) {
      console.error("Error posting to Twitter/X:", err);
      setError("Failed to post to Twitter/X");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Create and Share Your Business Poster
      </h1>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">How it works:</h2>
          <ol className="list-decimal list-inside text-gray-700 text-base">
            <li className="mb-1">
              <b>Describe</b> what you want on your poster below.
            </li>
            <li className="mb-1">
              <b>Click</b> "Create My Poster" to generate your image.
            </li>
            <li className="mb-1">
              <b>Write</b> a short caption for social media (optional).
            </li>
            <li>
              <b>Share</b> your poster directly to Twitter/X with one click!
            </li>
          </ol>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            1. What should your poster say or show?
          </label>
          <textarea
            className="mt-1 w-full p-2 border rounded-md"
            rows="4"
            placeholder="E.g., Create a poster for a 20% discount on coffee mugs"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Creating your poster..." : "Create My Poster"}
        </button>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {imageUrl && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">
              2. Your Poster is Ready!
            </h2>
            <img
              src={imageUrl}
              alt="Generated Poster"
              className="w-full rounded-md border"
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                3. Add a caption for Twitter/X (optional):
              </label>
              <input
                type="text"
                className="mt-1 w-full p-2 border rounded-md"
                placeholder="E.g., 20% off coffee mugs this week!"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <button
                className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                onClick={handlePost}
              >
                Share to Twitter/X
              </button>
              <p className="text-xs text-gray-500 mt-1">
                You will be asked to log in to your Twitter/X account if needed.
              </p>
            </div>
          </div>
        )}
      </div>
      <p className="mt-6 text-gray-500 text-center text-sm max-w-lg">
        This tool is made for everyone. No design or tech skills needed—just
        describe your idea and we’ll do the rest!
      </p>
    </div>
  );
}

export default App;
