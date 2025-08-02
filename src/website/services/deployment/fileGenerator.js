// File Generator for Website Deployment
// Creates proper file structure for static website hosting

/**
 * Generate a complete website file structure
 * @param {Object} businessInfo - Business information
 * @param {Object} content - Generated content
 * @param {string} template - Selected template
 * @param {Object} styles - Style configuration
 * @returns {Object} - File structure with content
 */
export const generateWebsiteFiles = (businessInfo, content, template, styles) => {
  const files = {};
  
  // Generate index.html
  files['index.html'] = generateIndexHTML(businessInfo, content, template, styles);
  
  // Generate CSS files
  files['css/main.css'] = generateMainCSS(template, styles);
  files['css/responsive.css'] = generateResponsiveCSS();
  
  // Generate JavaScript files
  files['js/main.js'] = generateMainJS(businessInfo);
  files['js/chatbot.js'] = generateChatbotJS(businessInfo);
  
  // Generate configuration files
  files['vercel.json'] = generateVercelConfig();
  files['package.json'] = generatePackageJSON(businessInfo);
  files['README.md'] = generateReadme(businessInfo);
  
  // Generate SEO files
  files['sitemap.xml'] = generateSitemap(businessInfo);
  files['robots.txt'] = generateRobotsTxt();
  
  // Generate favicon and meta files
  files['favicon.ico'] = null; // Placeholder for favicon
  files['manifest.json'] = generateWebManifest(businessInfo);
  
  return files;
};

/**
 * Generate the main index.html file
 */
const generateIndexHTML = (businessInfo, content, template, styles) => {
  const metaDescription = content.additionalContent?.metaDescription || 
    `${businessInfo.name} - ${businessInfo.description}`;
  
  const keywords = content.additionalContent?.keywords?.join(', ') || 
    `${businessInfo.type}, ${businessInfo.name}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessInfo.name} - ${content.hero?.tagline || businessInfo.type}</title>
    <meta name="description" content="${metaDescription}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="${businessInfo.name}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://${generateSlug(businessInfo.name)}.vercel.app/">
    <meta property="og:title" content="${businessInfo.name} - ${content.hero?.tagline}">
    <meta property="og:description" content="${metaDescription}">
    <meta property="og:image" content="/images/og-image.jpg">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://${generateSlug(businessInfo.name)}.vercel.app/">
    <meta property="twitter:title" content="${businessInfo.name} - ${content.hero?.tagline}">
    <meta property="twitter:description" content="${metaDescription}">
    <meta property="twitter:image" content="/images/og-image.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="manifest" href="/manifest.json">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=${styles.headingFont?.replace(' ', '+')}:wght@300;400;600;700&family=${styles.bodyFont?.replace(' ', '+')}:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/main.css">
    <link rel="stylesheet" href="/css/responsive.css">
    
    <!-- Schema.org structured data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "${businessInfo.name}",
      "description": "${businessInfo.description}",
      "url": "https://${generateSlug(businessInfo.name)}.vercel.app/",
      ${businessInfo.phone ? `"telephone": "${businessInfo.phone}",` : ''}
      ${businessInfo.email ? `"email": "${businessInfo.email}",` : ''}
      ${businessInfo.address ? `"address": {
        "@type": "PostalAddress",
        "streetAddress": "${businessInfo.address}"
      },` : ''}
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${content.testimonials?.overallRating || '4.9'}",
        "reviewCount": "${content.testimonials?.totalReviews?.replace('+', '') || '100'}"
      }
    }
    </script>
</head>
<body>
    <!-- Header -->
    <header id="header">
        <nav class="navbar">
            <div class="container">
                <div class="nav-brand">
                    <div class="logo">${businessInfo.name?.charAt(0) || 'B'}</div>
                    <span class="brand-name">${businessInfo.name}</span>
                </div>
                <div class="nav-menu" id="nav-menu">
                    <ul class="nav-list">
                        <li><a href="#home" class="nav-link">Home</a></li>
                        <li><a href="#about" class="nav-link">About</a></li>
                        <li><a href="#services" class="nav-link">Services</a></li>
                        ${content.testimonials?.reviews?.length > 0 ? '<li><a href="#testimonials" class="nav-link">Reviews</a></li>' : ''}
                        <li><a href="#contact" class="nav-link">Contact</a></li>
                    </ul>
                </div>
                <div class="nav-toggle" id="nav-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">${content.hero?.headline || `Welcome to ${businessInfo.name}`}</h1>
                <p class="hero-subtitle">${content.hero?.tagline || `Your trusted ${businessInfo.type}`}</p>
                <p class="hero-description">${content.hero?.description || businessInfo.description}</p>
                <div class="hero-buttons">
                    <a href="#contact" class="btn btn-primary">${content.hero?.primaryCTA || 'Get Started Today'}</a>
                    <a href="#about" class="btn btn-secondary">${content.hero?.secondaryCTA || 'Learn More'}</a>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section about-section">
        <div class="container">
            <h2 class="section-title">${content.about?.title || 'About Us'}</h2>
            <div class="about-content">
                <div class="about-text">
                    <div class="about-story">
                        <h3>Our Story</h3>
                        <p>${content.about?.story || businessInfo.description}</p>
                    </div>
                    <div class="about-mission">
                        <h3>Our Mission</h3>
                        <p>${content.about?.mission || 'We are committed to providing exceptional service.'}</p>
                    </div>
                </div>
                <div class="about-stats">
                    <div class="stat-item">
                        <span class="stat-number">${content.about?.yearsExperience || '10+'}</span>
                        <span class="stat-label">Years Experience</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${content.about?.teamSize || 'Expert'}</span>
                        <span class="stat-label">Team</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="section services-section">
        <div class="container">
            <h2 class="section-title">${content.services?.title || 'Our Services'}</h2>
            <p class="section-description">${content.services?.overview || 'We provide comprehensive services tailored to your needs.'}</p>
            
            ${content.services?.serviceList?.length > 0 ? `
            <div class="services-grid">
                ${content.services.serviceList.map(service => `
                    <div class="service-card">
                        <h3 class="service-title">${service.name || service}</h3>
                        <p class="service-description">${service.description || 'Professional service tailored to your needs.'}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </section>

    ${content.whatWeOffer?.offerings?.length > 0 ? `
    <!-- What We Offer Section -->
    <section class="section offerings-section">
        <div class="container">
            <h2 class="section-title">${content.whatWeOffer.title}</h2>
            <p class="section-description">${content.whatWeOffer.valueStatement}</p>
            <div class="offerings-grid">
                ${content.whatWeOffer.offerings.map(offering => `
                    <div class="offering-card">
                        <h3 class="offering-title">${offering.title || offering.name || offering}</h3>
                        <p class="offering-description">${offering.description || 'Quality offering designed for your success.'}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${content.testimonials?.reviews?.length > 0 ? `
    <!-- Testimonials Section -->
    <section id="testimonials" class="section testimonials-section">
        <div class="container">
            <h2 class="section-title">${content.testimonials.title}</h2>
            <div class="testimonials-header">
                <div class="rating-display">
                    <span class="rating-number">${content.testimonials.overallRating}</span>
                    <div class="rating-stars">★★★★★</div>
                    <span class="rating-text">Based on ${content.testimonials.totalReviews} reviews</span>
                </div>
            </div>
            <div class="testimonials-grid">
                ${content.testimonials.reviews.slice(0, 3).map(review => `
                    <div class="testimonial-card">
                        <div class="testimonial-content">
                            <p>"${review.comment || review.review || review}"</p>
                        </div>
                        <div class="testimonial-author">
                            <strong>${review.name || review.author || 'Satisfied Customer'}</strong>
                            ${review.company ? `<span class="author-company">${review.company}</span>` : ''}
                            <div class="testimonial-rating">★★★★★</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    ${content.whyChooseUs?.differentiators?.length > 0 ? `
    <!-- Why Choose Us Section -->
    <section class="section why-choose-section">
        <div class="container">
            <h2 class="section-title">${content.whyChooseUs.title}</h2>
            <div class="differentiators-grid">
                ${content.whyChooseUs.differentiators.map(diff => `
                    <div class="differentiator-card">
                        <h3 class="differentiator-title">${diff.title || diff}</h3>
                        <p class="differentiator-description">${diff.description || 'We excel in delivering exceptional results.'}</p>
                    </div>
                `).join('')}
            </div>
            ${content.whyChooseUs.guarantees ? `
            <div class="guarantee-section">
                <p class="guarantee-text">${content.whyChooseUs.guarantees}</p>
            </div>
            ` : ''}
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <footer id="contact" class="section contact-section">
        <div class="container">
            <h2 class="section-title">${content.contact?.title || 'Get In Touch'}</h2>
            <p class="contact-description">${content.contact?.encouragement || 'Ready to get started? Contact us today!'}</p>
            <p class="contact-expectation">${content.contact?.expectation || 'We\'ll respond promptly to discuss your needs.'}</p>
            
            <div class="contact-info">
                ${businessInfo.phone ? `<div class="contact-item">
                    <span class="contact-icon">📞</span>
                    <a href="tel:${businessInfo.phone}">${businessInfo.phone}</a>
                </div>` : ''}
                ${businessInfo.email ? `<div class="contact-item">
                    <span class="contact-icon">✉️</span>
                    <a href="mailto:${businessInfo.email}">${businessInfo.email}</a>
                </div>` : ''}
                ${businessInfo.address ? `<div class="contact-item">
                    <span class="contact-icon">📍</span>
                    <span>${businessInfo.address}</span>
                </div>` : ''}
            </div>
            
            <div class="response-info">
                <p>Response time: ${content.contact?.responseTime || 'Within 24 hours'}</p>
                <p>${content.contact?.consultationInfo || 'Free consultation available'}</p>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ${businessInfo.name}. All rights reserved.</p>
                <p>Website powered by AI</p>
            </div>
        </div>
    </footer>

    <!-- Chatbot -->
    <div id="chatbot-container"></div>

    <!-- Scripts -->
    <script src="/js/main.js"></script>
    <script src="/js/chatbot.js"></script>
</body>
</html>`;
};

/**
 * Generate a URL-safe slug from business name
 */
const generateSlug = (name) => {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 20);
};
