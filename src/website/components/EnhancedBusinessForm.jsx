import React, { useState } from 'react';
import './EnhancedBusinessForm.css';

const businessTypes = [
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️', description: 'Food service, cafes, bars' },
  { id: 'retail', name: 'Retail Store', icon: '🛍️', description: 'Shops, boutiques, e-commerce' },
  { id: 'salon', name: 'Salon/Spa', icon: '💇', description: 'Beauty, wellness, personal care' },
  { id: 'professional', name: 'Professional Services', icon: '👔', description: 'Consulting, legal, accounting' },
  { id: 'fitness', name: 'Fitness/Gym', icon: '💪', description: 'Gyms, personal training, sports' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', description: 'Medical, dental, therapy' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠', description: 'Property sales, rentals' },
  { id: 'education', name: 'Education', icon: '📚', description: 'Schools, tutoring, training' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', description: 'Auto repair, sales, services' },
  { id: 'home-services', name: 'Home Services', icon: '🔧', description: 'Cleaning, repair, maintenance' },
  { id: 'photography', name: 'Photography', icon: '📸', description: 'Event, portrait, commercial' },
  { id: 'technology', name: 'Technology', icon: '💻', description: 'IT services, web development' }
];

const designStyles = [
  { id: 'modern', name: 'Modern & Clean', description: 'Minimalist, lots of white space, clean lines' },
  { id: 'bold', name: 'Bold & Dynamic', description: 'Vibrant colors, strong typography, high impact' },
  { id: 'elegant', name: 'Elegant & Sophisticated', description: 'Refined, premium feel, subtle details' },
  { id: 'playful', name: 'Playful & Creative', description: 'Fun colors, creative layouts, unique elements' },
  { id: 'professional', name: 'Professional & Corporate', description: 'Conservative, trustworthy, business-focused' },
  { id: 'artistic', name: 'Artistic & Unique', description: 'Creative expression, unique layouts, artistic flair' }
];

const colorMoods = [
  { id: 'trust', name: 'Trustworthy', colors: ['#4A90E2', '#2E5BBA', '#1E3A8A'], description: 'Blues for reliability and trust' },
  { id: 'energy', name: 'Energetic', colors: ['#FF6B35', '#F7931E', '#FFD700'], description: 'Warm colors for energy and excitement' },
  { id: 'nature', name: 'Natural', colors: ['#10B981', '#059669', '#047857'], description: 'Greens for growth and nature' },
  { id: 'luxury', name: 'Luxury', colors: ['#7C3AED', '#5B21B6', '#4C1D95'], description: 'Purples for premium and luxury' },
  { id: 'friendly', name: 'Friendly', colors: ['#F59E0B', '#D97706', '#B45309'], description: 'Warm oranges for approachability' },
  { id: 'calm', name: 'Calm', colors: ['#6B7280', '#4B5563', '#374151'], description: 'Neutral grays for calm and balance' }
];

const contentTones = [
  { id: 'professional', name: 'Professional', description: 'Formal, authoritative, business-focused' },
  { id: 'friendly', name: 'Friendly', description: 'Warm, approachable, conversational' },
  { id: 'creative', name: 'Creative', description: 'Innovative, artistic, expressive' },
  { id: 'trustworthy', name: 'Trustworthy', description: 'Reliable, honest, dependable' },
  { id: 'modern', name: 'Modern', description: 'Current, trendy, forward-thinking' },
  { id: 'personal', name: 'Personal', description: 'Individual, custom, intimate' }
];

function EnhancedBusinessForm({ onSubmit, isLoading }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Business Info
    name: '',
    type: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    
    // Products/Services
    products: '',
    services: '',
    targetAudience: '',
    businessGoals: '',
    
    // Design Preferences
    designStyle: '',
    colorMood: '',
    contentTone: '',
    
    // Features & Requirements
    needsGallery: false,
    needsTestimonials: false,
    needsBooking: false,
    needsBlog: false,
    needsEcommerce: false,
    needsContactForm: true,
    
    // Content Preferences
    contentFocus: 'balanced', // services, products, about, balanced
    specialRequirements: ''
  });

  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelect = (typeId) => {
    const selectedBusinessType = businessTypes.find(type => type.id === typeId);
    setSelectedType(selectedBusinessType);
    setFormData({
      ...formData,
      type: selectedBusinessType.name
    });
    setCurrentStep(2);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare comprehensive data for AI generation
    const businessInfo = {
      name: formData.name,
      type: formData.type,
      description: formData.description,
      products: formData.products,
      services: formData.services,
      targetAudience: formData.targetAudience,
      goals: formData.businessGoals,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      website: formData.website
    };

    const userPreferences = {
      tone: formData.contentTone,
      style: formData.designStyle,
      colorPreference: formData.colorMood,
      contentFocus: formData.contentFocus
    };

    const contentRequirements = {
      hasGallery: formData.needsGallery,
      hasTestimonials: formData.needsTestimonials,
      hasBooking: formData.needsBooking,
      hasBlog: formData.needsBlog,
      hasEcommerce: formData.needsEcommerce,
      hasContactForm: formData.needsContactForm,
      specialRequirements: formData.specialRequirements
    };

    onSubmit({
      businessInfo,
      userPreferences,
      contentRequirements,
      rawData: formData
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2>What type of business do you have?</h2>
            <p>Select the category that best describes your business</p>
            <div className="business-types-grid">
              {businessTypes.map(type => (
                <div
                  key={type.id}
                  className="type-card"
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <div className="type-icon">{type.icon}</div>
                  <h3>{type.name}</h3>
                  <p>{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-step">
            <h2>Tell us about your business</h2>
            <p>Basic information to help us understand your business</p>
            
            <div className="form-group">
              <label htmlFor="name">Business Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your business name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Business Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe what your business does, your mission, and what makes you unique..."
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="targetAudience">Target Audience</label>
                <input
                  type="text"
                  id="targetAudience"
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="Who are your ideal customers?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="businessGoals">Main Business Goals</label>
                <input
                  type="text"
                  id="businessGoals"
                  name="businessGoals"
                  value={formData.businessGoals}
                  onChange={handleChange}
                  placeholder="What do you want to achieve?"
                />
              </div>
            </div>

            <div className="step-navigation">
              <button type="button" onClick={handlePrevious} className="btn-secondary">
                Previous
              </button>
              <button type="button" onClick={handleNext} className="btn-primary">
                Continue
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-step">
            <h2>Products & Services</h2>
            <p>Tell us about what you offer to your customers</p>

            {formData.type && (formData.type.toLowerCase().includes('restaurant') || 
                              formData.type.toLowerCase().includes('retail') || 
                              formData.type.toLowerCase().includes('salon')) ? (
              <div className="form-group">
                <label htmlFor="products">Products/Menu Items</label>
                <textarea
                  id="products"
                  name="products"
                  value={formData.products}
                  onChange={handleChange}
                  placeholder="List your main products, menu items, or inventory..."
                  rows={3}
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="services">Services</label>
                <textarea
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  placeholder="List your main services and what you specialize in..."
                  rows={3}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="contentFocus">Content Focus</label>
              <select
                id="contentFocus"
                name="contentFocus"
                value={formData.contentFocus}
                onChange={handleChange}
              >
                <option value="balanced">Balanced approach</option>
                <option value="services">Focus on services</option>
                <option value="products">Focus on products</option>
                <option value="about">Focus on company story</option>
              </select>
            </div>

            <div className="step-navigation">
              <button type="button" onClick={handlePrevious} className="btn-secondary">
                Previous
              </button>
              <button type="button" onClick={handleNext} className="btn-primary">
                Continue
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-step">
            <h2>Design Preferences</h2>
            <p>Help us create a website that matches your vision</p>

            <div className="preference-section">
              <h3>Design Style</h3>
              <div className="design-styles-grid">
                {designStyles.map(style => (
                  <div
                    key={style.id}
                    className={`style-card ${formData.designStyle === style.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, designStyle: style.id })}
                  >
                    <h4>{style.name}</h4>
                    <p>{style.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="preference-section">
              <h3>Color Mood</h3>
              <div className="color-moods-grid">
                {colorMoods.map(mood => (
                  <div
                    key={mood.id}
                    className={`mood-card ${formData.colorMood === mood.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, colorMood: mood.id })}
                  >
                    <div className="color-palette">
                      {mood.colors.map((color, index) => (
                        <div
                          key={index}
                          className="color-swatch"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <h4>{mood.name}</h4>
                    <p>{mood.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="preference-section">
              <h3>Content Tone</h3>
              <div className="tone-grid">
                {contentTones.map(tone => (
                  <div
                    key={tone.id}
                    className={`tone-card ${formData.contentTone === tone.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, contentTone: tone.id })}
                  >
                    <h4>{tone.name}</h4>
                    <p>{tone.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="step-navigation">
              <button type="button" onClick={handlePrevious} className="btn-secondary">
                Previous
              </button>
              <button type="button" onClick={handleNext} className="btn-primary">
                Continue
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-step">
            <h2>Features & Contact Information</h2>
            <p>Select features you'd like on your website and provide contact details</p>

            <div className="features-section">
              <h3>Website Features</h3>
              <div className="features-grid">
                <label className="feature-checkbox">
                  <input
                    type="checkbox"
                    name="needsGallery"
                    checked={formData.needsGallery}
                    onChange={handleChange}
                  />
                  <span>Photo Gallery</span>
                </label>
                <label className="feature-checkbox">
                  <input
                    type="checkbox"
                    name="needsTestimonials"
                    checked={formData.needsTestimonials}
                    onChange={handleChange}
                  />
                  <span>Customer Testimonials</span>
                </label>
                <label className="feature-checkbox">
                  <input
                    type="checkbox"
                    name="needsBooking"
                    checked={formData.needsBooking}
                    onChange={handleChange}
                  />
                  <span>Booking/Appointment System</span>
                </label>
                <label className="feature-checkbox">
                  <input
                    type="checkbox"
                    name="needsBlog"
                    checked={formData.needsBlog}
                    onChange={handleChange}
                  />
                  <span>Blog Section</span>
                </label>
                <label className="feature-checkbox">
                  <input
                    type="checkbox"
                    name="needsEcommerce"
                    checked={formData.needsEcommerce}
                    onChange={handleChange}
                  />
                  <span>Online Store</span>
                </label>
              </div>
            </div>

            <div className="contact-section">
              <h3>Contact Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Business Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Existing Website (if any)</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.yourbusiness.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="specialRequirements">Special Requirements or Notes</label>
              <textarea
                id="specialRequirements"
                name="specialRequirements"
                value={formData.specialRequirements}
                onChange={handleChange}
                placeholder="Any specific features, content, or design elements you'd like to include..."
                rows={3}
              />
            </div>

            <div className="step-navigation">
              <button type="button" onClick={handlePrevious} className="btn-secondary">
                Previous
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? 'Generating Website...' : 'Create My Website'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="enhanced-business-form">
      <div className="form-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
        <div className="progress-steps">
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              className={`progress-step ${currentStep >= step ? 'active' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {renderStepContent()}
      </form>
    </div>
  );
}

export default EnhancedBusinessForm;
