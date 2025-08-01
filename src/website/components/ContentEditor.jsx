import React, { useState } from 'react';
import './ContentEditor.css';

function ContentEditor({ content, onContentChange, businessInfo }) {
  const [editableContent, setEditableContent] = useState({
    headline: content?.headline || `Welcome to ${businessInfo.name}`,
    tagline: content?.tagline || `Your trusted ${businessInfo.type?.toLowerCase()}`,
    about: content?.about || businessInfo.description || 'About our business...',
    services: content?.services || businessInfo.services || businessInfo.products || 'Our offerings',
    callToAction: content?.callToAction || 'Contact us today!'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field, value) => {
    const updatedContent = {
      ...editableContent,
      [field]: value
    };
    setEditableContent(updatedContent);
    onContentChange(updatedContent);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const resetToDefault = () => {
    const defaultContent = {
      headline: `Welcome to ${businessInfo.name}`,
      tagline: `Your trusted ${businessInfo.type?.toLowerCase()}`,
      about: businessInfo.description || 'About our business...',
      services: businessInfo.services || businessInfo.products || 'Our offerings',
      callToAction: 'Contact us today!'
    };
    setEditableContent(defaultContent);
    onContentChange(defaultContent);
  };

  if (!isEditing) {
    return (
      <div className="content-editor">
        <div className="content-editor-header">
          <h3>Website Content</h3>
          <div className="editor-actions">
            <button onClick={toggleEditing} className="edit-btn">
              ✏️ Edit Content
            </button>
          </div>
        </div>
        
        <div className="content-preview">
          <div className="content-section">
            <label>Headline:</label>
            <p>{editableContent.headline}</p>
          </div>
          
          <div className="content-section">
            <label>Tagline:</label>
            <p>{editableContent.tagline}</p>
          </div>
          
          <div className="content-section">
            <label>About Section:</label>
            <p>{editableContent.about}</p>
          </div>
          
          <div className="content-section">
            <label>{businessInfo.services ? 'Services' : 'Products'}:</label>
            <p>{editableContent.services}</p>
          </div>
          
          <div className="content-section">
            <label>Call to Action:</label>
            <p>{editableContent.callToAction}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-editor editing">
      <div className="content-editor-header">
        <h3>Edit Website Content</h3>
        <div className="editor-actions">
          <button onClick={resetToDefault} className="reset-btn">
            🔄 Reset to Default
          </button>
          <button onClick={toggleEditing} className="done-btn">
            ✓ Done Editing
          </button>
        </div>
      </div>
      
      <div className="content-form">
        <div className="form-group">
          <label htmlFor="headline">Main Headline</label>
          <input
            type="text"
            id="headline"
            value={editableContent.headline}
            onChange={(e) => handleChange('headline', e.target.value)}
            placeholder="Enter your main headline"
          />
          <small>This will be the first thing visitors see on your website</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="tagline">Tagline</label>
          <input
            type="text"
            id="tagline"
            value={editableContent.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Enter a short tagline"
          />
          <small>A brief description of what you do (keep it under 10 words)</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="about">About Section</label>
          <textarea
            id="about"
            value={editableContent.about}
            onChange={(e) => handleChange('about', e.target.value)}
            placeholder="Tell visitors about your business"
            rows={4}
          />
          <small>Describe your business, mission, and what makes you special</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="services">{businessInfo.services ? 'Services' : 'Products'}</label>
          <textarea
            id="services"
            value={editableContent.services}
            onChange={(e) => handleChange('services', e.target.value)}
            placeholder={`List your main ${businessInfo.services ? 'services' : 'products'}`}
            rows={3}
          />
          <small>Describe what you offer to customers</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="callToAction">Call to Action</label>
          <input
            type="text"
            id="callToAction"
            value={editableContent.callToAction}
            onChange={(e) => handleChange('callToAction', e.target.value)}
            placeholder="Enter your call to action"
          />
          <small>What action do you want visitors to take? (e.g., "Contact us today!", "Book now!")</small>
        </div>
      </div>
    </div>
  );
}

export default ContentEditor;
