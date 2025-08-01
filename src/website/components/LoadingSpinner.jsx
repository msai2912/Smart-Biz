import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ message = "", stage = "", progress = null }) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="loading-content">
          <h3>{message}</h3>
          {stage && <p className="loading-stage">{stage}</p>}
          {progress !== null && (
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="loading-tips">
        <h4>💡 Did you know?</h4>
        <ul>
          <li>Our AI analyzes your business type to suggest the best color schemes</li>
          <li>We generate professional content tailored to your industry</li>
          <li>You can edit all AI-generated content to match your preferences</li>
          <li>Your website will be responsive and mobile-friendly</li>
        </ul>
      </div>
    </div>
  );
}

export default LoadingSpinner;
