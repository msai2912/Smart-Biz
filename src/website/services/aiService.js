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
 * Generate website content based on business information
 * @param {Object} businessInfo - Information about the business
 * @returns {Promise<Object>} - Generated content for the website
 */
export const generateWebsiteContent = async (businessInfo) => {
    return withRetry(async () => {
        try {
            const { name, type, description, products, services } = businessInfo;
            
            // Create a detailed prompt for the AI
            const prompt = `
            Generate website content for a ${type} called "${name}".
            
            Business description: ${description}
            
            ${products ? `Products: ${products}` : ''}
            ${services ? `Services: ${services}` : ''}
            
            Generate the following content sections:
            1. A compelling headline for the homepage
            2. A short tagline (10 words or less)
            3. An "About Us" section (2-3 paragraphs)
            4. A "Services/Products" description
            5. A call-to-action statement
            
            Format the response as a JSON object with these keys: headline, tagline, about, services, callToAction
            `;

            const response = await openai.chat.completions.create({
                model: "gemini-2.0-flash",
                messages: [
                    { role: "system", content: "You are an expert website content creator for small businesses. Always respond with valid JSON." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            // Parse the response to get the generated content
            const content = response.choices[0].message.content;
            try {
                // Try to parse as JSON directly
                const parsedContent = JSON.parse(content);
                
                // Validate that all required fields are present
                const requiredFields = ['headline', 'tagline', 'about', 'services', 'callToAction'];
                const missingFields = requiredFields.filter(field => !parsedContent[field]);
                
                if (missingFields.length > 0) {
                    throw new AIServiceError(
                        `AI response missing required fields: ${missingFields.join(', ')}`,
                        'incomplete_response'
                    );
                }
                
                return parsedContent;
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
 * Generate styling suggestions for the website based on business type
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
