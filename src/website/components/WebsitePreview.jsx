import React, { useState, useEffect } from 'react';
import './WebsitePreview.css';
import ContentEditor from './ContentEditor';
import { downloadWebsite, previewWebsite, generateWebsiteHTML } from '../services/websiteExporter';
import { useNotification } from './Notification';

function WebsitePreview({ businessInfo, content, template, styles, isFullScreen = false }) {
  const [editableContent, setEditableContent] = useState(content);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [websiteHTML, setWebsiteHTML] = useState('');
  const { showNotification, NotificationComponent } = useNotification();

  // Default content in case any sections are missing
  const defaultContent = {
    headline: businessInfo.name ? `Welcome to ${businessInfo.name}` : 'Welcome to Our Business',
    tagline: businessInfo.type ? `Your trusted ${businessInfo.type.toLowerCase()}` : 'Your trusted local business',
    about: businessInfo.description || 'About our business...',
    services: businessInfo.services || businessInfo.products || 'Our offerings',
    callToAction: 'Contact us today!'
  };

  // Merge generated content with defaults (to handle missing fields)
  const displayContent = {
    headline: editableContent?.headline || defaultContent.headline,
    tagline: editableContent?.tagline || defaultContent.tagline,
    about: editableContent?.about || defaultContent.about,
    services: editableContent?.services || defaultContent.services,
    callToAction: editableContent?.callToAction || defaultContent.callToAction
  };

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
