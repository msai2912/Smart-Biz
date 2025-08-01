import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SimpleBusinessForm from '../website/components/SimpleBusinessForm';
import WebsitePreview from '../website/components/WebsitePreview';
import EnhancedWebsiteGenerator from '../website/services/enhancedWebsiteGenerator';
import LoadingSpinner from '../website/components/LoadingSpinner';
import './EnhancedWebsiteBuilderPage.css';


const EnhancedWebsiteBuilderPage = () => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [businessDescription, setBusinessDescription] = useState('');
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);


  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleFormSubmit = async (description) => {
    setBusinessDescription(description);
    setCurrentStep(2);
    // Automatically start generation
    await handleGenerateWebsite(description);
  };

  const handleTemplateSelect = (templateId) => {
    // No longer needed - AI will select template automatically
  };

  const handleGenerateWebsite = async (description = businessDescription) => {
    if (!description) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Generate the website using AI with just the business description
      // AI will automatically determine template, style, colors, content, etc.
      const result = await EnhancedWebsiteGenerator.generateFromDescription(description);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (result.success) {
        setGeneratedWebsite(result.data);
        setCurrentStep(3);
      } else {
        throw new Error('Website generation failed');
      }

    } catch (error) {
      console.error('Website generation error:', error);
      setError('Failed to generate website. Please try again.');
      setCurrentStep(1); // Go back to input form
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep(1);
    setBusinessDescription('');
    setGeneratedWebsite(null);
    setError(null);
  };

  const handleRegenerateWebsite = () => {
    setCurrentStep(2);
    setGeneratedWebsite(null);
    setError(null);
    handleGenerateWebsite();
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
  };

  // Handle ESC key to exit full screen
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isFullScreen) {
        handleExitFullScreen();
      }
    };

    if (isFullScreen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isFullScreen]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <h1>AI Website Builder</h1>
              <p>Describe your business and let AI create a professional website for you</p>
            </div>
            <SimpleBusinessForm 
              onSubmit={handleFormSubmit}
              isLoading={isGenerating}
            />
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <h1>Generating Your Website</h1>
              <p>Our AI is analyzing your business and creating a custom website</p>
            </div>

            <div className="generation-section">
              <div className="business-summary">
                <h3>Your Business Description</h3>
                <p style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', fontStyle: 'italic' }}>
                  "{businessDescription}"
                </p>
              </div>

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button 
                    className="btn-secondary"
                    onClick={handleBackToForm}
                  >
                    Try Again
                  </button>
                </div>
              )}

              <div className="generation-progress">
                <LoadingSpinner />
                <h3>AI is working on your website...</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <p style={{ textAlign: 'center', color: '#667eea', fontWeight: '600' }}>
                  {generationProgress}% Complete
                </p>
                <div className="generation-steps">
                  <div className={`step ${generationProgress > 10 ? 'completed' : ''}`}>
                    🧠 Analyzing business description
                  </div>
                  <div className={`step ${generationProgress > 30 ? 'completed' : ''}`}>
                    🎨 Selecting optimal template & design
                  </div>
                  <div className={`step ${generationProgress > 50 ? 'completed' : ''}`}>
                    ✍️ Generating custom content
                  </div>
                  <div className={`step ${generationProgress > 70 ? 'completed' : ''}`}>
                    🎯 Optimizing layout & structure
                  </div>
                  <div className={`step ${generationProgress > 90 ? 'completed' : ''}`}>
                    ✨ Final touches & polish
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <h1>Your Website is Ready!</h1>
              <p>AI has created a custom website based on your business description</p>
            </div>

            {generatedWebsite && (
              <div className="website-preview-section">
                <div className="generation-info">
                  <div className="info-badge">
                    <span className="badge-icon">🎨</span>
                    Template: {generatedWebsite?.template || 'Auto-Selected'}
                  </div>
                  <div className="info-badge">
                    <span className="badge-icon">🌈</span>
                    Style: {generatedWebsite?.style || 'AI-Optimized'}
                  </div>
                  <div className="info-badge">
                    <span className="badge-icon">📝</span>
                    Content: Custom Generated
                  </div>
                </div>

                <WebsitePreview
                  businessInfo={generatedWebsite.businessInfo}
                  content={generatedWebsite.content}
                  template={generatedWebsite.template}
                  styles={generatedWebsite.styles}
                />

                <div className="preview-controls">
                  <button 
                    onClick={handleBackToForm}
                    className="btn-secondary"
                  >
                    Start Over
                  </button>
                  <button 
                    onClick={handleRegenerateWebsite}
                    className="btn-secondary"
                  >
                    Regenerate
                  </button>
                  <button 
                    onClick={handleFullScreenToggle}
                    className="btn-secondary"
                  >
                    🔍 Full Screen Preview
                  </button>
                  <button className="btn-primary">
                    Download Website
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="enhanced-website-builder">
        

        <main className="builder-main">
          {renderStepContent()}
        </main>

        <footer className="builder-footer">
          <div className="footer-content">
            <p>Powered by Gemini AI • Creating beautiful websites for small businesses</p>
          </div>
        </footer>
      </div>

      {/* Full Screen Preview Modal */}
      {isFullScreen && generatedWebsite && (
        <div 
          className="fullscreen-modal"
          onClick={handleExitFullScreen}
        >
          <div className="fullscreen-header">
            <div className="fullscreen-title">
              <h3>Full Screen Preview</h3>
              <span className="preview-info">Your AI-generated website • Click anywhere to close or press ESC</span>
            </div>
            <button 
              onClick={handleExitFullScreen}
              className="exit-fullscreen-btn"
              title="Exit Full Screen (ESC)"
            >
              ✕
            </button>
          </div>
          <div 
            className="fullscreen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <WebsitePreview
              businessInfo={generatedWebsite.businessInfo}
              content={generatedWebsite.content}
              template={generatedWebsite.template}
              styles={generatedWebsite.styles}
              isFullScreen={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedWebsiteBuilderPage;
