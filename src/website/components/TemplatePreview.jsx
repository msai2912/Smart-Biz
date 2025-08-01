import React from 'react';
import './TemplatePreview.css';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: 'https://via.placeholder.com/300x200?text=Modern+Template',
    description: 'Clean, minimalist design with a focus on visuals and simple navigation.'
  },
  {
    id: 'classic',
    name: 'Classic',
    thumbnail: 'https://via.placeholder.com/300x200?text=Classic+Template',
    description: 'Timeless layout with traditional navigation and balanced content areas.'
  },
  {
    id: 'bold',
    name: 'Bold',
    thumbnail: 'https://via.placeholder.com/300x200?text=Bold+Template',
    description: 'High contrast design with striking typography and dramatic visual elements.'
  }
];

// Industry-specific template suggestions
const templateSuggestions = {
  'Restaurant': ['modern', 'classic'],
  'Retail Store': ['modern', 'bold'],
  'Salon/Spa': ['modern'],
  'Professional Services': ['classic'],
  'Fitness/Gym': ['bold', 'modern']
};

function TemplatePreview({ businessInfo, selectedTemplate, onSelectTemplate, generatedStyles }) {
  // Get suggested templates for this business type
  const suggestedTemplates = businessInfo.type ? templateSuggestions[businessInfo.type] || [] : [];
  
  return (
    <div className="template-preview">
      <h2>Choose a template for your website</h2>
      
      {suggestedTemplates.length > 0 && (
        <div className="suggested-templates">
          <h3>Recommended for {businessInfo.type}</h3>
          <div className="templates-grid">
            {templates
              .filter(template => suggestedTemplates.includes(template.id))
              .map(template => (
                <TemplateCard 
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  onSelect={() => onSelectTemplate(template.id)}
                  businessInfo={businessInfo}
                  generatedStyles={generatedStyles}
                  recommended={true}
                />
              ))}
          </div>
        </div>
      )}
      
      <div className="all-templates">
        <h3>All Templates</h3>
        <div className="templates-grid">
          {templates
            .filter(template => !suggestedTemplates.includes(template.id))
            .map(template => (
              <TemplateCard 
                key={template.id}
                template={template}
                isSelected={selectedTemplate === template.id}
                onSelect={() => onSelectTemplate(template.id)}
                businessInfo={businessInfo}
                generatedStyles={generatedStyles}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, isSelected, onSelect, businessInfo, generatedStyles, recommended }) {
  return (
    <div 
      className={`template-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {recommended && <div className="recommended-badge">Recommended</div>}
      
      <div className="template-thumbnail">
        <img src={template.thumbnail} alt={`${template.name} template preview`} />
        
        {/* Preview overlay with business name */}
        <div className="template-preview-overlay">
          <div className="preview-business-name" style={{
            color: generatedStyles?.primaryColor || '#333'
          }}>
            {businessInfo.name || "Your Business Name"}
          </div>
        </div>
      </div>
      
      <div className="template-info">
        <h4>{template.name}</h4>
        <p>{template.description}</p>
      </div>
      
      <button 
        className={`select-btn ${isSelected ? 'selected' : ''}`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
    </div>
  );
}

export default TemplatePreview;
