import { 
  generateWebsiteContent, 
  generateEnhancedStyleSuggestions, 
  generateLayoutSuggestions 
} from './aiService';
import { generateWebsiteHTML } from './websiteExporter';

/**
 * Enhanced Website Generation Service
 * Integrates AI content generation, styling, and layout suggestions with template rendering
 */
export class EnhancedWebsiteGenerator {
  
  /**
   * Generate a complete website based on comprehensive user input
   * @param {Object} businessInfo - Business information
   * @param {Object} userPreferences - User design and content preferences
   * @param {Object} contentRequirements - Feature and content requirements
   * @param {string} selectedTemplate - Selected template type
   * @returns {Promise<Object>} - Complete website data including content, styles, and HTML
   */
  static async generateCompleteWebsite(businessInfo, userPreferences, contentRequirements, selectedTemplate = 'modern') {
    try {
      console.log('Starting enhanced website generation...', {
        businessType: businessInfo.type,
        template: selectedTemplate,
        preferences: userPreferences
      });

      // Step 1: Generate comprehensive content using AI
      const generatedContent = await generateWebsiteContent(
        businessInfo, 
        userPreferences, 
        selectedTemplate
      );

      // Step 2: Generate enhanced styling suggestions
      const generatedStyles = await generateEnhancedStyleSuggestions(
        businessInfo.type,
        userPreferences,
        businessInfo
      );

      // Step 3: Generate layout suggestions (optional, for future use)
      const layoutSuggestions = await generateLayoutSuggestions(
        businessInfo,
        contentRequirements
      );

      // Step 4: Create enhanced template data
      const templateData = this.prepareTemplateData(
        businessInfo,
        generatedContent,
        generatedStyles,
        contentRequirements
      );

      // Step 5: Generate final HTML
      const websiteHTML = generateWebsiteHTML(
        templateData.businessInfo,
        templateData.content,
        selectedTemplate,
        templateData.styles
      );

      // Step 6: Return complete website package
      return {
        success: true,
        data: {
          businessInfo: templateData.businessInfo,
          content: templateData.content,
          styles: templateData.styles,
          template: selectedTemplate,
          html: websiteHTML,
          metadata: {
            generatedAt: new Date().toISOString(),
            aiGenerated: true,
            contentRequirements,
            layoutSuggestions
          }
        }
      };

    } catch (error) {
      console.error('Enhanced website generation failed:', error);
      
      // Fallback to basic generation
      return this.generateFallbackWebsite(businessInfo, selectedTemplate);
    }
  }

  /**
   * Prepare template data by combining AI-generated content with user input
   * @param {Object} businessInfo - Business information
   * @param {Object} generatedContent - AI-generated content
   * @param {Object} generatedStyles - AI-generated styles
   * @param {Object} contentRequirements - Content requirements
   * @returns {Object} - Prepared template data
   */
  static prepareTemplateData(businessInfo, generatedContent, generatedStyles, contentRequirements) {
    // Enhanced business info with generated content
    const enhancedBusinessInfo = {
      ...businessInfo,
      metaDescription: generatedContent.metaDescription,
      keyFeatures: generatedContent.keyFeatures,
      valueProposition: generatedContent.valueProposition
    };

    // Enhanced content structure
    const enhancedContent = {
      headline: generatedContent.headline,
      tagline: generatedContent.tagline,
      about: generatedContent.about,
      services: generatedContent.services,
      callToAction: generatedContent.callToAction,
      contactMessage: generatedContent.contactMessage || 'Get in touch with us today!',
      
      // Additional content sections based on requirements
      ...(contentRequirements.hasTestimonials && {
        testimonialsHeading: 'What Our Customers Say',
        sampleTestimonials: this.generateSampleTestimonials(businessInfo.type)
      }),
      
      ...(contentRequirements.hasGallery && {
        galleryHeading: businessInfo.type === 'Restaurant' ? 'Our Menu' : 
                       businessInfo.type === 'Photography' ? 'Portfolio' : 'Gallery',
        galleryDescription: 'Take a look at our work and what we offer'
      }),
      
      ...(contentRequirements.hasBlog && {
        blogHeading: 'Latest News & Updates',
        blogDescription: 'Stay updated with our latest news and insights'
      })
    };

    // Enhanced styles with fallbacks
    const enhancedStyles = {
      primaryColor: generatedStyles.primaryColor || '#667eea',
      secondaryColor: generatedStyles.secondaryColor || '#764ba2',
      accentColor: generatedStyles.accentColor || '#4ade80',
      backgroundColor: generatedStyles.backgroundColor || '#ffffff',
      textColor: generatedStyles.textColor || '#1f2937',
      headingFont: generatedStyles.headingFont || 'Montserrat',
      bodyFont: generatedStyles.bodyFont || 'Open Sans',
      
      // Advanced styling options
      buttonStyle: generatedStyles.buttonStyle || 'rounded',
      borderRadius: generatedStyles.borderRadius || '8',
      shadowStyle: generatedStyles.shadowStyle || 'subtle',
      layoutStyle: generatedStyles.layoutStyle || 'centered',
      animationStyle: generatedStyles.animationStyle || 'minimal'
    };

    return {
      businessInfo: enhancedBusinessInfo,
      content: enhancedContent,
      styles: enhancedStyles
    };
  }

  /**
   * Generate sample testimonials based on business type
   * @param {string} businessType - Type of business
   * @returns {Array} - Array of sample testimonials
   */
  static generateSampleTestimonials(businessType) {
    const testimonialTemplates = {
      'Restaurant': [
        { text: 'Amazing food and great service! Will definitely be back.', author: 'Sarah M.' },
        { text: 'Best dining experience in town. Highly recommend!', author: 'John D.' },
        { text: 'Fresh ingredients and creative dishes. Love this place!', author: 'Emily R.' }
      ],
      'Salon/Spa': [
        { text: 'Professional service and relaxing atmosphere. Perfect!', author: 'Lisa K.' },
        { text: 'My hair has never looked better. Thank you!', author: 'Maria S.' },
        { text: 'Exceptional spa treatments. I feel completely refreshed.', author: 'Anna T.' }
      ],
      'Professional Services': [
        { text: 'Expert advice and excellent customer service.', author: 'Michael B.' },
        { text: 'Professional, reliable, and trustworthy. Highly recommend.', author: 'Jennifer L.' },
        { text: 'They helped solve our problem quickly and efficiently.', author: 'David W.' }
      ],
      'default': [
        { text: 'Outstanding service and great results!', author: 'Happy Customer' },
        { text: 'Professional team that delivers on their promises.', author: 'Satisfied Client' },
        { text: 'Excellent experience from start to finish.', author: 'Valued Customer' }
      ]
    };

    return testimonialTemplates[businessType] || testimonialTemplates.default;
  }

  /**
   * Generate a fallback website when AI generation fails
   * @param {Object} businessInfo - Business information
   * @param {string} selectedTemplate - Selected template
   * @returns {Object} - Fallback website data
   */
  static generateFallbackWebsite(businessInfo, selectedTemplate) {
    console.log('Generating fallback website...');

    const fallbackContent = {
      headline: `Welcome to ${businessInfo.name}`,
      tagline: `Your trusted ${businessInfo.type?.toLowerCase() || 'local business'}`,
      about: businessInfo.description || 'We are committed to providing excellent service to our customers.',
      services: businessInfo.services || businessInfo.products || 'Contact us to learn about our offerings.',
      callToAction: 'Contact us today!'
    };

    const fallbackStyles = {
      primaryColor: '#667eea',
      secondaryColor: '#764ba2',
      accentColor: '#4ade80',
      headingFont: 'Montserrat',
      bodyFont: 'Open Sans'
    };

    const websiteHTML = generateWebsiteHTML(
      businessInfo,
      fallbackContent,
      selectedTemplate,
      fallbackStyles
    );

    return {
      success: true,
      data: {
        businessInfo,
        content: fallbackContent,
        styles: fallbackStyles,
        template: selectedTemplate,
        html: websiteHTML,
        metadata: {
          generatedAt: new Date().toISOString(),
          aiGenerated: false,
          fallback: true
        }
      }
    };
  }

  /**
   * Generate additional pages content (for future implementation)
   * @param {Object} businessInfo - Business information
   * @param {Array} requestedPages - List of requested additional pages
   * @returns {Promise<Object>} - Additional pages content
   */
  static async generateAdditionalPages(businessInfo, requestedPages = []) {
    // This can be implemented to generate specific pages like About, Services, etc.
    // For now, return empty object
    return {};
  }

  /**
   * Validate generated content and styles
   * @param {Object} content - Generated content
   * @param {Object} styles - Generated styles
   * @returns {Object} - Validation results
   */
  static validateGeneration(content, styles) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Check required content fields
    const requiredContentFields = ['headline', 'tagline', 'about', 'services', 'callToAction'];
    requiredContentFields.forEach(field => {
      if (!content[field]) {
        validation.errors.push(`Missing required content field: ${field}`);
        validation.isValid = false;
      }
    });

    // Check required style fields
    const requiredStyleFields = ['primaryColor', 'secondaryColor', 'headingFont', 'bodyFont'];
    requiredStyleFields.forEach(field => {
      if (!styles[field]) {
        validation.errors.push(`Missing required style field: ${field}`);
        validation.isValid = false;
      }
    });

    // Check color format (basic validation)
    const colorFields = ['primaryColor', 'secondaryColor', 'accentColor'];
    colorFields.forEach(field => {
      if (styles[field] && !styles[field].match(/^#[0-9A-Fa-f]{6}$/)) {
        validation.warnings.push(`Invalid color format for ${field}: ${styles[field]}`);
      }
    });

    return validation;
  }
}

// Export for use in components
export default EnhancedWebsiteGenerator;
