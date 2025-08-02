// Chatbot Service for Gemini AI Integration
class ChatbotService {
  constructor() {
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? '/api' 
      : 'http://localhost:5000';
  }

  // Generate a comprehensive prompt for the Gemini model
  generateBusinessPrompt(businessInfo, userMessage, conversationHistory = []) {
    const businessPrompt = `
You are an AI customer service representative for ${businessInfo.name}. 

BUSINESS INFORMATION:
- Business Name: ${businessInfo.name}
- Business Type: ${businessInfo.type || 'Service Business'}
- Description: ${businessInfo.description}
- Location: ${businessInfo.address || 'Local area'}
- Phone: ${businessInfo.phone || 'Contact us for phone number'}
- Email: ${businessInfo.email || `info@${businessInfo.name.toLowerCase().replace(/\s+/g, '')}.com`}
- Business Hours: ${businessInfo.hours || 'Monday to Friday, 9 AM to 6 PM'}
- Services/Products: ${businessInfo.services || businessInfo.products || businessInfo.description}

CONVERSATION HISTORY:
${conversationHistory.map(msg => `${msg.isBot ? 'Assistant' : 'Customer'}: ${msg.text}`).join('\n')}

INSTRUCTIONS:
- You represent ${businessInfo.name} and should answer as their customer service representative
- Be helpful, professional, and friendly
- Provide accurate information about the business
- If you don't know specific details, politely direct them to contact the business directly
- Keep responses concise but informative
- Focus on helping customers with their inquiries about products, services, hours, location, pricing, etc.
- Always stay in character as a representative of this specific business
- Use the business information provided above to answer questions accurately

CUSTOMER MESSAGE: ${userMessage}

Please provide a helpful response as a customer service representative for ${businessInfo.name}:
`;

    return businessPrompt;
  }

  // Send message to Gemini AI via backend
  async sendMessage(message, businessInfo, conversationHistory = []) {
    try {
      const response = await fetch(`${this.baseURL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          businessInfo: businessInfo,
          conversationHistory: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        response: data.response,
        error: null
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      return {
        success: false,
        response: null,
        error: error.message
      };
    }
  }

  // Fallback responses for demo mode or when API is unavailable
  generateFallbackResponse(userInput, businessInfo) {
    const input = userInput.toLowerCase();
    
    // Business hours
    if (input.includes('hours') || input.includes('open') || input.includes('time') || input.includes('when')) {
      return `We're open ${businessInfo.hours || 'Monday to Friday, 9 AM to 6 PM'}. Feel free to visit us or contact us during these hours!`;
    }
    
    // Location/Address
    if (input.includes('location') || input.includes('address') || input.includes('where') || input.includes('directions')) {
      return `You can find us at ${businessInfo.address || 'our main location'}. We'd love to see you there!`;
    }
    
    // Contact information
    if (input.includes('contact') || input.includes('phone') || input.includes('email') || input.includes('call') || input.includes('reach')) {
      return `You can reach us at ${businessInfo.phone || '(555) 123-4567'} or email us at ${businessInfo.email || 'hello@' + businessInfo.name.toLowerCase().replace(/\s+/g, '') + '.com'}. We typically respond within 24 hours!`;
    }
    
    // Services/Products
    if (input.includes('service') || input.includes('offer') || input.includes('do') || input.includes('product') || input.includes('sell')) {
      return `At ${businessInfo.name}, we specialize in ${businessInfo.description}. Our team is dedicated to providing excellent service and meeting all your needs. Would you like to know more about any specific service?`;
    }
    
    // Pricing
    if (input.includes('price') || input.includes('cost') || input.includes('fee') || input.includes('charge') || input.includes('rate')) {
      return `We offer competitive pricing for all our services. For detailed pricing information, please contact us directly at ${businessInfo.phone || '(555) 123-4567'} and we'll provide you with a personalized quote based on your specific needs.`;
    }
    
    // Booking/Appointment
    if (input.includes('book') || input.includes('appointment') || input.includes('schedule') || input.includes('reservation') || input.includes('meeting')) {
      return `We'd love to schedule an appointment with you! Please call us at ${businessInfo.phone || '(555) 123-4567'} or email us to book your appointment. We'll work with your schedule to find the perfect time.`;
    }
    
    // Quality/Reviews
    if (input.includes('quality') || input.includes('review') || input.includes('good') || input.includes('experience') || input.includes('recommend')) {
      return `Thank you for your interest in ${businessInfo.name}! We pride ourselves on delivering high-quality service and ensuring customer satisfaction. Our experienced team is committed to exceeding your expectations.`;
    }
    
    // General greeting responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('good morning') || input.includes('good afternoon')) {
      return `Hello! Welcome to ${businessInfo.name}. I'm here to help answer any questions you might have about our services. What would you like to know?`;
    }
    
    // Thank you responses
    if (input.includes('thank') || input.includes('thanks') || input.includes('appreciate')) {
      return `You're very welcome! It's our pleasure to help. If you have any other questions about ${businessInfo.name}, feel free to ask anytime!`;
    }
    
    // Help requests
    if (input.includes('help') || input.includes('assist') || input.includes('support')) {
      return `I'm here to help! You can ask me about our services, business hours, location, pricing, or how to contact us. What specific information would you like to know about ${businessInfo.name}?`;
    }
    
    // Default response
    return `Thank you for your question about ${businessInfo.name}! We're a ${businessInfo.type || 'business'} that ${businessInfo.description}. For more specific information, I'd recommend contacting us directly at ${businessInfo.phone || '(555) 123-4567'} or visiting our location. Our team will be happy to provide detailed answers to all your questions!`;
  }

  // Validate business information completeness
  validateBusinessInfo(businessInfo) {
    const requiredFields = ['name', 'description'];
    const missingFields = requiredFields.filter(field => !businessInfo[field]);
    
    if (missingFields.length > 0) {
      console.warn('Missing required business information:', missingFields);
      return false;
    }
    
    return true;
  }

  // Format response for better readability
  formatResponse(response) {
    // Add line breaks for better readability
    let formattedResponse = response
      .replace(/\. ([A-Z])/g, '.\n\n$1') // Add line breaks after sentences
      .replace(/: /g, ':\n') // Add line breaks after colons
      .trim();

    // Ensure response isn't too long (limit to ~200 words)
    const words = formattedResponse.split(' ');
    if (words.length > 200) {
      formattedResponse = words.slice(0, 200).join(' ') + '...';
    }

    return formattedResponse;
  }
}

// Export singleton instance
export default new ChatbotService();
