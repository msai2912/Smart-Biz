import React, { useState } from 'react';
import './SimpleBusinessForm.css';

function SimpleBusinessForm({ onSubmit, isLoading }) {
  const [businessDescription, setBusinessDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!businessDescription.trim()) {
      setError('Please describe your business');
      return;
    }

    if (businessDescription.trim().length < 10) {
      setError('Please provide a more detailed description (at least 10 characters)');
      return;
    }

    setError('');
    onSubmit(businessDescription.trim());
  };

  const handleDescriptionChange = (e) => {
    setBusinessDescription(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="simple-business-form">
      <div className="form-container">
        <div className="form-header">
          <h2>Tell us about your business</h2>
          <p>Describe your business in detail and let our AI create the perfect website for you</p>
        </div>

        <form onSubmit={handleSubmit} className="business-form">
          <div className="form-group">
            <label htmlFor="businessDescription">
              Business Description *
            </label>
            <textarea
              id="businessDescription"
              value={businessDescription}
              onChange={handleDescriptionChange}
              placeholder="Example: We are a modern Italian restaurant located in downtown Seattle. We specialize in authentic wood-fired pizza and fresh pasta dishes. Our atmosphere is warm and family-friendly, and we offer both dine-in and takeout options. We pride ourselves on using locally sourced ingredients and traditional cooking methods..."
              rows={8}
              className={error ? 'error' : ''}
              disabled={isLoading}
            />
            <div className="char-count">
              {businessDescription.length} characters
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="form-tips">
            <h3>💡 Tips for a great description:</h3>
            <ul>
              <li><strong>Business type:</strong> What kind of business is it? (restaurant, salon, shop, etc.)</li>
              <li><strong>Services/Products:</strong> What do you offer to customers?</li>
              <li><strong>Target audience:</strong> Who are your ideal customers?</li>
              <li><strong>Unique selling points:</strong> What makes you different from competitors?</li>
              <li><strong>Atmosphere/Style:</strong> What's the vibe of your business? (professional, casual, luxury, etc.)</li>
              <li><strong>Location:</strong> Where are you located and does it matter to your business?</li>
            </ul>
          </div>

          <div className="example-descriptions">
            <h3>📝 Example descriptions:</h3>
            
            <div className="example-card" onClick={() => setBusinessDescription("We are a boutique fitness studio specializing in yoga and pilates classes in downtown Portland. Our modern, minimalist space offers small group classes with personalized attention from certified instructors. We focus on wellness, mindfulness, and building a supportive community. Our clients are health-conscious professionals aged 25-45 who value quality instruction and a peaceful environment.")}>
              <strong>Fitness Studio:</strong>
              <p>"We are a boutique fitness studio specializing in yoga and pilates classes in downtown Portland. Our modern, minimalist space offers small group classes with personalized attention from certified instructors..."</p>
            </div>

            <div className="example-card" onClick={() => setBusinessDescription("Smith & Associates is a full-service accounting firm serving small to medium businesses in the greater Chicago area. We provide tax preparation, bookkeeping, financial consulting, and business advisory services. Our team of certified CPAs has over 20 years of experience helping entrepreneurs and business owners manage their finances and grow their companies. We pride ourselves on personalized service and building long-term relationships with our clients.")}>
              <strong>Professional Services:</strong>
              <p>"Smith & Associates is a full-service accounting firm serving small to medium businesses in the greater Chicago area. We provide tax preparation, bookkeeping, financial consulting..."</p>
            </div>

            <div className="example-card" onClick={() => setBusinessDescription("Artisan Coffee Roasters is a specialty coffee shop and roastery located in the arts district of Austin, Texas. We roast our own beans from single-origin farms and serve expertly crafted espresso drinks, pour-overs, and cold brew. Our industrial-chic space features local artwork and provides a creative atmosphere for remote workers, students, and coffee enthusiasts. We also sell whole bean coffee online and supply local restaurants.")}>
              <strong>Coffee Shop:</strong>
              <p>"Artisan Coffee Roasters is a specialty coffee shop and roastery located in the arts district of Austin, Texas. We roast our own beans from single-origin farms..."</p>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading || !businessDescription.trim()}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Generating Website...
                </>
              ) : (
                <>
                  🚀 Create My Website with AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SimpleBusinessForm;
