import React, { useState } from 'react';
import emailService from '../../services/emailService';
import './EmailTester.css';

const EmailTester = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');

  const runBasicTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const result = await emailService.testConfiguration(testEmail || 'test@example.com');
      setTestResult(result);
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: error.message,
        details: error 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runMinimalTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test with absolute minimal parameters
      const result = await emailService.sendEmail({
        to: testEmail || 'test@example.com',
        toName: 'Test User',
        fromName: 'Test Business',
        subject: 'Minimal Test',
        message: 'This is a minimal test email.'
      });
      setTestResult(result);
    } catch (error) {
      setTestResult({ 
        success: false, 
        error: error.message,
        details: error 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="email-tester">
      <h2>EmailJS Configuration Tester</h2>
      <p>Use this tool to debug email sending issues</p>

      <div className="test-input">
        <label>Test Email Address:</label>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="your-email@example.com"
        />
      </div>

      <div className="test-buttons">
        <button 
          onClick={runBasicTest}
          disabled={isLoading}
          className="test-btn"
        >
          {isLoading ? 'Testing...' : 'Run Basic Test'}
        </button>
        
        <button 
          onClick={runMinimalTest}
          disabled={isLoading}
          className="test-btn minimal"
        >
          {isLoading ? 'Testing...' : 'Run Minimal Test'}
        </button>
      </div>

      {testResult && (
        <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
          <h3>{testResult.success ? '✅ Success!' : '❌ Failed'}</h3>
          
          {testResult.success ? (
            <div>
              <p>Email sent successfully!</p>
              <pre>{JSON.stringify(testResult.response || testResult, null, 2)}</pre>
            </div>
          ) : (
            <div>
              <p><strong>Error:</strong> {testResult.error}</p>
              {testResult.details && (
                <details>
                  <summary>Error Details</summary>
                  <pre>{JSON.stringify(testResult.details, null, 2)}</pre>
                </details>
              )}
              
              <div className="troubleshooting">
                <h4>Common Solutions:</h4>
                <ul>
                  <li>Verify your EmailJS template variables match exactly</li>
                  <li>Check that your service is properly connected</li>
                  <li>Ensure template is published and active</li>
                  <li>Verify email address format is correct</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="config-info">
        <h3>Current Configuration:</h3>
        <div className="config-details">
          <p><strong>Service ID:</strong> {emailService.serviceId}</p>
          <p><strong>Template ID:</strong> {emailService.templateId}</p>
          <p><strong>Public Key:</strong> {emailService.publicKey?.substring(0, 8)}...</p>
          <p><strong>Configured:</strong> {emailService.isConfigured() ? '✅ Yes' : '❌ No'}</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTester;
