// AI Service using Gemini API with OpenAI compatibility layer
import OpenAI from "openai";
import { 
  AIServiceError, 
  withRetry, 
  validateApiKey, 
  handleApiError, 
  logError, 
  getFallbackContent 
} from './errorHandler';

// Get API key and validate it
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCs9qQLy7XTg0bpM57Bblw4Nq9BV6nUp7Q';

try {
  validateApiKey(apiKey);
} catch (error) {
  logError(error, 'API Key Validation');
}

// Initialize the Gemini client with OpenAI compatibility
const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    dangerouslyAllowBrowser: true
});

/**
 * Generate comprehensive website content and structure based on business information and user preferences
 * @param {Object} businessInfo - Information about the business
 * @param {Object} userPreferences - User design and content preferences
 * @param {string} selectedTemplate - Selected template type
 * @returns {Promise<Object>} - Generated content, structure, and styling suggestions
 */
export const generateWebsiteContent = async (businessInfo, userPreferences = {}, selectedTemplate = 'modern') => {
    return withRetry(async () => {
        try {
            const { name, type, description, products, services, targetAudience, goals } = businessInfo;
            const { tone = 'professional', style = 'clean', colorPreference, contentFocus } = userPreferences;
            
            // Create a comprehensive prompt for the AI
            const prompt = `You are an expert website content creator. Based on the business information provided, generate comprehensive, engaging website content that sounds professional and authentic.

Business Information:
- Name: ${name}
- Type: ${type}
- Description: ${description}
- Products: ${products || 'Not specified'}
- Services: ${services || 'Not specified'}
- Target Audience: ${targetAudience || 'General customers'}
- Business Goals: ${goals || 'Increase online presence'}

User Preferences:
- Content Tone: ${tone}
- Design Style: ${style}
- Template: ${selectedTemplate}
- Color Preference: ${colorPreference || 'No specific preference'}
- Content Focus: ${contentFocus || 'Balanced approach'}

Generate a JSON response with the following structure. Make sure ALL sections are filled with relevant, detailed content:

{
  "hero": {
    "headline": "Create a catchy, memorable business title/slogan (NOT just repeating the business name or description, but a creative headline that captures what they do in an engaging way)",
    "tagline": "A short, punchy tagline that complements the headline (8-12 words max)",
    "description": "A brief compelling description of what the business offers (2-3 sentences max)",
    "primaryCTA": "Strong action-oriented call-to-action button text",
    "secondaryCTA": "Secondary softer call-to-action"
  },
  "about": {
    "title": "Creative section title (not just 'About Us' - make it unique)",
    "story": "Engaging business story that connects with customers (3-4 sentences)",
    "mission": "Clear mission statement that shows purpose and values",
    "whyChooseUs": "Compelling reason why customers should choose this business",
    "yearsExperience": "Number or description of experience level",
    "teamSize": "Description of team size and expertise"
  },
  "services": {
    "title": "Creative services section title",
    "overview": "Overview of what the business provides (2-3 sentences)",
    "serviceList": [
      {
        "name": "Service 1 name",
        "description": "Detailed description of this service"
      },
      {
        "name": "Service 2 name", 
        "description": "Detailed description of this service"
      },
      {
        "name": "Service 3 name",
        "description": "Detailed description of this service"
      }
    ],
    "benefits": "Key benefits customers get from these services",
    "process": "Brief description of how the business works with clients"
  },
  "whatWeOffer": {
    "title": "Creative offerings section title",
    "valueStatement": "Strong value proposition statement",
    "offerings": [
      {
        "title": "Offering 1",
        "description": "Detailed description of this offering"
      },
      {
        "title": "Offering 2",
        "description": "Detailed description of this offering"
      },
      {
        "title": "Offering 3",
        "description": "Detailed description of this offering"
      }
    ],
    "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
  },
  "whoWeServe": {
    "title": "Creative target audience section title",
    "description": "Description of target customers and their needs",
    "industries": ["Industry 1", "Industry 2", "Industry 3"],
    "coverage": "Geographic coverage area",
    "clientTypes": ["Client type 1", "Client type 2", "Client type 3"]
  },
  "testimonials": {
    "title": "Creative testimonials section title",
    "overallRating": "4.8",
    "totalReviews": "150+",
    "reviews": [
      {
        "name": "Realistic customer name",
        "company": "Company/Role (optional)",
        "comment": "Authentic-sounding positive review (2-3 sentences)",
        "rating": "5"
      },
      {
        "name": "Realistic customer name",
        "company": "Company/Role (optional)", 
        "comment": "Authentic-sounding positive review (2-3 sentences)",
        "rating": "5"
      },
      {
        "name": "Realistic customer name",
        "comment": "Authentic-sounding positive review (2-3 sentences)",
        "rating": "5"
      }
    ]
  },
  "whyChooseUs": {
    "title": "Creative competitive advantage section title",
    "differentiators": [
      {
        "title": "Key differentiator 1",
        "description": "Why this makes them better than competitors"
      },
      {
        "title": "Key differentiator 2", 
        "description": "Why this makes them better than competitors"
      },
      {
        "title": "Key differentiator 3",
        "description": "Why this makes them better than competitors"
      }
    ],
    "guarantees": "Strong guarantee or promise to customers"
  },
  "contact": {
    "title": "Creative contact section title",
    "encouragement": "Encouraging message to get customers to reach out",
    "expectation": "What customers can expect when they contact",
    "responseTime": "How quickly they respond",
    "consultationInfo": "Information about free consultation or initial meeting"
  },
  "additionalContent": {
    "metaDescription": "SEO-optimized meta description (150-160 characters)",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "faq": [
      {
        "question": "Common question customers ask",
        "answer": "Helpful answer to the question"
      },
      {
        "question": "Another common question",
        "answer": "Helpful answer to the question"
      }
    ],
    "blogIdeas": ["Blog post idea 1", "Blog post idea 2", "Blog post idea 3"],
    "socialBio": "Short social media bio description"
  }
}

IMPORTANT: 
- Make the headline CREATIVE and CATCHY, not just a repeat of the business name or description
- Fill ALL arrays with multiple relevant items
- Make content sound authentic and professional
- Tailor everything specifically to this business type and description
- Use industry-specific language where appropriate
- Make testimonials sound realistic and specific
- Ensure all content is substantial and detailed`;

            const response = await openai.chat.completions.create({
                model: "gemini-2.0-flash",
                messages: [
                    { 
                        role: "system", 
                        content: `You are an expert website content creator, copywriter, and digital marketing specialist. 
                        You specialize in creating comprehensive, conversion-focused website content for small to medium businesses.
                        You understand industry-specific language, customer psychology, and modern web content best practices.
                        Always respond with valid JSON and ensure all content is highly specific to the business type and description provided.
                        Create content that builds trust, demonstrates expertise, and drives action.
                        Include realistic testimonials that sound authentic and specific to the business type.`
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 4000
            });

            // Parse the response to get the generated content
            const content = response.choices[0].message.content;
            try {
                // Try to parse as JSON directly
                const parsedContent = JSON.parse(content);
                
                // Validate that core sections are present
                const requiredSections = ['hero', 'about', 'services', 'contact'];
                const optionalSections = ['whatWeOffer', 'whoWeServe', 'testimonials', 'whyChooseUs', 'additionalContent'];
                
                // Create a comprehensive content structure
                const completeContent = {
                    // Hero Section
                    hero: {
                        headline: parsedContent.hero?.headline || parsedContent.headline || `Welcome to ${businessInfo.name}`,
                        tagline: parsedContent.hero?.tagline || parsedContent.tagline || `Your trusted ${businessInfo.type}`,
                        description: parsedContent.hero?.description || parsedContent.hero?.subtitle || businessInfo.description,
                        primaryCTA: parsedContent.hero?.primaryCTA || 'Get Started Today',
                        secondaryCTA: parsedContent.hero?.secondaryCTA || 'Learn More'
                    },
                    
                    // About Section
                    about: {
                        title: parsedContent.about?.title || 'About Us',
                        mission: parsedContent.about?.mission || `${businessInfo.name} is committed to providing exceptional service.`,
                        story: parsedContent.about?.story || parsedContent.about || businessInfo.description,
                        whyChooseUs: parsedContent.about?.whyChooseUs || 'Experience, quality, and customer satisfaction are our priorities.',
                        yearsExperience: parsedContent.about?.yearsExperience || '10+',
                        teamSize: parsedContent.about?.teamSize || 'Professional team'
                    },
                    
                    // Services Section
                    services: {
                        title: parsedContent.services?.title || 'Our Services',
                        overview: parsedContent.services?.overview || `${businessInfo.name} offers comprehensive services tailored to your needs.`,
                        serviceList: parsedContent.services?.serviceList || parsedContent.services?.list || [],
                        benefits: parsedContent.services?.benefits || 'Quality service with professional results.',
                        process: parsedContent.services?.process || 'We work closely with our clients to ensure satisfaction.'
                    },
                    
                    // What We Offer Section
                    whatWeOffer: {
                        title: parsedContent.whatWeOffer?.title || 'What We Offer',
                        categories: parsedContent.whatWeOffer?.categories || [],
                        offerings: parsedContent.whatWeOffer?.offerings || parsedContent.whatWeOffer?.items || [],
                        features: parsedContent.whatWeOffer?.features || [],
                        valueStatement: parsedContent.whatWeOffer?.valueStatement || 'Comprehensive solutions for all your needs.'
                    },
                    
                    // Who We Serve Section
                    whoWeServe: {
                        title: parsedContent.whoWeServe?.title || 'Who We Serve',
                        description: parsedContent.whoWeServe?.description || businessInfo.targetAudience || 'We serve a diverse range of clients.',
                        industries: parsedContent.whoWeServe?.industries || [],
                        coverage: parsedContent.whoWeServe?.coverage || 'Local and regional area',
                        clientTypes: parsedContent.whoWeServe?.clientTypes || ['Individual clients', 'Businesses']
                    },
                    
                    // Testimonials Section
                    testimonials: {
                        title: parsedContent.testimonials?.title || 'What Our Clients Say',
                        reviews: parsedContent.testimonials?.reviews || parsedContent.testimonials || [],
                        overallRating: parsedContent.testimonials?.overallRating || '4.9',
                        totalReviews: parsedContent.testimonials?.totalReviews || '100+'
                    },
                    
                    // Why Choose Us Section
                    whyChooseUs: {
                        title: parsedContent.whyChooseUs?.title || 'Why Choose Us',
                        differentiators: parsedContent.whyChooseUs?.differentiators || parsedContent.whyChooseUs || [],
                        advantages: parsedContent.whyChooseUs?.advantages || [],
                        guarantees: parsedContent.whyChooseUs?.guarantees || 'Satisfaction guaranteed'
                    },
                    
                    // Contact Section
                    contact: {
                        title: parsedContent.contact?.title || 'Get In Touch',
                        encouragement: parsedContent.contact?.encouragement || parsedContent.contactMessage || 'Ready to get started? Contact us today!',
                        expectation: parsedContent.contact?.expectation || 'We\'ll respond promptly to discuss your needs.',
                        responseTime: parsedContent.contact?.responseTime || 'Within 24 hours',
                        consultationInfo: parsedContent.contact?.consultationInfo || 'Free consultation available'
                    },
                    
                    // Additional Content
                    additionalContent: {
                        metaDescription: parsedContent.additionalContent?.metaDescription || parsedContent.metaDescription || `${businessInfo.name} - ${businessInfo.description}`,
                        keywords: parsedContent.additionalContent?.keywords || [],
                        faq: parsedContent.additionalContent?.faq || [],
                        blogIdeas: parsedContent.additionalContent?.blogIdeas || [],
                        socialBio: parsedContent.additionalContent?.socialBio || `${businessInfo.name} - ${businessInfo.description}`
                    },
                    
                    // Legacy support for existing templates
                    headline: parsedContent.hero?.headline || parsedContent.headline || `Welcome to ${businessInfo.name}`,
                    tagline: parsedContent.hero?.tagline || parsedContent.tagline || `Your trusted ${businessInfo.type}`,
                    callToAction: parsedContent.hero?.primaryCTA || parsedContent.callToAction || 'Get Started Today'
                };
                
                return completeContent;
            } catch (parseError) {
                // If not in JSON format, extract it manually
                console.warn("AI response not in JSON format, extracting manually");
                
                const extractedContent = {
                    hero: {
                        headline: extractSection(content, "headline") || `Welcome to ${businessInfo.name}`,
                        tagline: extractSection(content, "tagline") || `Your trusted ${businessInfo.type}`,
                        description: businessInfo.description,
                        primaryCTA: 'Get Started Today',
                        secondaryCTA: 'Learn More'
                    },
                    about: {
                        title: 'About Us',
                        story: extractSection(content, "about") || businessInfo.description,
                        mission: `${businessInfo.name} is committed to providing exceptional service.`,
                        whyChooseUs: 'Experience, quality, and customer satisfaction.',
                        yearsExperience: '10+',
                        teamSize: 'Professional team'
                    },
                    services: {
                        title: 'Our Services',
                        overview: extractSection(content, "services") || businessInfo.services || businessInfo.products,
                        serviceList: [],
                        benefits: 'Quality service with professional results.',
                        process: 'We work closely with our clients.'
                    },
                    contact: {
                        title: 'Get In Touch',
                        encouragement: extractSection(content, "callToAction") || "Contact us today!",
                        expectation: 'We\'ll respond promptly to discuss your needs.',
                        responseTime: 'Within 24 hours'
                    },
                    // Legacy support
                    headline: extractSection(content, "headline") || `Welcome to ${businessInfo.name}`,
                    tagline: extractSection(content, "tagline") || `Your trusted ${businessInfo.type}`,
                    about: extractSection(content, "about") || businessInfo.description,
                    services: extractSection(content, "services") || businessInfo.services || businessInfo.products,
                    callToAction: extractSection(content, "callToAction") || "Contact us today!"
                };
                
                return extractedContent;
            }
        } catch (error) {
            handleApiError(error);
        }
    }, 2, 2000).catch(error => {
        logError(error, 'Content Generation');
        // Return fallback content
        return getFallbackContent(businessInfo, 'content');
    });
};

/**
 * Generate enhanced styling suggestions for the website based on business type and user preferences
 * @param {string} businessType - Type of business
 * @param {Object} userPreferences - User design preferences and requirements
 * @param {Object} businessInfo - Additional business context
 * @returns {Promise<Object>} - Comprehensive styling suggestions including color palette, typography, layout preferences
 */
export const generateEnhancedStyleSuggestions = async (businessType, userPreferences = {}, businessInfo = {}) => {
    return withRetry(async () => {
        try {
            const { colorPreference, style, mood, targetAudience } = userPreferences;
            const { products, services, brandPersonality } = businessInfo;
            
            const prompt = `
            Create a comprehensive design system for a ${businessType} website.
            
            Business Context:
            - Industry: ${businessType}
            - Products/Services: ${products || services || 'Not specified'}
            - Target Audience: ${targetAudience || 'General customers'}
            - Brand Personality: ${brandPersonality || 'Professional and trustworthy'}
            
            User Design Preferences:
            - Color Preference: ${colorPreference || 'No specific preference'}
            - Style: ${style || 'Modern and clean'}
            - Mood: ${mood || 'Professional'}
            
            Generate a complete design system including:
            1. Primary color (hex code) - main brand color
            2. Secondary color (hex code) - complementary color
            3. Accent color (hex code) - for highlights and CTAs
            4. Background color (hex code) - subtle background shade
            5. Text color (hex code) - optimal text contrast
            6. Heading font (Google Fonts name) - for titles and headers
            7. Body font (Google Fonts name) - for body text
            8. Button style (rounded, square, pill)
            9. Border radius (in pixels)
            10. Shadow style (subtle, medium, bold)
            11. Layout style (centered, full-width, boxed)
            12. Animation preference (minimal, moderate, dynamic)
            
            Consider:
            - Color psychology for the business type
            - Accessibility and contrast ratios
            - Modern design trends
            - Industry-specific conventions
            - Target audience preferences
            
            Format as JSON with keys: primaryColor, secondaryColor, accentColor, backgroundColor, textColor, headingFont, bodyFont, buttonStyle, borderRadius, shadowStyle, layoutStyle, animationStyle
            `;

            const response = await openai.chat.completions.create({
                model: "gemini-2.0-flash",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an expert UI/UX designer and color theorist. You understand design psychology, accessibility principles, and modern web design trends. Always respond with valid JSON and ensure color combinations meet WCAG accessibility standards."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.6,
                max_tokens: 800
            });

            const content = response.choices[0].message.content;
            try {
                const parsedStyles = JSON.parse(content);
                
                // Validate required style fields
                const requiredStyleFields = ['primaryColor', 'secondaryColor', 'accentColor', 'headingFont', 'bodyFont'];
                const missingStyleFields = requiredStyleFields.filter(field => !parsedStyles[field]);
                
                if (missingStyleFields.length > 0) {
                    throw new AIServiceError(
                        `Style response missing required fields: ${missingStyleFields.join(', ')}`,
                        'incomplete_style_response'
                    );
                }
                
                // Ensure all fields have defaults
                const completeStyles = {
                    primaryColor: parsedStyles.primaryColor,
                    secondaryColor: parsedStyles.secondaryColor,
                    accentColor: parsedStyles.accentColor,
                    backgroundColor: parsedStyles.backgroundColor || '#ffffff',
                    textColor: parsedStyles.textColor || '#333333',
                    headingFont: parsedStyles.headingFont,
                    bodyFont: parsedStyles.bodyFont,
                    buttonStyle: parsedStyles.buttonStyle || 'rounded',
                    borderRadius: parsedStyles.borderRadius || '8',
                    shadowStyle: parsedStyles.shadowStyle || 'subtle',
                    layoutStyle: parsedStyles.layoutStyle || 'centered',
                    animationStyle: parsedStyles.animationStyle || 'minimal'
                };
                
                return completeStyles;
            } catch (parseError) {
                console.warn("Style response not in JSON format, using fallback");
                return getFallbackContent({ type: businessType }, 'enhanced_styles');
            }
        } catch (error) {
            handleApiError(error);
        }
    }, 2, 1500).catch(error => {
        logError(error, 'Enhanced Style Generation');
        return getFallbackContent({ type: businessType }, 'enhanced_styles');
    });
};

/**
 * Generate layout and structure suggestions based on business requirements
 * @param {Object} businessInfo - Business information
 * @param {Object} contentRequirements - Specific content and feature requirements
 * @returns {Promise<Object>} - Layout and structure recommendations
 */
export const generateLayoutSuggestions = async (businessInfo, contentRequirements = {}) => {
    return withRetry(async () => {
        try {
            const { type, products, services, targetAudience } = businessInfo;
            const { hasGallery, hasTestimonials, hasBooking, hasBlog, hasEcommerce } = contentRequirements;
            
            const prompt = `
            Suggest an optimal website layout and structure for a ${type} business.
            
            Business Details:
            - Type: ${type}
            - Products: ${products || 'Not specified'}
            - Services: ${services || 'Not specified'}
            - Target Audience: ${targetAudience || 'General customers'}
            
            Required Features:
            - Gallery: ${hasGallery ? 'Yes' : 'No'}
            - Testimonials: ${hasTestimonials ? 'Yes' : 'No'}
            - Booking System: ${hasBooking ? 'Yes' : 'No'}
            - Blog: ${hasBlog ? 'Yes' : 'No'}
            - E-commerce: ${hasEcommerce ? 'Yes' : 'No'}
            
            Suggest:
            1. Recommended page structure and navigation
            2. Homepage layout sections in order of priority
            3. Call-to-action placement strategy
            4. Content hierarchy recommendations
            5. Mobile-first considerations
            
            Format as JSON with keys: pageStructure, homepageLayout, ctaStrategy, contentHierarchy, mobileConsiderations
            `;

            const response = await openai.chat.completions.create({
                model: "gemini-2.0-flash",
                messages: [
                    { 
                        role: "system", 
                        content: "You are a UX architect specializing in small business websites. You understand conversion optimization, user journey mapping, and industry-specific layout patterns."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 1000
            });

            const content = response.choices[0].message.content;
            return JSON.parse(content);
        } catch (error) {
            handleApiError(error);
            return getFallbackContent(businessInfo, 'layout');
        }
    }, 2, 1500);
};

/**
 * Generate style suggestions for the website based on business type
 * @param {string} businessType - Type of business
 * @returns {Promise<Object>} - Styling suggestions including color palette, font pairings
 */
export const generateStyleSuggestions = async (businessType) => {
    return withRetry(async () => {
        try {
            const prompt = `
            Suggest a professional color palette and font pairing for a ${businessType} website.
            
            Include:
            1. Primary color (hex code)
            2. Secondary color (hex code)
            3. Accent color (hex code)
            4. Heading font (from Google Fonts)
            5. Body font (from Google Fonts)
            
            Format the response as a JSON object with these keys: primaryColor, secondaryColor, accentColor, headingFont, bodyFont
            `;

            const response = await openai.chat.completions.create({
                model: "gemini-2.0-flash",
                messages: [
                    { role: "system", content: "You are an expert web designer with knowledge of color theory and typography for different business types. Always respond with valid JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.6,
                max_tokens: 500
            });

            const content = response.choices[0].message.content;
            try {
                const parsedStyles = JSON.parse(content);
                
                // Validate color formats
                const colorFields = ['primaryColor', 'secondaryColor', 'accentColor'];
                for (const field of colorFields) {
                    if (parsedStyles[field] && !parsedStyles[field].match(/^#[0-9A-Fa-f]{6}$/)) {
                        throw new AIServiceError(
                            `Invalid color format for ${field}: ${parsedStyles[field]}`,
                            'invalid_color_format'
                        );
                    }
                }
                
                return parsedStyles;
            } catch (parseError) {
                // Fallback extraction
                return {
                    primaryColor: extractColor(content, "primary") || "#4A90E2",
                    secondaryColor: extractColor(content, "secondary") || "#50E3C2",
                    accentColor: extractColor(content, "accent") || "#F5A623",
                    headingFont: extractFont(content, "heading") || "Montserrat",
                    bodyFont: extractFont(content, "body") || "Open Sans"
                };
            }
        } catch (error) {
            handleApiError(error);
        }
    }, 2, 1500).catch(error => {
        logError(error, 'Style Generation');
        // Return fallback styling based on business type
        return getFallbackContent({ type: businessType }, 'styles');
    });
};

// Helper functions to extract content from AI response if not in JSON format
function extractSection(content, sectionName) {
    const regex = new RegExp(`${sectionName}[:\\s]+([\\s\\S]+?)(?=\\n\\n|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : '';
}

function extractColor(content, colorType) {
    const regex = new RegExp(`${colorType}\\s+color[:\\s]+([#A-Fa-f0-9]{6})`, 'i');
    const match = content.match(regex);
    return match ? match[1] : '#CCCCCC';
}

function extractFont(content, fontType) {
    const regex = new RegExp(`${fontType}\\s+font[:\\s]+([A-Za-z\\s]+)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : 'Arial';
}
