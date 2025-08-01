import { useState, useEffect } from 'react';
import emailService from '../../services/emailService';
import './EmailConfiguration.css';

const EmailConfiguration = ({ onConfigurationComplete }) => {
  const [config, setConfig] = useState({
    publicKey: '',
    serviceId: '',
    templateId: ''
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if already configured
    const savedConfig = localStorage.getItem('emailjs_config');
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      emailService.configure(parsedConfig);
      setIsConfigured(true);
    }
  }, []);

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveConfiguration = () => {
    if (!config.publicKey || !config.serviceId || !config.templateId) {
      alert('Please fill in all required fields.');
      return;
    }

    emailService.configure(config);
    localStorage.setItem('emailjs_config', JSON.stringify(config));
    setIsConfigured(true);
    
    if (onConfigurationComplete) {
      onConfigurationComplete(config);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      alert('Please enter a test email address.');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await emailService.testConfiguration(testEmail);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    setConfig({
      publicKey: '',
      serviceId: '',
      templateId: ''
    });
    setIsConfigured(false);
    setTestResult(null);
    localStorage.removeItem('emailjs_config');
  };

  return (
    <div className="email-configuration">
      <div className="config-header">
        <h2>EmailJS Configuration</h2>
        <p>Set up your email service to start sending emails to customers</p>
      </div>

      {!isConfigured ? (
        <div className="config-form">
          <div className="config-section">
            <div className="form-group">
              <label htmlFor="publicKey">Public Key *</label>
              <input
                type="text"
                id="publicKey"
                value={config.publicKey}
                onChange={(e) => handleConfigChange('publicKey', e.target.value)}
                placeholder="Your EmailJS Public Key"
              />
            </div>

            <div className="form-group">
              <label htmlFor="serviceId">Service ID *</label>
              <input
                type="text"
                id="serviceId"
                value={config.serviceId}
                onChange={(e) => handleConfigChange('serviceId', e.target.value)}
                placeholder="Your EmailJS Service ID"
              />
            </div>

            <div className="form-group">
              <label htmlFor="templateId">Template ID *</label>
              <input
                type="text"
                id="templateId"
                value={config.templateId}
                onChange={(e) => handleConfigChange('templateId', e.target.value)}
                placeholder="Your EmailJS Template ID"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveConfiguration}
              >
                Save Configuration
              </button>
              
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowInstructions(!showInstructions)}
              >
                {showInstructions ? 'Hide' : 'Show'} Setup Instructions
              </button>
            </div>
          </div>

          {showInstructions && (
            <div className="instructions-section">
              <h3>Setup Instructions</h3>
              <div className="instructions-content">
                <h4>Step 1: Create EmailJS Account</h4>
                <ol>
                  <li>Go to <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer">EmailJS.com</a></li>
                  <li>Sign up for a free account</li>
                  <li>Verify your email address</li>
                </ol>

                <h4>Step 2: Add Email Service</h4>
                <ol>
                  <li>In your EmailJS dashboard, go to "Email Services"</li>
                  <li>Click "Add New Service"</li>
                  <li>Choose your email provider (Gmail, Outlook, etc.)</li>
                  <li>Follow the setup instructions for your provider</li>
                  <li>Copy the Service ID</li>
                </ol>

                <h4>Step 3: Create Email Template</h4>
                <ol>
                  <li>Go to "Email Templates" in your dashboard</li>
                  <li>Click "Create New Template"</li>
                  <li>Use this template structure:</li>
                </ol>
                
                <div className="template-example">
                  <h5>Subject:</h5>
                  <code>{'{{subject}}'}</code>
                  
                  <h5>Body:</h5>
                  <pre>{`Hello {{to_name}},

{{message}}

Best regards,
{{from_name}}`}</pre>
                </div>

                <h4>Step 4: Get Your Keys</h4>
                <ol>
                  <li>Go to "Account" → "General"</li>
                  <li>Copy your Public Key</li>
                  <li>Copy your Service ID from Email Services</li>
                  <li>Copy your Template ID from Email Templates</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="config-status">
          <div className="status-card success">
            <div className="status-icon">✅</div>
            <div className="status-content">
              <h3>EmailJS Configured Successfully</h3>
              <p>Your email service is ready to send emails to customers.</p>
            </div>
          </div>

          <div className="test-section">
            <h3>Test Configuration</h3>
            <div className="test-form">
              <div className="form-group">
                <label htmlFor="testEmail">Test Email Address</label>
                <input
                  type="email"
                  id="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Enter email to test"
                />
              </div>
              
              <button
                type="button"
                className="btn-primary"
                onClick={handleTestEmail}
                disabled={isTesting}
              >
                {isTesting ? 'Sending Test Email...' : 'Send Test Email'}
              </button>
            </div>

            {testResult && (
              <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                {testResult.success ? (
                  <div>
                    <div className="result-icon">✅</div>
                    <div>
                      <h4>Test Email Sent Successfully!</h4>
                      <p>Check your inbox to confirm email delivery.</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="result-icon">❌</div>
                    <div>
                      <h4>Test Email Failed</h4>
                      <p>{testResult.error}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="config-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleReset}
            >
              Reset Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailConfiguration;
