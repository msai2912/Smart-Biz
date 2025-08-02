import React, { useState, useEffect } from 'react';
import './WebsitePreview.css';
import ContentEditor from './ContentEditor';
import Chatbot from './Chatbot';
import { downloadWebsite, previewWebsite, generateWebsiteHTML } from '../services/websiteExporter';
import { useNotification } from './Notification';

function WebsitePreview({ businessInfo, content, template, styles, isFullScreen = false }) {
  const [editableContent, setEditableContent] = useState(content);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [websiteHTML, setWebsiteHTML] = useState('');
  const { showNotification, NotificationComponent } = useNotification();

  // Default comprehensive content structure
  const defaultContent = {
    // Hero Section
    hero: {
      headline: businessInfo.name ? `Welcome to ${businessInfo.name}` : 'Welcome to Our Business',
      tagline: businessInfo.type ? `Your trusted ${businessInfo.type.toLowerCase()}` : 'Your trusted local business',
      description: businessInfo.description || 'Professional services tailored to your needs',
      primaryCTA: 'Get Started Today',
      secondaryCTA: 'Learn More'
    },
    
    // About Section
    about: {
      title: 'About Us',
      story: businessInfo.description || 'About our business...',
      mission: `${businessInfo.name || 'We'} are committed to providing exceptional service.`,
      whyChooseUs: 'Experience, quality, and customer satisfaction.',
      yearsExperience: '10+',
      teamSize: 'Professional team'
    },
    
    // Services Section
    services: {
      title: 'Our Services',
      overview: businessInfo.services || businessInfo.products || 'Our comprehensive service offerings',
      serviceList: [],
      benefits: 'Quality service with professional results.',
      process: 'We work closely with our clients to ensure satisfaction.'
    },
    
    // What We Offer Section
    whatWeOffer: {
      title: 'What We Offer',
      categories: [],
      offerings: [],
      features: [],
      valueStatement: 'Comprehensive solutions for all your needs.'
    },
    
    // Who We Serve Section
    whoWeServe: {
      title: 'Who We Serve',
      description: businessInfo.targetAudience || 'We serve a diverse range of clients.',
      industries: [],
      coverage: businessInfo.location || 'Local and regional area',
      clientTypes: ['Individual clients', 'Businesses']
    },
    
    // Testimonials Section
    testimonials: {
      title: 'What Our Clients Say',
      reviews: [],
      overallRating: '4.9',
      totalReviews: '100+'
    },
    
    // Why Choose Us Section
    whyChooseUs: {
      title: 'Why Choose Us',
      differentiators: ['Experience', 'Quality', 'Customer Service'],
      advantages: [],
      guarantees: 'Satisfaction guaranteed'
    },
    
    // Contact Section
    contact: {
      title: 'Get In Touch',
      encouragement: 'Ready to get started? Contact us today!',
      expectation: 'We\'ll respond promptly to discuss your needs.',
      responseTime: 'Within 24 hours',
      consultationInfo: 'Free consultation available'
    },
    
    // Additional Content
    additionalContent: {
      metaDescription: `${businessInfo.name || 'Local Business'} - ${businessInfo.description || 'Professional services'}`,
      keywords: [],
      faq: [],
      blogIdeas: [],
      socialBio: `${businessInfo.name || 'Local Business'} - ${businessInfo.description || 'Professional services'}`
    },
    
    // Legacy support for existing templates
    headline: businessInfo.name ? `Welcome to ${businessInfo.name}` : 'Welcome to Our Business',
    tagline: businessInfo.type ? `Your trusted ${businessInfo.type.toLowerCase()}` : 'Your trusted local business',
    callToAction: 'Contact us today!'
  };

  // Deep merge function to handle nested objects
  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else if (source[key] !== undefined && source[key] !== null) {
        result[key] = source[key];
      }
    }
    return result;
  };

  // Merge generated content with defaults (to handle missing fields)
  const displayContent = deepMerge(defaultContent, editableContent || {});

  const handleContentChange = (newContent) => {
    setEditableContent(newContent);
  };

  // Default styles
  const defaultStyles = {
    primaryColor: '#667eea',
    secondaryColor: '#764ba2',
    accentColor: '#f093fb',
    headingFont: 'Montserrat',
    bodyFont: 'Open Sans'
  };

  // Merge generated styles with defaults
  const displayStyles = {
    primaryColor: styles?.primaryColor || defaultStyles.primaryColor,
    secondaryColor: styles?.secondaryColor || defaultStyles.secondaryColor,
    accentColor: styles?.accentColor || defaultStyles.accentColor,
    headingFont: styles?.headingFont || defaultStyles.headingFont,
    bodyFont: styles?.bodyFont || defaultStyles.bodyFont
  };

  // Generate HTML whenever content changes
  useEffect(() => {
    const html = generateWebsiteHTML(businessInfo, displayContent, template, displayStyles);
    setWebsiteHTML(html);
  }, [editableContent, businessInfo, template, displayStyles]);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleDownload = () => {
    downloadWebsite(
      businessInfo, 
      displayContent, 
      template, 
      displayStyles,
      (message) => showNotification(message, 'success'),
      (error) => showNotification(error, 'error')
    );
  };

  const handlePreview = () => {
    previewWebsite(
      businessInfo, 
      displayContent, 
      template, 
      displayStyles,
      (message) => showNotification(message, 'success'),
      (error) => showNotification(error, 'error')
    );
  };

  // Return new floating design
  return (
    <div className={`website-preview-container ${isFullScreen ? 'fullscreen-mode' : ''}`}>
      {NotificationComponent}
      
      <div className="preview-layout">
        {/* Floating Sidebar Toggle - hide in fullscreen */}
        {!isFullScreen && (
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label="Toggle editing panel"
          >
            {sidebarCollapsed || !sidebarOpen ? '⚙️' : '✕'}
          </button>
        )}

        {/* Floating Control Panel - hide in fullscreen */}
        {!isFullScreen && (
          <div className={`preview-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'open' : ''}`}>
            {!sidebarCollapsed && (
              <>
                <ContentEditor 
                  content={displayContent}
                  onContentChange={handleContentChange}
                  businessInfo={businessInfo}
                />
              </>
            )}
          </div>
        )}
        
        {/* Main Preview Area */}
        <div className="preview-main">
          <div className="website-frame">
            <iframe
              className="website-iframe"
              srcDoc={websiteHTML}
              title="Website Preview"
              sandbox="allow-same-origin allow-scripts"
            />
            {/* Chatbot overlay for preview */}
            <div className="chatbot-overlay">
              <Chatbot 
                businessInfo={businessInfo} 
                isDemo={true}
              />
            </div>
          </div>
        </div>

        {/* Floating Action Bar - hide in fullscreen */}
        {!isFullScreen && (
          <div className="floating-actions">
            <button onClick={handlePreview} className="action-btn preview">
              🚀 Preview
            </button>
            <button onClick={handleDownload} className="action-btn download">
              📥 Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebsitePreview;
