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
            const prompt = `
            Generate a complete website structure and content for a ${type} business called "${name}".
            
            Business Information:
            - Description: ${description}
            - Products: ${products || 'Not specified'}
            - Services: ${services || 'Not specified'}
            - Target Audience: ${targetAudience || 'General customers'}
            - Business Goals: ${goals || 'Increase online presence'}
            
            User Preferences:
            - Content Tone: ${tone} (professional, friendly, modern, creative, etc.)
            - Design Style: ${style} (clean, bold, elegant, minimalist, etc.)
            - Template: ${selectedTemplate}
            - Color Preference: ${colorPreference || 'No specific preference'}
            - Content Focus: ${contentFocus || 'Balanced approach'}
            
            Generate the following optimized content:
            1. A compelling, conversion-focused headline
            2. A memorable tagline (8-12 words)
            3. An engaging "About Us" section (2-3 paragraphs that builds trust)
            4. Detailed "Services/Products" description with benefits
            5. A strong call-to-action statement
            6. SEO-optimized meta description
            7. Key features/benefits list (3-5 items)
            8. Customer value proposition
            9. Contact section content
            10. Additional page suggestions (if applicable)
            
            Consider the template style "${selectedTemplate}" and ensure content works well with that design approach.
            
            Format the response as a JSON object with these keys: 
            headline, tagline, about, services, callToAction, metaDescription, keyFeatures, valueProposition, contactMessage, additionalPages
            `;

            const response = await openai.chat.completions.create({
                model: "gemini-2.0-flash",
                messages: [
                    { 
                        role: "system", 
                        content: `You are an expert website content creator and UX designer specializing in small business websites. 
                        You understand modern web design principles, conversion optimization, and how to create compelling content that drives business results.
                        Always respond with valid JSON and ensure content is tailored to the specific business type and user preferences.
                        Consider SEO best practices and user experience in your content generation.`
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            });

            // Parse the response to get the generated content
            const content = response.choices[0].message.content;
            try {
                // Try to parse as JSON directly
                const parsedContent = JSON.parse(content);
                
                // Validate that all required fields are present
                const requiredFields = ['headline', 'tagline', 'about', 'services', 'callToAction'];
                const optionalFields = ['metaDescription', 'keyFeatures', 'valueProposition', 'contactMessage', 'additionalPages'];
                const missingFields = requiredFields.filter(field => !parsedContent[field]);
                
                if (missingFields.length > 0) {
                    throw new AIServiceError(
                        `AI response missing required fields: ${missingFields.join(', ')}`,
                        'incomplete_response'
                    );
                }
                
                // Ensure optional fields have defaults
                const completeContent = {
                    ...parsedContent,
                    metaDescription: parsedContent.metaDescription || `${businessInfo.name} - ${parsedContent.tagline}`,
                    keyFeatures: parsedContent.keyFeatures || [],
                    valueProposition: parsedContent.valueProposition || parsedContent.about?.split('.')[0] || 'Your trusted local business',
                    contactMessage: parsedContent.contactMessage || 'Get in touch with us today!',
                    additionalPages: parsedContent.additionalPages || []
                };
                
                return completeContent;
            } catch (parseError) {
                // If not in JSON format, extract it manually
                console.warn("AI response not in JSON format, extracting manually");
                
                const extractedContent = {
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
