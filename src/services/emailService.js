import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../config/emailConfig';

class EmailService {
  constructor() {
    // Initialize EmailJS with hardcoded credentials
    this.publicKey = EMAIL_CONFIG.PUBLIC_KEY;
    this.serviceId = EMAIL_CONFIG.SERVICE_ID;
    this.templateId = EMAIL_CONFIG.TEMPLATE_ID;
    
    // Auto-configure with hardcoded credentials
    this.configureWithDefaults();
  }

  configureWithDefaults() {
    try {
      // Check if credentials are properly set
      if (!this.publicKey || 
          !this.serviceId || 
          !this.templateId ||
          this.publicKey.includes('YOUR_EMAILJS') ||
          this.serviceId.includes('YOUR_EMAILJS') ||
          this.templateId.includes('YOUR_EMAILJS')) {
        console.warn('⚠️ EmailJS credentials not properly configured. Please update src/config/emailConfig.js');
        return false;
      }

      // Initialize EmailJS with hardcoded public key
      emailjs.init(this.publicKey);
      return true;
    } catch (error) {
      console.error('❌ Failed to configure EmailJS with default credentials:', error);
      return false;
    }
  }

  // Configure EmailJS credentials (for manual override)
  configure(config) {
    this.publicKey = config.publicKey;
    this.serviceId = config.serviceId;
    this.templateId = config.templateId;
    
    if (this.publicKey) {
      emailjs.init(this.publicKey);
      return true;
    }
    return false;
  }

  // Send email to single customer
  async sendEmail(emailData) {
    try {
      if (!this.isConfigured()) {
        throw new Error('EmailJS not configured. Please set up your credentials first.');
      }

      // Use minimal, standard EmailJS template variables
      const templateParams = {
        // These are the most common EmailJS template variables
        to_email: emailData.to,
        to_name: emailData.toName || 'Customer',
        from_name: emailData.fromName || 'Business',
        subject: emailData.subject,
        message: emailData.message,
        reply_to: emailData.fromEmail || emailData.to
      };

      console.log('📧 Sending email with parameters:', templateParams);
      console.log('🔧 Using service:', this.serviceId);
      console.log('📋 Using template:', this.templateId);

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('✅ EmailJS response:', response);

      return {
        success: true,
        messageId: response.text,
        status: response.status
      };
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      console.error('🔍 Error details:', {
        name: error.name,
        message: error.message,
        text: error.text,
        status: error.status
      });
      
      return {
        success: false,
        error: error.text || error.message || 'Failed to send email',
        details: {
          name: error.name,
          status: error.status,
          text: error.text
        }
      };
    }
  }

  // Send bulk emails to multiple customers
  async sendBulkEmails(emailList, commonData) {
    const results = [];
    const batchSize = 5; // Process in batches to avoid rate limiting
    
    for (let i = 0; i < emailList.length; i += batchSize) {
      const batch = emailList.slice(i, i + batchSize);
      const batchPromises = batch.map(async (email) => {
        const emailData = {
          ...commonData,
          to: email.email,
          toName: email.name
        };
        
        // Add delay between emails to respect rate limits
        await this.delay(200);
        return this.sendEmail(emailData);
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return {
      total: emailList.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  }

  // Send newsletter
  async sendNewsletter(newsletterData) {
    return this.sendBulkEmails(newsletterData.recipients, {
      fromName: newsletterData.fromName,
      fromEmail: newsletterData.fromEmail,
      subject: newsletterData.subject,
      message: newsletterData.content,
      customFields: {
        newsletter_title: newsletterData.title,
        unsubscribe_link: newsletterData.unsubscribeLink || ''
      }
    });
  }

  // Send promotional email
  async sendPromotion(promoData) {
    return this.sendBulkEmails(promoData.recipients, {
      fromName: promoData.fromName,
      fromEmail: promoData.fromEmail,
      subject: promoData.subject,
      message: promoData.content,
      customFields: {
        promo_code: promoData.promoCode || '',
        discount_amount: promoData.discountAmount || '',
        expiry_date: promoData.expiryDate || ''
      }
    });
  }

  // Send appointment reminder
  async sendAppointmentReminder(reminderData) {
    return this.sendEmail({
      to: reminderData.customerEmail,
      toName: reminderData.customerName,
      fromName: reminderData.businessName,
      fromEmail: reminderData.businessEmail,
      subject: `Appointment Reminder - ${reminderData.appointmentDate}`,
      message: reminderData.message,
      customFields: {
        appointment_date: reminderData.appointmentDate,
        appointment_time: reminderData.appointmentTime,
        service_type: reminderData.serviceType || '',
        location: reminderData.location || ''
      }
    });
  }

  // Send thank you email
  async sendThankYou(thankYouData) {
    return this.sendEmail({
      to: thankYouData.customerEmail,
      toName: thankYouData.customerName,
      fromName: thankYouData.businessName,
      fromEmail: thankYouData.businessEmail,
      subject: thankYouData.subject || 'Thank you for your business!',
      message: thankYouData.message,
      customFields: {
        order_number: thankYouData.orderNumber || '',
        purchase_amount: thankYouData.purchaseAmount || '',
        purchase_date: thankYouData.purchaseDate || ''
      }
    });
  }

  // Test email configuration
  async testConfiguration(testEmail) {
    try {
      const result = await this.sendEmail({
        to: testEmail,
        toName: 'Test User',
        fromName: 'SmartBiz Email Service',
        subject: 'Email Configuration Test',
        message: 'This is a test email to verify your EmailJS configuration is working correctly.'
      });
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Utility methods
  isConfigured() {
    return this.publicKey && 
           this.publicKey !== 'YOUR_PUBLIC_KEY' && 
           this.serviceId && 
           this.serviceId !== 'YOUR_SERVICE_ID' && 
           this.templateId && 
           this.templateId !== 'YOUR_TEMPLATE_ID';
  }

  // Test email configuration with minimal parameters
  async testConfiguration(testEmail = 'test@example.com') {
    try {
      console.log('Testing EmailJS configuration...');
      console.log('Public Key:', this.publicKey);
      console.log('Service ID:', this.serviceId);
      console.log('Template ID:', this.templateId);

      const testParams = {
        to_email: testEmail,
        to_name: 'Test User',
        from_name: 'Test Business',
        subject: 'Test Email',
        message: 'This is a test email to verify configuration.',
        business_name: 'Test Business',
        business_email: 'business@test.com',
        customer_name: 'Test User',
        website_link: 'https://example.com'
      };

      console.log('Test parameters:', testParams);

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        testParams
      );

      console.log('Test email sent successfully:', response);
      return { success: true, response };
    } catch (error) {
      console.error('Test email failed:', error);
      console.error('Error details:', error.text || error.message);
      return { 
        success: false, 
        error: error.text || error.message,
        details: error
      };
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Process template with variables
  processTemplate(template, variables = {}) {
    let processed = template;
    
    // Replace all {{variable}} patterns with actual values
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, variables[key] || '');
    });
    
    return processed;
  }

  // Get processed email template (both text and HTML)
  getProcessedTemplate(templateKey, variables = {}) {
    const templates = this.getEmailTemplates();
    const template = templates[templateKey];
    
    if (!template) {
      return null;
    }

    return {
      subject: this.processTemplate(template.subject, variables),
      content: this.processTemplate(template.content, variables),
      html: template.html ? this.processTemplate(template.html, variables) : null
    };
  }

  // Email templates for common scenarios
  getEmailTemplates() {
    return {
      welcome: {
        subject: 'Welcome to {{business_name}}!',
        content: `Dear {{customer_name}},

Welcome to {{business_name}}! We're thrilled to have you as a customer.

{{welcome_message}}

If you have any questions, please don't hesitate to reach out to us.

Best regards,
{{business_name}} Team`,
        html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="{{website_link}}" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="{{logo_url}}"
        alt="{{business_name}} logo"
      />
    </a>
    <p>Welcome to the {{business_name}} family! We're excited to have you on board.</p>
    <p>
      Your account has been successfully created, and you're now ready to explore all the great
      features we offer.
    </p>
    <p>
      <a
        style="
          display: inline-block;
          text-decoration: none;
          outline: none;
          color: #fff;
          background-color: #fc0038;
          padding: 8px 16px;
          border-radius: 4px;
        "
        href="{{website_link}}"
        target="_blank"
      >
        Open {{business_name}}
      </a>
    </p>
    <p>
      If you have any questions or need help getting started, our support team is just an email away
      at
      <a href="mailto:{{business_email}}" style="text-decoration: none; outline: none; color: #fc0038"
        >{{business_email}}</a
      >. We're here to assist you every step of the way!
    </p>
    <p>Best regards,<br />The {{business_name}} Team</p>
  </div>
</div>`
      },
      
      promotion: {
        subject: 'Special Offer: {{discount_amount}} Off!',
        content: `Hi {{customer_name}},

We have an exciting offer just for you!

{{promo_message}}

Use code: {{promo_code}}
Valid until: {{expiry_date}}

Shop now and save!

Best regards,
{{business_name}}`,
        html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="{{website_link}}" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="{{logo_url}}"
        alt="{{business_name}} logo"
      />
    </a>
    <h2 style="color: #fc0038; margin-top: 24px;">Special Offer Just for You!</h2>
    <p>Hi {{customer_name}},</p>
    <p>We have an exciting offer just for you!</p>
    
    <div style="background-color: #fff; border: 2px dashed #fc0038; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px;">
      <h3 style="margin: 0; color: #fc0038; font-size: 24px;">{{discount_amount}} OFF</h3>
      <p style="margin: 8px 0; font-size: 18px; font-weight: bold;">Use code: <span style="background-color: #fc0038; color: white; padding: 4px 8px; border-radius: 4px;">{{promo_code}}</span></p>
      <p style="margin: 0; color: #666;">Valid until: {{expiry_date}}</p>
    </div>
    
    <p>{{promo_message}}</p>
    
    <p>
      <a
        style="
          display: inline-block;
          text-decoration: none;
          outline: none;
          color: #fff;
          background-color: #fc0038;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: bold;
        "
        href="{{website_link}}"
        target="_blank"
      >
        Shop Now & Save!
      </a>
    </p>
    
    <p>
      Questions? Contact us at
      <a href="mailto:{{business_email}}" style="text-decoration: none; outline: none; color: #fc0038"
        >{{business_email}}</a
      >.
    </p>
    <p>Best regards,<br />The {{business_name}} Team</p>
  </div>
</div>`
      },
      
      appointment_reminder: {
        subject: 'Appointment Reminder - {{appointment_date}}',
        content: `Hi {{customer_name}},

This is a friendly reminder about your upcoming appointment:

Date: {{appointment_date}}
Time: {{appointment_time}}
Service: {{service_type}}
Location: {{location}}

{{reminder_message}}

Looking forward to seeing you!

Best regards,
{{business_name}}`,
        html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="{{website_link}}" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="{{logo_url}}"
        alt="{{business_name}} logo"
      />
    </a>
    <h2 style="color: #fc0038; margin-top: 24px;">Appointment Reminder</h2>
    <p>Hi {{customer_name}},</p>
    <p>This is a friendly reminder about your upcoming appointment:</p>
    
    <div style="background-color: #fff; border-left: 4px solid #fc0038; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px 0; color: #333;">Appointment Details</h3>
      <p style="margin: 4px 0;"><strong>Date:</strong> {{appointment_date}}</p>
      <p style="margin: 4px 0;"><strong>Time:</strong> {{appointment_time}}</p>
      <p style="margin: 4px 0;"><strong>Service:</strong> {{service_type}}</p>
      <p style="margin: 4px 0;"><strong>Location:</strong> {{location}}</p>
    </div>
    
    <p>{{reminder_message}}</p>
    <p>Looking forward to seeing you!</p>
    
    <p>
      Need to reschedule? Contact us at
      <a href="mailto:{{business_email}}" style="text-decoration: none; outline: none; color: #fc0038"
        >{{business_email}}</a
      >.
    </p>
    <p>Best regards,<br />The {{business_name}} Team</p>
  </div>
</div>`
      },
      
      newsletter: {
        subject: '{{newsletter_title}} - {{business_name}}',
        content: `Hi {{customer_name}},

{{newsletter_content}}

{{unsubscribe_text}}

Best regards,
{{business_name}} Team`,
        html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="{{website_link}}" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="{{logo_url}}"
        alt="{{business_name}} logo"
      />
    </a>
    <h1 style="color: #fc0038; margin-top: 24px; border-bottom: 2px solid #fc0038; padding-bottom: 8px;">{{newsletter_title}}</h1>
    <p>Hi {{customer_name}},</p>
    
    <div style="background-color: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      {{newsletter_content}}
    </div>
    
    <hr style="border: none; height: 1px; background-color: #ddd; margin: 24px 0;">
    
    <p style="font-size: 14px; color: #666;">
      {{unsubscribe_text}}
    </p>
    
    <p>Best regards,<br />The {{business_name}} Team</p>
  </div>
</div>`
      },
      
      thank_you: {
        subject: 'Thank you for your purchase!',
        content: `Dear {{customer_name}},

Thank you for your recent purchase!

Order #: {{order_number}}
Amount: {{purchase_amount}}
Date: {{purchase_date}}

{{thank_you_message}}

We appreciate your business and look forward to serving you again.

Best regards,
{{business_name}}`,
        html: `<div style="font-family: system-ui, sans-serif, Arial; font-size: 16px; background-color: #fff8f1">
  <div style="max-width: 600px; margin: auto; padding: 16px">
    <a style="text-decoration: none; outline: none" href="{{website_link}}" target="_blank">
      <img
        style="height: 32px; vertical-align: middle"
        height="32px"
        src="{{logo_url}}"
        alt="{{business_name}} logo"
      />
    </a>
    <h2 style="color: #fc0038; margin-top: 24px;">Thank You for Your Purchase!</h2>
    <p>Dear {{customer_name}},</p>
    <p>Thank you for your recent purchase! We're thrilled to have you as a customer.</p>
    
    <div style="background-color: #fff; border: 1px solid #ddd; padding: 16px; margin: 20px 0; border-radius: 8px;">
      <h3 style="margin: 0 0 12px 0; color: #333;">Order Summary</h3>
      <p style="margin: 4px 0;"><strong>Order #:</strong> {{order_number}}</p>
      <p style="margin: 4px 0;"><strong>Amount:</strong> {{purchase_amount}}</p>
      <p style="margin: 4px 0;"><strong>Date:</strong> {{purchase_date}}</p>
    </div>
    
    <p>{{thank_you_message}}</p>
    
    <p>We appreciate your business and look forward to serving you again.</p>
    
    <p>
      <a
        style="
          display: inline-block;
          text-decoration: none;
          outline: none;
          color: #fff;
          background-color: #fc0038;
          padding: 8px 16px;
          border-radius: 4px;
        "
        href="{{website_link}}"
        target="_blank"
      >
        Visit Our Store
      </a>
    </p>
    
    <p>
      Questions about your order? Contact us at
      <a href="mailto:{{business_email}}" style="text-decoration: none; outline: none; color: #fc0038"
        >{{business_email}}</a
      >.
    </p>
    <p>Best regards,<br />The {{business_name}} Team</p>
  </div>
</div>`
      }
    };
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;
