import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import emailService from '../../services/emailService';
import { EMAIL_CONFIG } from '../../config/emailConfig';
import EmailConfiguration from './EmailConfiguration';
import CustomerList from './CustomerList';
import EmailTester from './EmailTester';
import './EmailSender.css';

const EmailSender = () => {
  const { currentUser } = useAuth();
  const [isConfigured, setIsConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState(null);

  // Single email state
  const [singleEmail, setSingleEmail] = useState({
    to: '',
    toName: '',
    subject: '',
    message: ''
  });

  // Bulk email state
  const [bulkEmails, setBulkEmails] = useState('');
  const [bulkEmailData, setBulkEmailData] = useState({
    subject: '',
    message: ''
  });

  // Newsletter state
  const [newsletter, setNewsletter] = useState({
    title: '',
    subject: '',
    content: '',
    recipients: ''
  });

  // Promotion state
  const [promotion, setPromotion] = useState({
    subject: '',
    content: '',
    promoCode: '',
    discountAmount: '',
    expiryDate: '',
    recipients: ''
  });

  // Predefined templates
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customFields, setCustomFields] = useState({});
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [useHtmlTemplate, setUseHtmlTemplate] = useState(true);

  useEffect(() => {
    // Check if EmailJS is configured with hardcoded credentials
    const credentialsValid = !EMAIL_CONFIG.PUBLIC_KEY.includes('YOUR_EMAILJS') &&
                            !EMAIL_CONFIG.SERVICE_ID.includes('YOUR_EMAILJS') &&
                            !EMAIL_CONFIG.TEMPLATE_ID.includes('YOUR_EMAILJS');
    
    if (credentialsValid) {
      setIsConfigured(true);
    } else {
      // Fallback to saved configuration if hardcoded credentials are not set
      const savedConfig = localStorage.getItem('emailjs_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        emailService.configure(config);
        setIsConfigured(true);
      }
    }
  }, []);

  const emailTemplates = emailService.getEmailTemplates();

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    const template = emailTemplates[templateKey];
    
    // Process template with business info
    const variables = {
      business_name: currentUser.businessName || currentUser.name,
      business_email: currentUser.email,
      website_link: '#',
      logo_url: '/vite.svg'
    };
    
    const processedTemplate = emailService.getProcessedTemplate(templateKey, variables);
    
    if (activeTab === 'single') {
      setSingleEmail(prev => ({
        ...prev,
        subject: processedTemplate.subject,
        message: useHtmlTemplate && processedTemplate.html ? processedTemplate.html : processedTemplate.content
      }));
    } else if (activeTab === 'bulk') {
      setBulkEmailData(prev => ({
        ...prev,
        subject: processedTemplate.subject,
        message: useHtmlTemplate && processedTemplate.html ? processedTemplate.html : processedTemplate.content
      }));
    } else if (activeTab === 'newsletter') {
      setNewsletter(prev => ({
        ...prev,
        subject: processedTemplate.subject,
        content: useHtmlTemplate && processedTemplate.html ? processedTemplate.html : processedTemplate.content
      }));
    } else if (activeTab === 'promotion') {
      setPromotion(prev => ({
        ...prev,
        subject: processedTemplate.subject,
        content: useHtmlTemplate && processedTemplate.html ? processedTemplate.html : processedTemplate.content
      }));
    }
  };

  const parseEmailList = (emailString) => {
    return emailString
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        
        // Support "Name <email@domain.com>" format
        const match = trimmed.match(/(.+?)\s*<(.+?)>/) || trimmed.match(/(.+?),\s*(.+)/);
        if (match) {
          return {
            name: match[1].trim(),
            email: match[2].trim()
          };
        }
        
        // Just email address
        if (trimmed.includes('@')) {
          return {
            name: 'Customer',
            email: trimmed
          };
        }
        
        return null;
      })
      .filter(Boolean);
  };

  const handleSingleEmailSend = async () => {
    if (!singleEmail.to || !singleEmail.subject || !singleEmail.message) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSending(true);
    setSendResults(null);

    try {
      const result = await emailService.sendEmail({
        to: singleEmail.to,
        toName: singleEmail.toName || 'Customer',
        fromName: currentUser.businessName || currentUser.name,
        fromEmail: currentUser.email,
        subject: singleEmail.subject,
        message: singleEmail.message,
        customFields
      });

      setSendResults(result);
      
      if (result.success) {
        setSingleEmail({ to: '', toName: '', subject: '', message: '' });
        setCustomFields({});
      }
    } catch (error) {
      setSendResults({ success: false, error: error.message });
    } finally {
      setIsSending(false);
    }
  };

  const handleBulkEmailSend = async () => {
    let emailList = [];
    
    // Use selected customers if available, otherwise parse the text input
    if (selectedCustomers.length > 0) {
      emailList = selectedCustomers.map(customer => ({
        name: customer.name,
        email: customer.email
      }));
    } else if (bulkEmails) {
      emailList = parseEmailList(bulkEmails);
    }
    
    if (!bulkEmailData.subject || !bulkEmailData.message) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (emailList.length === 0) {
      alert('Please select customers from the list or enter email addresses.');
      return;
    }

    setIsSending(true);
    setSendResults(null);

    try {
      const result = await emailService.sendBulkEmails(emailList, {
        fromName: currentUser.businessName || currentUser.name,
        fromEmail: currentUser.email,
        subject: bulkEmailData.subject,
        message: bulkEmailData.message,
        customFields
      });

      setSendResults(result);
      
      if (result.successful > 0) {
        setBulkEmails('');
        setBulkEmailData({ subject: '', message: '' });
        setCustomFields({});
        setSelectedCustomers([]);
      }
    } catch (error) {
      setSendResults({ success: false, error: error.message });
    } finally {
      setIsSending(false);
    }
  };

  const handleNewsletterSend = async () => {
    let emailList = [];
    
    // Use selected customers if available, otherwise parse the text input
    if (selectedCustomers.length > 0) {
      emailList = selectedCustomers.map(customer => ({
        name: customer.name,
        email: customer.email
      }));
    } else if (newsletter.recipients) {
      emailList = parseEmailList(newsletter.recipients);
    }
    
    if (!newsletter.subject || !newsletter.content) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (emailList.length === 0) {
      alert('Please select customers from the list or enter email addresses.');
      return;
    }

    setIsSending(true);
    setSendResults(null);

    try {
      const result = await emailService.sendNewsletter({
        title: newsletter.title,
        subject: newsletter.subject,
        content: newsletter.content,
        recipients: emailList,
        fromName: currentUser.businessName || currentUser.name,
        fromEmail: currentUser.email
      });

      setSendResults(result);
      
      if (result.successful > 0) {
        setNewsletter({ title: '', subject: '', content: '', recipients: '' });
        setSelectedCustomers([]);
      }
    } catch (error) {
      setSendResults({ success: false, error: error.message });
    } finally {
      setIsSending(false);
    }
  };

  const handlePromotionSend = async () => {
    let emailList = [];
    
    // Use selected customers if available, otherwise parse the text input
    if (selectedCustomers.length > 0) {
      emailList = selectedCustomers.map(customer => ({
        name: customer.name,
        email: customer.email
      }));
    } else if (promotion.recipients) {
      emailList = parseEmailList(promotion.recipients);
    }
    
    if (!promotion.subject || !promotion.content) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (emailList.length === 0) {
      alert('Please select customers from the list or enter email addresses.');
      return;
    }

    setIsSending(true);
    setSendResults(null);

    try {
      const result = await emailService.sendPromotion({
        subject: promotion.subject,
        content: promotion.content,
        promoCode: promotion.promoCode,
        discountAmount: promotion.discountAmount,
        expiryDate: promotion.expiryDate,
        recipients: emailList,
        fromName: currentUser.businessName || currentUser.name,
        fromEmail: currentUser.email
      });

      setSendResults(result);
      
      if (result.successful > 0) {
        setPromotion({
          subject: '',
          content: '',
          promoCode: '',
          discountAmount: '',
          expiryDate: '',
          recipients: ''
        });
        setSelectedCustomers([]);
      }
    } catch (error) {
      setSendResults({ success: false, error: error.message });
    } finally {
      setIsSending(false);
    }
  };

  if (!isConfigured) {
    return (
      <EmailConfiguration 
        onConfigurationComplete={() => setIsConfigured(true)}
      />
    );
  }

  return (
    <div className="email-sender">
      <div className="email-header">
        <h1>Email Marketing</h1>
        <p>Send professional emails to your customers</p>
        <div className="header-actions">
          <div className="config-status">
            {!EMAIL_CONFIG.PUBLIC_KEY.includes('YOUR_EMAILJS') ? (
              <span className="status-indicator success">
                ✅ Configured with hardcoded credentials
              </span>
            ) : (
              <span className="status-indicator warning">
                ⚠️ Using manual configuration
              </span>
            )}
          </div>
          <button 
            className="config-btn"
            onClick={() => setIsConfigured(false)}
          >
            ⚙️ Email Settings
          </button>
        </div>
      </div>

      <div className="email-tabs">
        <button
          className={`tab-btn ${activeTab === 'single' ? 'active' : ''}`}
          onClick={() => setActiveTab('single')}
        >
          📧 Single Email
        </button>
        <button
          className={`tab-btn ${activeTab === 'bulk' ? 'active' : ''}`}
          onClick={() => setActiveTab('bulk')}
        >
          📮 Bulk Email
        </button>
        <button
          className={`tab-btn ${activeTab === 'newsletter' ? 'active' : ''}`}
          onClick={() => setActiveTab('newsletter')}
        >
          📰 Newsletter
        </button>
        <button
          className={`tab-btn ${activeTab === 'promotion' ? 'active' : ''}`}
          onClick={() => setActiveTab('promotion')}
        >
          🎯 Promotion
        </button>
        <button
          className={`tab-btn ${activeTab === 'debug' ? 'active' : ''}`}
          onClick={() => setActiveTab('debug')}
        >
          🔧 Debug
        </button>
      </div>

      <div className="email-content">
        <div className="templates-sidebar">
          <h3>Email Templates</h3>
          
          <div className="template-options">
            <label className="template-option">
              <input
                type="radio"
                name="templateType"
                checked={useHtmlTemplate}
                onChange={() => setUseHtmlTemplate(true)}
              />
              <span>📧 HTML Templates</span>
            </label>
            <label className="template-option">
              <input
                type="radio"
                name="templateType"
                checked={!useHtmlTemplate}
                onChange={() => setUseHtmlTemplate(false)}
              />
              <span>📝 Text Templates</span>
            </label>
          </div>
          
          <div className="template-list">
            {Object.keys(emailTemplates).map(templateKey => (
              <button
                key={templateKey}
                className={`template-btn ${selectedTemplate === templateKey ? 'active' : ''}`}
                onClick={() => handleTemplateSelect(templateKey)}
              >
                {templateKey.replace('_', ' ').toUpperCase()}
                {emailTemplates[templateKey].html && (
                  <span className="html-badge">HTML</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="email-form">
          {activeTab === 'single' && (
            <div className="single-email-form">
              <h2>Send Single Email</h2>
              
              <div className="form-group">
                <label htmlFor="singleTo">Recipient Email *</label>
                <input
                  type="email"
                  id="singleTo"
                  value={singleEmail.to}
                  onChange={(e) => setSingleEmail({...singleEmail, to: e.target.value})}
                  placeholder="customer@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="singleToName">Recipient Name</label>
                <input
                  type="text"
                  id="singleToName"
                  value={singleEmail.toName}
                  onChange={(e) => setSingleEmail({...singleEmail, toName: e.target.value})}
                  placeholder="Customer Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="singleSubject">Subject *</label>
                <input
                  type="text"
                  id="singleSubject"
                  value={singleEmail.subject}
                  onChange={(e) => setSingleEmail({...singleEmail, subject: e.target.value})}
                  placeholder="Email subject"
                />
              </div>

              <div className="form-group">
                <label htmlFor="singleMessage">Message *</label>
                <textarea
                  id="singleMessage"
                  value={singleEmail.message}
                  onChange={(e) => setSingleEmail({...singleEmail, message: e.target.value})}
                  placeholder="Your email message..."
                  rows={8}
                />
              </div>

              <button
                className="send-btn"
                onClick={handleSingleEmailSend}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="bulk-email-form">
              <h2>Send Bulk Emails</h2>
              
              <div className="recipient-options">
                <button
                  type="button"
                  className={`option-btn ${!showCustomerList ? 'active' : ''}`}
                  onClick={() => setShowCustomerList(false)}
                >
                  📝 Manual Entry
                </button>
                <button
                  type="button"
                  className={`option-btn ${showCustomerList ? 'active' : ''}`}
                  onClick={() => setShowCustomerList(true)}
                >
                  👥 Customer List ({selectedCustomers.length} selected)
                </button>
              </div>

              {showCustomerList ? (
                <CustomerList 
                  onCustomersSelected={setSelectedCustomers}
                  selectedCustomers={selectedCustomers}
                />
              ) : (
                <div className="form-group">
                  <label htmlFor="bulkRecipients">Recipients *</label>
                  <textarea
                    id="bulkRecipients"
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="Enter email addresses (one per line):&#10;John Smith <john@example.com>&#10;jane@example.com&#10;Bob Wilson, bob@example.com"
                    rows={6}
                  />
                  <small>Enter one email per line. Supports: "Name &lt;email&gt;" or "Name, email" format</small>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="bulkSubject">Subject *</label>
                <input
                  type="text"
                  id="bulkSubject"
                  value={bulkEmailData.subject}
                  onChange={(e) => setBulkEmailData({...bulkEmailData, subject: e.target.value})}
                  placeholder="Email subject"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bulkMessage">Message *</label>
                <textarea
                  id="bulkMessage"
                  value={bulkEmailData.message}
                  onChange={(e) => setBulkEmailData({...bulkEmailData, message: e.target.value})}
                  placeholder="Your email message..."
                  rows={8}
                />
              </div>

              <button
                className="send-btn"
                onClick={handleBulkEmailSend}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Bulk Emails'}
              </button>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="newsletter-form">
              <h2>Send Newsletter</h2>
              
              <div className="form-group">
                <label htmlFor="newsletterTitle">Newsletter Title</label>
                <input
                  type="text"
                  id="newsletterTitle"
                  value={newsletter.title}
                  onChange={(e) => setNewsletter({...newsletter, title: e.target.value})}
                  placeholder="Monthly Newsletter"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newsletterSubject">Subject *</label>
                <input
                  type="text"
                  id="newsletterSubject"
                  value={newsletter.subject}
                  onChange={(e) => setNewsletter({...newsletter, subject: e.target.value})}
                  placeholder="Email subject"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newsletterContent">Content *</label>
                <textarea
                  id="newsletterContent"
                  value={newsletter.content}
                  onChange={(e) => setNewsletter({...newsletter, content: e.target.value})}
                  placeholder="Newsletter content..."
                  rows={10}
                />
              </div>

              <div className="recipient-options">
                <button
                  type="button"
                  className={`option-btn ${!showCustomerList ? 'active' : ''}`}
                  onClick={() => setShowCustomerList(false)}
                >
                  📝 Manual Entry
                </button>
                <button
                  type="button"
                  className={`option-btn ${showCustomerList ? 'active' : ''}`}
                  onClick={() => setShowCustomerList(true)}
                >
                  👥 Customer List ({selectedCustomers.length} selected)
                </button>
              </div>

              {showCustomerList ? (
                <CustomerList 
                  onCustomersSelected={setSelectedCustomers}
                  selectedCustomers={selectedCustomers}
                />
              ) : (
                <div className="form-group">
                  <label htmlFor="newsletterRecipients">Recipients *</label>
                  <textarea
                    id="newsletterRecipients"
                    value={newsletter.recipients}
                    onChange={(e) => setNewsletter({...newsletter, recipients: e.target.value})}
                    placeholder="Enter email addresses (one per line)"
                    rows={6}
                  />
                </div>
              )}

              <button
                className="send-btn"
                onClick={handleNewsletterSend}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Newsletter'}
              </button>
            </div>
          )}

          {activeTab === 'promotion' && (
            <div className="promotion-form">
              <h2>Send Promotional Email</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="promoCode">Promo Code</label>
                  <input
                    type="text"
                    id="promoCode"
                    value={promotion.promoCode}
                    onChange={(e) => setPromotion({...promotion, promoCode: e.target.value})}
                    placeholder="SAVE20"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="discountAmount">Discount Amount</label>
                  <input
                    type="text"
                    id="discountAmount"
                    value={promotion.discountAmount}
                    onChange={(e) => setPromotion({...promotion, discountAmount: e.target.value})}
                    placeholder="20% off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="date"
                    id="expiryDate"
                    value={promotion.expiryDate}
                    onChange={(e) => setPromotion({...promotion, expiryDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="promoSubject">Subject *</label>
                <input
                  type="text"
                  id="promoSubject"
                  value={promotion.subject}
                  onChange={(e) => setPromotion({...promotion, subject: e.target.value})}
                  placeholder="Special offer just for you!"
                />
              </div>

              <div className="form-group">
                <label htmlFor="promoContent">Content *</label>
                <textarea
                  id="promoContent"
                  value={promotion.content}
                  onChange={(e) => setPromotion({...promotion, content: e.target.value})}
                  placeholder="Promotional email content..."
                  rows={8}
                />
              </div>

              <div className="recipient-options">
                <button
                  type="button"
                  className={`option-btn ${!showCustomerList ? 'active' : ''}`}
                  onClick={() => setShowCustomerList(false)}
                >
                  📝 Manual Entry
                </button>
                <button
                  type="button"
                  className={`option-btn ${showCustomerList ? 'active' : ''}`}
                  onClick={() => setShowCustomerList(true)}
                >
                  👥 Customer List ({selectedCustomers.length} selected)
                </button>
              </div>

              {showCustomerList ? (
                <CustomerList 
                  onCustomersSelected={setSelectedCustomers}
                  selectedCustomers={selectedCustomers}
                />
              ) : (
                <div className="form-group">
                  <label htmlFor="promoRecipients">Recipients *</label>
                  <textarea
                    id="promoRecipients"
                    value={promotion.recipients}
                    onChange={(e) => setPromotion({...promotion, recipients: e.target.value})}
                    placeholder="Enter email addresses (one per line)"
                    rows={6}
                  />
                </div>
              )}

              <button
                className="send-btn"
                onClick={handlePromotionSend}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send Promotion'}
              </button>
            </div>
          )}

          {activeTab === 'debug' && (
            <div className="debug-tab">
              <EmailTester />
            </div>
          )}
        </div>
      </div>

      {sendResults && (
        <div className="send-results">
          {sendResults.success !== undefined ? (
            // Single email result
            <div className={`result-card ${sendResults.success ? 'success' : 'error'}`}>
              <div className="result-icon">
                {sendResults.success ? '✅' : '❌'}
              </div>
              <div className="result-content">
                <h3>{sendResults.success ? 'Email Sent Successfully!' : 'Email Failed to Send'}</h3>
                <p>{sendResults.success ? 'Your email has been delivered.' : sendResults.error}</p>
              </div>
            </div>
          ) : (
            // Bulk email results
            <div className="bulk-results">
              <div className="result-summary">
                <h3>Bulk Email Results</h3>
                <div className="result-stats">
                  <div className="stat success">
                    <span className="stat-number">{sendResults.successful}</span>
                    <span className="stat-label">Successful</span>
                  </div>
                  <div className="stat error">
                    <span className="stat-number">{sendResults.failed}</span>
                    <span className="stat-label">Failed</span>
                  </div>
                  <div className="stat total">
                    <span className="stat-number">{sendResults.total}</span>
                    <span className="stat-label">Total</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailSender;
