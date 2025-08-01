import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./ContentGenerationPage.css";

function ContentGenerationPage() {
  const { currentUser } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

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
    <div className="content-generation-page">
      <div className="content-container">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <span className="title-icon">🎨</span>
              AI Content Generator
            </h1>
            <p className="page-subtitle">
              Create stunning business posters and marketing content with AI. 
              Perfect for {currentUser.businessName || 'your business'} social media and promotions.
            </p>
          </div>
        </div>

        <div className="generation-layout">
          {/* Input Section */}
          <div className="input-section">
            <div className="how-it-works">
              <h2 className="section-title">
                <span className="section-icon">💡</span>
                How it works
              </h2>
              <div className="steps-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <strong>Describe</strong> what you want on your poster below
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <strong>Click</strong> "Create My Poster" to generate your image
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <strong>Write</strong> a caption for social media (optional)
                  </div>
                </div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <strong>Share</strong> your poster directly to Twitter/X!
                  </div>
                </div>
              </div>
            </div>

            <div className="input-form">
              <div className="form-group">
                <label htmlFor="prompt" className="form-label">
                  <span className="label-icon">✏️</span>
                  What should your poster say or show?
                </label>
                <textarea
                  id="prompt"
                  className="form-textarea"
                  rows="5"
                  placeholder={`E.g., Create a poster for ${currentUser.businessName || 'my business'} with 20% discount on our products`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating your poster...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Create My Poster
                  </>
                )}
              </button>
              
              {error && (
                <div className="error-message">
                  <span className="error-icon">❌</span>
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          {imageUrl && (
            <div className="results-section">
              <h2 className="section-title">
                <span className="section-icon">🎉</span>
                Your Poster is Ready!
              </h2>
              
              <div className="image-preview">
                <img
                  src={imageUrl}
                  alt="Generated Poster"
                  className="generated-image"
                />
              </div>
              
              <div className="sharing-section">
                <div className="form-group">
                  <label htmlFor="caption" className="form-label">
                    <span className="label-icon">📝</span>
                    Add a caption for Twitter/X (optional)
                  </label>
                  <input
                    type="text"
                    id="caption"
                    className="form-input"
                    placeholder={`E.g., Check out our latest promotion at ${currentUser.businessName || 'our business'}!`}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>
                
                <button
                  className="share-btn"
                  onClick={handlePost}
                >
                  <span className="btn-icon">🐦</span>
                  Share to Twitter/X
                </button>
                
                <p className="share-note">
                  You will be asked to log in to your Twitter/X account if needed.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="page-footer">
          <p className="footer-text">
            <span className="footer-icon">✨</span>
            This AI-powered tool is designed for everyone. No design or tech skills needed—just 
            describe your idea and we'll create professional marketing content for your business!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContentGenerationPage;
