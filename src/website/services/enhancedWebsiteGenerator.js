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
   * Generate a complete website from just a business description
   * AI will automatically determine template, style, content, and all other aspects
   * @param {string} businessDescription - Detailed business description
   * @returns {Promise<Object>} - Complete website data including content, styles, and HTML
   */
  static async generateFromDescription(businessDescription) {
    try {
      console.log('Starting AI website generation from description...');
      console.log('Business description:', businessDescription);

      // Step 1: AI analyzes the description and extracts business info
      const analyzedBusiness = await this.analyzeBusinessDescription(businessDescription);
      
      // Step 2: AI selects optimal template based on business type and description
      const selectedTemplate = await this.selectOptimalTemplate(analyzedBusiness);
      
      // Step 3: AI determines style preferences based on business analysis
      const aiStylePreferences = await this.generateStylePreferences(analyzedBusiness);
      
      // Step 4: Generate comprehensive content using AI
      const generatedContent = await generateWebsiteContent(
        analyzedBusiness, 
        aiStylePreferences, 
        selectedTemplate
      );

      // Step 5: Generate enhanced styling suggestions
      const generatedStyles = await generateEnhancedStyleSuggestions(
        analyzedBusiness.type,
        aiStylePreferences,
        analyzedBusiness
      );

      // Step 6: Create enhanced template data
      const enhancedTemplateData = {
        businessInfo: analyzedBusiness,
        content: generatedContent,
        styles: generatedStyles,
        template: selectedTemplate,
        userPreferences: aiStylePreferences,
        generatedAt: new Date().toISOString(),
        features: this.determineFeatures(analyzedBusiness)
      };

      // Step 7: Generate final HTML (optional, for export)
      const websiteHTML = await generateWebsiteHTML(enhancedTemplateData);

      console.log('✅ Website generation completed successfully');

      return {
        success: true,
        data: {
          ...enhancedTemplateData,
          html: websiteHTML,
          metadata: {
            generationType: 'ai-description',
            originalDescription: businessDescription,
            processingTime: Date.now(),
            version: '2.0'
          }
        }
      };

    } catch (error) {
      console.error('❌ Enhanced website generation failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate website',
        details: error
      };
    }
  }

  /**
   * Analyze business description and extract structured business information
   */
  static async analyzeBusinessDescription(description) {
    // AI-powered business analysis
    const businessTypes = {
      'restaurant': ['restaurant', 'cafe', 'food', 'dining', 'pizza', 'coffee', 'bar', 'eatery'],
      'retail': ['shop', 'store', 'boutique', 'retail', 'clothing', 'fashion', 'merchandise'],
      'salon': ['salon', 'spa', 'beauty', 'hair', 'nails', 'massage', 'wellness'],
      'professional': ['consulting', 'law', 'accounting', 'finance', 'legal', 'advisory', 'firm'],
      'fitness': ['gym', 'fitness', 'yoga', 'pilates', 'training', 'exercise', 'health'],
      'healthcare': ['medical', 'dental', 'therapy', 'clinic', 'health', 'doctor'],
      'real-estate': ['real estate', 'property', 'homes', 'realty', 'agent'],
      'education': ['school', 'education', 'training', 'tutoring', 'learning'],
      'automotive': ['auto', 'car', 'vehicle', 'repair', 'mechanic'],
      'technology': ['tech', 'software', 'web', 'IT', 'digital', 'computer']
    };

    let detectedType = 'professional'; // default
    const lowerDesc = description.toLowerCase();
    
    for (const [type, keywords] of Object.entries(businessTypes)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        detectedType = type;
        break;
      }
    }

    // Extract business name (simple approach - first proper noun or business-like term)
    const nameMatch = description.match(/^([A-Z][a-zA-Z\s&]+)(?=\s+is|\s+are|,|\.|specializes|provides|offers)/);
    const businessName = nameMatch ? nameMatch[1].trim() : 'Your Business';

    return {
      name: businessName,
      type: detectedType,
      description: description,
      industry: detectedType,
      targetAudience: this.extractTargetAudience(description),
      location: this.extractLocation(description),
      services: this.extractServices(description),
      specialties: this.extractSpecialties(description)
    };
  }

  /**
   * Select optimal template based on business analysis
   */
  static async selectOptimalTemplate(businessInfo) {
    const templateMapping = {
      'restaurant': 'restaurant',
      'retail': 'modern',
      'salon': 'elegant',
      'professional': 'corporate',
      'fitness': 'dynamic',
      'healthcare': 'clean',
      'real-estate': 'professional',
      'education': 'friendly',
      'automotive': 'bold',
      'technology': 'modern'
    };

    return templateMapping[businessInfo.type] || 'modern';
  }

  /**
   * Generate AI-optimized style preferences
   */
  static async generateStylePreferences(businessInfo) {
    const styleMapping = {
      'restaurant': { style: 'warm', tone: 'friendly', mood: 'inviting' },
      'retail': { style: 'modern', tone: 'trendy', mood: 'energetic' },
      'salon': { style: 'elegant', tone: 'sophisticated', mood: 'luxury' },
      'professional': { style: 'corporate', tone: 'professional', mood: 'trustworthy' },
      'fitness': { style: 'dynamic', tone: 'motivational', mood: 'energetic' },
      'healthcare': { style: 'clean', tone: 'caring', mood: 'trustworthy' },
      'real-estate': { style: 'professional', tone: 'trustworthy', mood: 'reliable' },
      'education': { style: 'friendly', tone: 'approachable', mood: 'supportive' },
      'automotive': { style: 'bold', tone: 'confident', mood: 'reliable' },
      'technology': { style: 'modern', tone: 'innovative', mood: 'cutting-edge' }
    };

    return styleMapping[businessInfo.type] || { style: 'modern', tone: 'professional', mood: 'trustworthy' };
  }

  /**
   * Determine required features based on business type
   */
  static determineFeatures(businessInfo) {
    const featureMapping = {
      'restaurant': ['gallery', 'contact', 'menu', 'location'],
      'retail': ['gallery', 'products', 'contact', 'ecommerce'],
      'salon': ['booking', 'services', 'gallery', 'testimonials'],
      'professional': ['services', 'about', 'contact', 'testimonials'],
      'fitness': ['classes', 'booking', 'gallery', 'contact'],
      'healthcare': ['services', 'booking', 'contact', 'about'],
      'real-estate': ['listings', 'gallery', 'contact', 'about'],
      'education': ['courses', 'about', 'contact', 'testimonials'],
      'automotive': ['services', 'gallery', 'contact', 'about'],
      'technology': ['services', 'portfolio', 'contact', 'about']
    };

    return featureMapping[businessInfo.type] || ['about', 'services', 'contact'];
  }

  // Helper methods for extracting information from description
  static extractTargetAudience(description) {
    const audienceKeywords = {
      'professionals': ['professional', 'executive', 'business', 'corporate'],
      'families': ['family', 'families', 'children', 'kids'],
      'young adults': ['young', 'college', 'student', 'millennial'],
      'seniors': ['senior', 'elderly', 'mature', 'retirement'],
      'health-conscious': ['health', 'wellness', 'fitness', 'organic']
    };

    const lowerDesc = description.toLowerCase();
    for (const [audience, keywords] of Object.entries(audienceKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return audience;
      }
    }
    return 'general public';
  }

  static extractLocation(description) {
    const locationMatch = description.match(/(?:in|located in|based in)\s+([A-Z][a-zA-Z\s,]+?)(?:\.|,|\s+and|\s+with|\s+we)/i);
    return locationMatch ? locationMatch[1].trim() : null;
  }

  static extractServices(description) {
    const serviceKeywords = ['offers', 'provides', 'specializes in', 'services include'];
    for (const keyword of serviceKeywords) {
      const match = description.match(new RegExp(`${keyword}\\s+([^.]+)`, 'i'));
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  }

  static extractSpecialties(description) {
    const specialtyKeywords = ['specializes', 'expert', 'focus', 'known for'];
    for (const keyword of specialtyKeywords) {
      const match = description.match(new RegExp(`${keyword}\\s+(?:in\\s+)?([^.]+)`, 'i'));
      if (match) {
        return match[1].trim();
      }
    }
    return null;
  }
  
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
