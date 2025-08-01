import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext'; // <-- File not found, comment or fix path
import EnhancedBusinessForm from '../website/components/EnhancedBusinessForm';
import TemplatePreview from '../website/components/TemplatePreview';
import WebsitePreview from '../website/components/WebsitePreview';
import EnhancedWebsiteGenerator from '../website/services/enhancedWebsiteGenerator';
import LoadingSpinner from '../website/components/LoadingSpinner';
import './EnhancedWebsiteBuilderPage.css';


const EnhancedWebsiteBuilderPage = () => {
  // const { currentUser } = useAuth(); // <-- File not found, comment or fix path
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [formData, setFormData] = useState(null);
  const [generatedWebsite, setGeneratedWebsite] = useState(null);
  const [error, setError] = useState(null);


  // if (!currentUser) {
  //   return <Navigate to="/login" />;
  // }

  const handleFormSubmit = async (submittedData) => {
    setFormData(submittedData);
    setCurrentStep(2);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleGenerateWebsite = async () => {
    if (!formData) return;

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

      // Generate the website using AI
      const result = await EnhancedWebsiteGenerator.generateCompleteWebsite(
        formData.businessInfo,
        formData.userPreferences,
        formData.contentRequirements,
        selectedTemplate
      );

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
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const handleBackToForm = () => {
    setCurrentStep(1);
    setFormData(null);
    setGeneratedWebsite(null);
    setError(null);
  };

  const handleBackToTemplate = () => {
    setCurrentStep(2);
    setGeneratedWebsite(null);
    setError(null);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <h1>AI Website Builder</h1>
              <p>Create a professional website tailored to your business with the power of AI</p>
            </div>
            <EnhancedBusinessForm 
              onSubmit={handleFormSubmit}
              isLoading={isGenerating}
            />
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <h1>Choose Your Template</h1>
              <p>Select a design template that matches your business style</p>
            </div>

            <div className="template-selection">
              <TemplatePreview
                businessInfo={formData?.businessInfo}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={handleTemplateSelect}
                generatedStyles={null} // Will be generated after template selection
              />
            </div>

            <div className="generation-section">
              <div className="business-summary">
                <h3>Business Summary</h3>
                <div className="summary-item">
                  <span className="label">Business Name:</span>
                  <span className="value">{formData?.businessInfo?.name}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Type:</span>
                  <span className="value">{formData?.businessInfo?.type}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Style Preference:</span>
                  <span className="value">{formData?.userPreferences?.style || 'Not specified'}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Content Tone:</span>
                  <span className="value">{formData?.userPreferences?.tone || 'Not specified'}</span>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={() => setError(null)} className="btn-secondary">
                    Dismiss
                  </button>
                </div>
              )}

              {isGenerating ? (
                <div className="generation-progress">
                  <LoadingSpinner />
                  <h3>Generating Your Website...</h3>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p>{generationProgress}% Complete</p>
                  <div className="generation-steps">
                    <div className={`step ${generationProgress >= 20 ? 'completed' : ''}`}>
                      Analyzing your business
                    </div>
                    <div className={`step ${generationProgress >= 40 ? 'completed' : ''}`}>
                      Generating content with AI
                    </div>
                    <div className={`step ${generationProgress >= 60 ? 'completed' : ''}`}>
                      Creating design system
                    </div>
                    <div className={`step ${generationProgress >= 80 ? 'completed' : ''}`}>
                      Building your website
                    </div>
                    <div className={`step ${generationProgress >= 100 ? 'completed' : ''}`}>
                      Finalizing details
                    </div>
                  </div>
                </div>
              ) : (
                <div className="generation-controls">
                  <button 
                    onClick={handleGenerateWebsite}
                    className="btn-primary generate-btn"
                    disabled={!selectedTemplate}
                  >
                    🚀 Generate My Website with AI
                  </button>
                  <button 
                    onClick={handleBackToForm}
                    className="btn-secondary"
                  >
                    ← Back to Form
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <h1>Your Website is Ready!</h1>
              <p>Review your AI-generated website and make any adjustments</p>
            </div>

            {generatedWebsite && (
              <div className="website-preview-section">
                <div className="generation-info">
                  <div className="info-badge">
                    <span className="badge-icon">🤖</span>
                    <span>Generated with AI</span>
                  </div>
                  <div className="info-badge">
                    <span className="badge-icon">⚡</span>
                    <span>Template: {selectedTemplate}</span>
                  </div>
                  <div className="info-badge">
                    <span className="badge-icon">🎨</span>
                    <span>Custom Styling</span>
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
                    onClick={handleBackToTemplate}
                    className="btn-secondary"
                  >
                    ← Back to Templates
                  </button>
                  <button 
                    onClick={handleBackToForm}
                    className="btn-secondary"
                  >
                    ← Start Over
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
    <div className="enhanced-website-builder">
      <header className="builder-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
        
        <div className="progress-indicator">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Business Info</span>
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Template & Generate</span>
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Preview & Customize</span>
          </div>
        </div>
      </header>

      <main className="builder-main">
        {renderStepContent()}
      </main>

      <footer className="builder-footer">
        <div className="footer-content">
          <p>Powered by Gemini AI • Creating beautiful websites for small businesses</p>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedWebsiteBuilderPage;
