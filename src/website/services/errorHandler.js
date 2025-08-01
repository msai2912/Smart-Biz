// Enhanced error handling and retry logic for AI services
export class AIServiceError extends Error {
  constructor(message, type = 'general', originalError = null) {
    super(message);
    this.name = 'AIServiceError';
    this.type = type;
    this.originalError = originalError;
  }
}

export const withRetry = async (operation, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw new AIServiceError(
          `Operation failed after ${maxRetries} attempts: ${error.message}`,
          'retry_exhausted',
          error
        );
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

export const validateApiKey = (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new AIServiceError(
      'API key is missing. Please check your environment configuration.',
      'missing_api_key'
    );
  }
  
  if (apiKey.length < 20) {
    throw new AIServiceError(
      'API key appears to be invalid. Please check your configuration.',
      'invalid_api_key'
    );
  }
};

export const handleApiError = (error) => {
  if (error.response) {
    // API returned an error response
    const status = error.response.status;
    const message = error.response.data?.error?.message || error.response.statusText;
    
    switch (status) {
      case 401:
        throw new AIServiceError(
          'Authentication failed. Please check your API key.',
          'authentication_error',
          error
        );
      case 403:
        throw new AIServiceError(
          'Access forbidden. Your API key may not have the required permissions.',
          'permission_error',
          error
        );
      case 429:
        throw new AIServiceError(
          'Rate limit exceeded. Please try again in a few moments.',
          'rate_limit_error',
          error
        );
      case 500:
      case 502:
      case 503:
        throw new AIServiceError(
          'AI service is temporarily unavailable. Please try again later.',
          'service_unavailable',
          error
        );
      default:
        throw new AIServiceError(
          `API error (${status}): ${message}`,
          'api_error',
          error
        );
    }
  } else if (error.request) {
    // Request was made but no response received
    throw new AIServiceError(
      'Unable to connect to AI service. Please check your internet connection.',
      'network_error',
      error
    );
  } else {
    // Something else happened
    throw new AIServiceError(
      `Unexpected error: ${error.message}`,
      'unexpected_error',
      error
    );
  }
};

export const logError = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    context,
    error: {
      name: error.name,
      message: error.message,
      type: error.type || 'unknown',
      stack: error.stack
    }
  };
  
  console.error('AI Service Error:', logEntry);
  
  // In a production environment, you might want to send this to a logging service
  // Example: sendToLoggingService(logEntry);
};

export const getFallbackContent = (businessInfo, type = 'content') => {
  if (type === 'content') {
    return {
      headline: `Welcome to ${businessInfo.name || 'Our Business'}`,
      tagline: `Your trusted ${(businessInfo.type || 'local business').toLowerCase()}`,
      about: businessInfo.description || `${businessInfo.name || 'Our business'} is dedicated to providing excellent service to our customers. We pride ourselves on quality and customer satisfaction.`,
      services: businessInfo.services || businessInfo.products || 'We offer a wide range of services tailored to meet your needs.',
      callToAction: 'Contact us today to learn more!'
    };
  }
  
  if (type === 'styles') {
    // Business-type specific fallback styles
    const stylesByType = {
      'Restaurant': {
        primaryColor: '#D32F2F',
        secondaryColor: '#FF8F00',
        accentColor: '#FFC107',
        headingFont: 'Playfair Display',
        bodyFont: 'Source Sans Pro'
      },
      'Retail Store': {
        primaryColor: '#7B1FA2',
        secondaryColor: '#E91E63',
        accentColor: '#FF9800',
        headingFont: 'Montserrat',
        bodyFont: 'Open Sans'
      },
      'Salon/Spa': {
        primaryColor: '#8E24AA',
        secondaryColor: '#F06292',
        accentColor: '#FFB74D',
        headingFont: 'Dancing Script',
        bodyFont: 'Lato'
      },
      'Professional Services': {
        primaryColor: '#1976D2',
        secondaryColor: '#424242',
        accentColor: '#FF9800',
        headingFont: 'Roboto Slab',
        bodyFont: 'Roboto'
      },
      'Fitness/Gym': {
        primaryColor: '#F44336',
        secondaryColor: '#FF5722',
        accentColor: '#4CAF50',
        headingFont: 'Oswald',
        bodyFont: 'Source Sans Pro'
      }
    };
    
    return stylesByType[businessInfo.type] || {
      primaryColor: '#4A90E2',
      secondaryColor: '#50E3C2',
      accentColor: '#F5A623',
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans'
    };
  }
  
  return null;
};
