import React, { useState } from 'react';
import './BusinessInfoForm.css';

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

function BusinessInfoForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    services: '',
    products: '',
  });

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelect = (typeId) => {
    const selectedBusinessType = businessTypes.find(type => type.id === typeId);
    setSelectedType(selectedBusinessType);
    setFormData({
      ...formData,
      type: selectedBusinessType.name
    });
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="business-info-form">
      <h2>Tell us about your business</h2>
      
      {step === 1 && (
        <div className="type-selection">
          <p>What type of business do you have?</p>
          <div className="type-grid">
            {businessTypes.map((type) => (
              <div 
                key={type.id} 
                className="type-card"
                onClick={() => handleTypeSelect(type.id)}
              >
                <div className="type-icon">{type.icon}</div>
                <div className="type-name">{type.name}</div>
                <div className="type-description">{type.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit}>
          <div className="selected-type">
            <span>{selectedType.icon}</span>
            <h3>{selectedType.name}</h3>
            <button type="button" className="change-type-btn" onClick={handleBack}>
              Change
            </button>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Business Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Joe's Pizza"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Business Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Tell us what your business does, your mission, and what makes you special..."
              rows={4}
            />
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State"
              />
            </div>
            
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
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>
          
          {selectedType.id === 'restaurant' || selectedType.id === 'retail' ? (
            <div className="form-group">
              <label htmlFor="products">Products</label>
              <textarea
                id="products"
                name="products"
                value={formData.products}
                onChange={handleChange}
                placeholder="List your main products or menu items..."
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
                placeholder="List your main services..."
                rows={3}
              />
            </div>
          )}
          
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create My Website'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default BusinessInfoForm;
