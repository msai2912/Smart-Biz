# Email Service Setup Guide

This guide covers two ways to configure the EmailJS service for your SmartBiz application.

## Option 1: Hardcoded Configuration (Recommended for Production)

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Set Up Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email
5. Note down your **Service ID**

### 3. Create Email Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template structure:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{subject}}</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem;">
            <h1 style="margin: 0; font-size: 2rem;">{{business_name}}</h1>
            <p style="margin: 1rem 0 0 0; opacity: 0.9;">Professional Business Communications</p>
        </div>
        
        <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hello {{customer_name || 'Valued Customer'}},</h2>
            
            <div style="color: #555; line-height: 1.6; margin: 1.5rem 0;">
                {{message}}
            </div>
            
            <div style="margin: 2rem 0; padding: 1rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #666; font-style: italic;">
                    "We're committed to providing you with exceptional service and value."
                </p>
            </div>
            
            <div style="text-align: center; margin: 2rem 0;">
                <a href="{{website_link}}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                    Visit Our Website
                </a>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 2rem; padding: 1rem; color: #888; font-size: 0.9rem;">
            <p>Best regards,<br><strong>{{business_name}} Team</strong></p>
            <p>Email: {{business_email}} | Website: <a href="{{website_link}}" style="color: #667eea;">{{website_link}}</a></p>
            <p style="font-size: 0.8rem; margin-top: 1rem;">
                This email was sent from {{business_name}}. If you no longer wish to receive these emails, please contact us.
            </p>
        </div>
    </div>
</body>
</html>
```

4. Set the template variables:
   - `to_email`: {{to_email}}
   - `to_name`: {{to_name}}
   - `subject`: {{subject}}
   - `message`: {{message}}
   - `business_name`: {{business_name}}
   - `business_email`: {{business_email}}
   - `customer_name`: {{customer_name}}
   - `website_link`: {{website_link}}

5. Note down your **Template ID**

### 4. Get Public Key
1. Go to "Account" → "General" in EmailJS dashboard
2. Copy your **Public Key** (User ID)

### 5. Configure the Application
1. Open `src/config/emailConfig.js`
2. Replace the placeholder values:

```javascript
export const EMAIL_CONFIG = {
  PUBLIC_KEY: 'your_actual_public_key_here',
  SERVICE_ID: 'your_actual_service_id_here',
  TEMPLATE_ID: 'your_actual_template_id_here'
};
```

3. Save the file

### 6. Test the Configuration
1. Run your application
2. Go to Dashboard → Email Marketing
3. You should see "✅ Configured with hardcoded credentials" status
4. Send a test email to verify everything works

## Option 2: Manual Configuration (Alternative)

If you prefer not to hardcode credentials in the application:

1. Leave the default values in `src/config/emailConfig.js`
2. The application will show a configuration wizard
3. Enter your EmailJS credentials through the UI
4. Credentials will be saved in browser's localStorage

## Security Considerations

### For Hardcoded Configuration:
- ✅ Public Key is meant to be exposed (EmailJS design)
- ✅ Service ID and Template ID are not sensitive
- ✅ No private API keys are used
- ✅ Rate limiting is handled by EmailJS
- ⚠️ Consider environment variables for different deployments

### Environment Variables (Advanced):
For different environments, you can use:
```javascript
export const EMAIL_CONFIG = {
  PUBLIC_KEY: process.env.VITE_EMAILJS_PUBLIC_KEY || 'fallback_key',
  SERVICE_ID: process.env.VITE_EMAILJS_SERVICE_ID || 'fallback_service',
  TEMPLATE_ID: process.env.VITE_EMAILJS_TEMPLATE_ID || 'fallback_template'
};
```

## Troubleshooting

### Common Issues:
1. **"Service is not configured"** - Check if all three credentials are set correctly
2. **"Template not found"** - Verify Template ID matches exactly
3. **"Service not found"** - Verify Service ID matches exactly
4. **Emails not sending** - Check email service connection in EmailJS dashboard
5. **Template variables not working** - Ensure variable names match exactly (case-sensitive)

### Testing Tips:
- Start with a simple text template first
- Use the EmailJS dashboard to send test emails
- Check browser console for error messages
- Verify your email service is properly connected

## Features Included

✅ **Single Email Sending** - Send individual emails to customers
✅ **Bulk Email Campaigns** - Send to multiple recipients at once
✅ **Newsletter System** - Professional newsletter distribution
✅ **Promotional Emails** - Marketing campaigns with promo codes
✅ **Customer Management** - Add, edit, and organize customer lists
✅ **HTML Templates** - Rich email templates with variables
✅ **Template Variables** - Dynamic content injection
✅ **Email Preview** - Preview before sending
✅ **Delivery Tracking** - Success/failure notifications
✅ **Rate Limiting** - Prevents spam and API limits

## Rate Limits

EmailJS free tier includes:
- 200 emails/month
- No daily sending limit
- Email templates
- Basic analytics

For higher volumes, consider upgrading to EmailJS paid plans.
