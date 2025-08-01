import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import './WebsiteBuilderPage.css';

const WebsiteBuilderPage = () => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [websiteData, setWebsiteData] = useState({
    businessName: currentUser?.businessName || '',
    businessType: currentUser?.businessType || 'Retail',
    primaryColor: '#4A90E2',
    secondaryColor: '#50E3C2',
    fonts: 'Inter',
    description: '',
    tagline: '',
    contactEmail: currentUser?.email || '',
    contactPhone: '',
    address: '',
    template: 'modern'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWebsiteData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate website generation
    setTimeout(() => {
      setIsGenerating(false);
      setPreviewUrl('https://via.placeholder.com/1200x800?text=Generated+Website+Preview');
      setCurrentStep(4);
    }, 3000);
  };

  const templates = [
    { id: 'modern', name: 'Modern & Clean', image: 'https://via.placeholder.com/300x200?text=Modern+Template' },
    { id: 'bold', name: 'Bold & Colorful', image: 'https://via.placeholder.com/300x200?text=Bold+Template' },
    { id: 'minimal', name: 'Minimal', image: 'https://via.placeholder.com/300x200?text=Minimal+Template' },
    { id: 'elegant', name: 'Elegant', image: 'https://via.placeholder.com/300x200?text=Elegant+Template' }
  ];

  return (
    <div className="website-builder-container">
      <header className="builder-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>AI Website Builder</h1>
        <p>Create a professional website for your business in minutes</p>
      </header>

      <main className="builder-main">
        {/* Progress steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-text">Business Info</div>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-text">Design Options</div>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-text">Content</div>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-number">4</div>
            <div className="step-text">Review & Publish</div>
          </div>
        </div>

        {/* Step 1: Business Info */}
        {currentStep === 1 && (
          <div className="builder-step">
            <h2>Tell us about your business</h2>
            <form className="builder-form">
              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={websiteData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="businessType">Business Type</label>
                <select
                  id="businessType"
                  name="businessType"
                  value={websiteData.businessType}
                  onChange={handleChange}
                >
                  <option value="Retail">Retail</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Business Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={websiteData.description}
                  onChange={handleChange}
                  placeholder="Describe what your business does..."
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="next-button" onClick={handleNextStep}>
                  Continue to Design
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Design Options */}
        {currentStep === 2 && (
          <div className="builder-step">
            <h2>Choose your website design</h2>
            <form className="builder-form">
              <div className="form-section">
                <h3>Select a Template</h3>
                <div className="template-grid">
                  {templates.map(template => (
                    <div
                      key={template.id}
                      className={`template-card ${websiteData.template === template.id ? 'selected' : ''}`}
                      onClick={() => setWebsiteData(prev => ({ ...prev, template: template.id }))}
                    >
                      <img src={template.image} alt={template.name} />
                      <div className="template-name">{template.name}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="form-section">
                <h3>Colors & Fonts</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="primaryColor">Primary Color</label>
                    <div className="color-picker">
                      <input
                        type="color"
                        id="primaryColor"
                        name="primaryColor"
                        value={websiteData.primaryColor}
                        onChange={handleChange}
                      />
                      <span>{websiteData.primaryColor}</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="secondaryColor">Secondary Color</label>
                    <div className="color-picker">
                      <input
                        type="color"
                        id="secondaryColor"
                        name="secondaryColor"
                        value={websiteData.secondaryColor}
                        onChange={handleChange}
                      />
                      <span>{websiteData.secondaryColor}</span>
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="fonts">Font Style</label>
                  <select
                    id="fonts"
                    name="fonts"
                    value={websiteData.fonts}
                    onChange={handleChange}
                  >
                    <option value="Inter">Modern (Inter)</option>
                    <option value="Roboto">Clean (Roboto)</option>
                    <option value="Playfair Display">Elegant (Playfair)</option>
                    <option value="Poppins">Friendly (Poppins)</option>
                  </select>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="back-button" onClick={handlePrevStep}>
                  Back
                </button>
                <button type="button" className="next-button" onClick={handleNextStep}>
                  Continue to Content
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Content */}
        {currentStep === 3 && (
          <div className="builder-step">
            <h2>Add your content</h2>
            <form className="builder-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="tagline">Tagline / Slogan (optional)</label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  value={websiteData.tagline}
                  onChange={handleChange}
                  placeholder="A catchy phrase that represents your business"
                />
              </div>
              
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-group">
                  <label htmlFor="contactEmail">Email</label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={websiteData.contactEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactPhone">Phone (optional)</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={websiteData.contactPhone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Business Address (optional)</label>
                  <textarea
                    id="address"
                    name="address"
                    value={websiteData.address}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="back-button" onClick={handlePrevStep}>
                  Back
                </button>
                <button type="submit" className="generate-button" disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate My Website'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Preview & Publish */}
        {currentStep === 4 && (
          <div className="builder-step">
            <h2>Your website is ready!</h2>
            <div className="preview-container">
              <div className="website-preview">
                <img src={previewUrl} alt="Your website preview" />
              </div>
              
              <div className="publish-options">
                <h3>Your website has been created</h3>
                <p>You can now preview your website, make edits, or publish it live.</p>
                
                <div className="publish-actions">
                  <button className="publish-button">Publish Website</button>
                  <button className="edit-button">Make Changes</button>
                  <a href="#" className="preview-link" target="_blank" rel="noopener noreferrer">
                    Open Full Preview
                  </a>
                </div>
                
                <div className="completion-message">
                  <h4>What's next?</h4>
                  <ul>
                    <li>Add your products or services</li>
                    <li>Create blog posts with our AI content generator</li>
                    <li>Connect your social media accounts</li>
                    <li>Set up your custom domain name</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default WebsiteBuilderPage;
