

export const generateWebsiteHTML = (businessInfo, content, template, styles) => {
  const defaultContent = {
    headline: businessInfo.name ? `Welcome to ${businessInfo.name}` : 'Welcome to Our Business',
    tagline: businessInfo.type ? `Your trusted ${businessInfo.type.toLowerCase()}` : 'Your trusted local business',
    about: businessInfo.description || 'About our business...',
    services: businessInfo.services || businessInfo.products || 'Our offerings',
    callToAction: 'Contact us today!'
  };

  const displayContent = {
    headline: content?.headline || defaultContent.headline,
    tagline: content?.tagline || defaultContent.tagline,
    about: content?.about || defaultContent.about,
    services: content?.services || defaultContent.services,
    callToAction: content?.callToAction || defaultContent.callToAction
  };

  const defaultStyles = {
    primaryColor: '#4A90E2',
    secondaryColor: '#50E3C2',
    accentColor: '#F5A623',
    headingFont: 'Montserrat',
    bodyFont: 'Open Sans'
  };

  const displayStyles = {
    primaryColor: styles?.primaryColor || defaultStyles.primaryColor,
    secondaryColor: styles?.secondaryColor || defaultStyles.secondaryColor,
    accentColor: styles?.accentColor || defaultStyles.accentColor,
    headingFont: styles?.headingFont || defaultStyles.headingFont,
    bodyFont: styles?.bodyFont || defaultStyles.bodyFont
  };

  // Generate CSS based on template
  const generateCSS = () => {
    const baseCSS = `
      @import url('https://fonts.googleapis.com/css2?family=${displayStyles.headingFont.replace(' ', '+')}:wght@300;400;600;700&family=${displayStyles.bodyFont.replace(' ', '+')}:wght@300;400;500;600&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: '${displayStyles.bodyFont}', sans-serif;
        line-height: 1.6;
        color: #333;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-family: '${displayStyles.headingFont}', sans-serif;
        font-weight: 600;
      }
      
      a {
        text-decoration: none;
        color: inherit;
      }
      
      .btn {
        display: inline-block;
        padding: 12px 30px;
        background-color: ${displayStyles.primaryColor};
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.3s ease;
      }
      
      .btn:hover {
        background-color: ${displayStyles.accentColor};
        transform: translateY(-2px);
      }
    `;

    switch (template) {
      case 'modern':
        return baseCSS + `
          header {
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
          }
          
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
          }
          
          .logo {
            width: 50px;
            height: 50px;
            background: ${displayStyles.primaryColor};
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
          }
          
          nav ul {
            display: flex;
            list-style: none;
            gap: 30px;
          }
          
          nav a {
            color: #333;
            font-weight: 500;
            transition: color 0.3s ease;
          }
          
          nav a:hover {
            color: ${displayStyles.primaryColor};
          }
          
          .hero {
            background: linear-gradient(135deg, ${displayStyles.primaryColor}, ${displayStyles.secondaryColor});
            color: white;
            text-align: center;
            padding: 150px 0 100px;
            margin-top: 80px;
          }
          
          .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 700;
          }
          
          .hero .tagline {
            font-size: 1.3rem;
            margin-bottom: 20px;
            opacity: 0.9;
          }
          
          .hero-description {
            font-size: 1.1rem;
            margin-bottom: 40px;
            opacity: 0.8;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .hero-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }
          
          .btn {
            display: inline-block;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s ease;
            text-align: center;
          }
          
          .btn.primary {
            background: ${displayStyles.accentColor};
            color: white;
          }
          
          .btn.primary:hover {
            background: ${displayStyles.accentColor}dd;
            transform: translateY(-2px);
          }
          
          .btn.secondary {
            background: transparent;
            color: white;
            border: 2px solid white;
          }
          
          .btn.secondary:hover {
            background: white;
            color: ${displayStyles.primaryColor};
          }
          
          .section {
            padding: 80px 0;
          }
          
          .section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: ${displayStyles.primaryColor};
          }
          
          .section-description {
            text-align: center;
            font-size: 1.1rem;
            color: #666;
            max-width: 800px;
            margin: 0 auto 50px;
          }
          
          /* About Section */
          .about-section {
            background: #f8f9fa;
          }
          
          .about-content {
            max-width: 1000px;
            margin: 0 auto;
          }
          
          .about-story, .about-mission {
            margin-bottom: 40px;
            text-align: center;
          }
          
          .about-story h3, .about-mission h3 {
            font-size: 1.5rem;
            color: ${displayStyles.primaryColor};
            margin-bottom: 15px;
          }
          
          .about-stats {
            display: flex;
            justify-content: center;
            gap: 60px;
            margin-top: 50px;
          }
          
          .stat {
            text-align: center;
          }
          
          .stat-number {
            display: block;
            font-size: 2.5rem;
            font-weight: 700;
            color: ${displayStyles.primaryColor};
          }
          
          .stat-label {
            font-size: 1rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          
          /* Services Section */
          .services-section {
            background: white;
          }
          
          .services-grid, .offerings-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
          }
          
          .service-item, .offering-item {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid #e9ecef;
            transition: transform 0.3s ease;
          }
          
          .service-item:hover, .offering-item:hover {
            transform: translateY(-5px);
          }
          
          .service-item h3, .offering-item h3 {
            color: ${displayStyles.primaryColor};
            margin-bottom: 15px;
            font-size: 1.3rem;
          }
          
          /* What We Offer Section */
          .offerings-section {
            background: #f8f9fa;
          }
          
          /* Who We Serve Section */
          .serve-section {
            background: white;
          }
          
          .industries-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin: 30px 0;
          }
          
          .industry-tag {
            background: ${displayStyles.primaryColor};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
          }
          
          .coverage-info {
            text-align: center;
            font-style: italic;
            color: #666;
            margin-top: 20px;
          }
          
          /* Testimonials Section */
          .testimonials-section {
            background: #f8f9fa;
          }
          
          .testimonials-stats {
            text-align: center;
            margin-bottom: 50px;
          }
          
          .rating {
            display: inline-block;
            background: white;
            padding: 20px 40px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .rating-number {
            font-size: 2.5rem;
            font-weight: 700;
            color: ${displayStyles.primaryColor};
            display: block;
          }
          
          .rating-stars {
            color: #ffc107;
            font-size: 1.5rem;
            display: block;
            margin: 5px 0;
          }
          
          .rating-text {
            color: #666;
            font-size: 0.9rem;
          }
          
          .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 40px;
          }
          
          .testimonial-item {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .testimonial-content {
            margin-bottom: 20px;
          }
          
          .testimonial-content p {
            font-style: italic;
            font-size: 1.1rem;
            line-height: 1.6;
          }
          
          .testimonial-author strong {
            color: ${displayStyles.primaryColor};
            font-size: 1.1rem;
          }
          
          .company {
            display: block;
            color: #666;
            font-size: 0.9rem;
            margin-top: 5px;
          }
          
          .testimonial-rating {
            color: #ffc107;
            margin-top: 10px;
          }
          
          /* Why Choose Us Section */
          .why-choose-section {
            background: white;
          }
          
          .differentiators-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
          }
          
          .differentiator-item {
            text-align: center;
            padding: 20px;
          }
          
          .differentiator-item h3 {
            color: ${displayStyles.primaryColor};
            margin-bottom: 15px;
            font-size: 1.2rem;
          }
          
          .guarantee {
            text-align: center;
            background: ${displayStyles.primaryColor}10;
            padding: 30px;
            border-radius: 10px;
            border-left: 4px solid ${displayStyles.primaryColor};
          }
          
          .guarantee-text {
            font-size: 1.1rem;
            font-weight: 600;
            color: ${displayStyles.primaryColor};
          }
          
          /* Contact Section */
          footer {
            background: #333;
            color: white;
            padding: 60px 0 30px;
          }
          
          .contact-section {
            text-align: center;
            margin-bottom: 40px;
          }
          
          .contact-section h2 {
            color: white;
            margin-bottom: 20px;
          }
          
          .contact-encouragement {
            font-size: 1.2rem;
            margin-bottom: 15px;
          }
          
          .contact-expectation {
            color: #ccc;
            margin-bottom: 30px;
          }
          
          .contact-info {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin: 30px 0;
            flex-wrap: wrap;
          }
          
          .contact-item {
            font-size: 1.1rem;
            margin: 5px 0;
          }
          
          .response-info {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #555;
          }
          
          .response-info p {
            color: #ccc;
            margin: 5px 0;
          }
          
          .footer-bottom {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid #555;
            color: #ccc;
          }
          }
          
          @media (max-width: 768px) {
            .hero h1 {
              font-size: 2.5rem;
            }
            
            .hero-description {
              font-size: 1rem;
            }
            
            .hero-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .btn {
              width: 250px;
            }
            
            nav ul {
              flex-direction: column;
              gap: 15px;
            }
            
            .header-content {
              flex-direction: column;
              gap: 20px;
            }
            
            .about-stats {
              flex-direction: column;
              gap: 30px;
            }
            
            .services-grid, .offerings-grid, .testimonials-grid, .differentiators-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }
            
            .contact-info {
              flex-direction: column;
              gap: 15px;
            }
            
            .industries-list {
              justify-content: center;
            }
            
            .section {
              padding: 50px 0;
            }
            
            .section h2 {
              font-size: 2rem;
            }
            
            .container {
              padding: 0 20px;
            }
          }
        `;
      
      case 'bold':
        return baseCSS + `
          header {
            background: ${displayStyles.primaryColor};
            color: white;
            padding: 20px 0;
          }
          
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .business-name {
            font-size: 2rem;
            font-weight: bold;
          }
          
          nav ul {
            display: flex;
            list-style: none;
            gap: 30px;
          }
          
          nav a {
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: color 0.3s ease;
          }
          
          nav a:hover {
            color: ${displayStyles.accentColor};
          }
          
          .hero {
            background: linear-gradient(45deg, ${displayStyles.primaryColor}, ${displayStyles.accentColor});
            color: white;
            text-align: center;
            padding: 120px 0;
          }
          
          .hero h1 {
            font-size: 4rem;
            margin-bottom: 20px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .hero .tagline {
            font-size: 1.5rem;
            margin-bottom: 40px;
            font-weight: 300;
          }
          
          .section {
            padding: 80px 0;
          }
          
          .section h2 {
            font-size: 3rem;
            margin-bottom: 50px;
            color: ${displayStyles.primaryColor};
            font-weight: 900;
            text-transform: uppercase;
            text-align: center;
          }
          
          .about-section {
            background: white;
          }
          
          .services-section {
            background: #f1f1f1;
          }
          
          .contact-section {
            background: ${displayStyles.primaryColor};
            color: white;
          }
          
          .contact-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            max-width: 1000px;
            margin: 0 auto;
          }
          
          .contact-form input,
          .contact-form textarea {
            width: 100%;
            padding: 15px;
            margin-bottom: 20px;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
          }
          
          footer {
            background: #222;
            color: white;
            text-align: center;
            padding: 30px 0;
          }
          
          @media (max-width: 768px) {
            .hero h1 {
              font-size: 2.5rem;
            }
            
            .contact-content {
              grid-template-columns: 1fr;
            }
          }
        `;
      
      case 'classic':
      default:
        return baseCSS + `
          header {
            background: white;
            border-bottom: 3px solid ${displayStyles.primaryColor};
            padding: 20px 0;
          }
          
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .business-name {
            font-size: 2.5rem;
            color: ${displayStyles.primaryColor};
            font-weight: 300;
          }
          
          nav ul {
            display: flex;
            list-style: none;
            gap: 40px;
          }
          
          nav a {
            color: #333;
            font-weight: 400;
            font-size: 1.1rem;
            transition: color 0.3s ease;
          }
          
          nav a:hover {
            color: ${displayStyles.primaryColor};
          }
          
          .hero {
            background: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), 
                        linear-gradient(135deg, ${displayStyles.primaryColor}20, ${displayStyles.secondaryColor}20);
            text-align: center;
            padding: 100px 0;
          }
          
          .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            color: ${displayStyles.primaryColor};
            font-weight: 300;
          }
          
          .hero .tagline {
            font-size: 1.2rem;
            margin-bottom: 30px;
            color: #666;
            font-style: italic;
          }
          
          .section {
            padding: 80px 0;
          }
          
          .section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 20px;
            color: ${displayStyles.primaryColor};
            font-weight: 300;
          }
          
          .divider {
            width: 100px;
            height: 2px;
            background: ${displayStyles.accentColor};
            margin: 0 auto 40px;
          }
          
          .about-section {
            background: #f9f9f9;
          }
          
          .services-section {
            background: white;
          }
          
          .section-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.1rem;
            line-height: 1.8;
          }
          
          footer {
            background: ${displayStyles.primaryColor};
            color: white;
            padding: 50px 0 30px;
          }
          
          .footer-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin-bottom: 30px;
          }
          
          .footer-content h3 {
            margin-bottom: 20px;
            font-weight: 400;
          }
          
          .copyright {
            text-align: center;
            border-top: 1px solid rgba(255,255,255,0.2);
            padding-top: 20px;
            opacity: 0.8;
          }
          
          @media (max-width: 768px) {
            .hero h1 {
              font-size: 2.2rem;
            }
            
            .footer-content {
              grid-template-columns: 1fr;
              text-align: center;
            }
          }
        `;
    }
  };

  // Generate HTML based on template
  const generateHTML = () => {
    switch (template) {
      case 'modern':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessInfo.name || 'Business Website'}</title>
    <meta name="description" content="${displayContent.additionalContent?.metaDescription || `${businessInfo.name} - ${businessInfo.description}`}">
    <style>${generateCSS()}</style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">${(businessInfo.name?.charAt(0) || 'B').toUpperCase()}</div>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#testimonials">Reviews</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="container">
            <h1>${displayContent.hero?.headline || displayContent.headline}</h1>
            <p class="tagline">${displayContent.hero?.tagline || displayContent.tagline}</p>
            <p class="hero-description">${displayContent.hero?.description || businessInfo.description}</p>
            <div class="hero-buttons">
                <a href="#contact" class="btn primary">${displayContent.hero?.primaryCTA || displayContent.callToAction}</a>
                <a href="#about" class="btn secondary">${displayContent.hero?.secondaryCTA || 'Learn More'}</a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="section about-section" id="about">
        <div class="container">
            <h2>${displayContent.about?.title || 'About Us'}</h2>
            <div class="about-content">
                <div class="about-story">
                    <h3>Our Story</h3>
                    <p>${displayContent.about?.story || displayContent.about}</p>
                </div>
                <div class="about-mission">
                    <h3>Our Mission</h3>
                    <p>${displayContent.about?.mission || `${businessInfo.name} is committed to providing exceptional service.`}</p>
                </div>
                <div class="about-stats">
                    <div class="stat">
                        <span class="stat-number">${displayContent.about?.yearsExperience || '10+'}</span>
                        <span class="stat-label">Years Experience</span>
                    </div>
                    <div class="stat">
                        <span class="stat-number">${displayContent.about?.teamSize || 'Professional'}</span>
                        <span class="stat-label">Team</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="section services-section" id="services">
        <div class="container">
            <h2>${displayContent.services?.title || (businessInfo.services ? 'Our Services' : 'Our Products')}</h2>
            <p class="section-description">${displayContent.services?.overview || displayContent.services}</p>
            
            ${displayContent.services?.serviceList && displayContent.services.serviceList.length > 0 ? `
            <div class="services-grid">
                ${displayContent.services.serviceList.map(service => `
                    <div class="service-item">
                        <h3>${service.name || service}</h3>
                        <p>${service.description || 'Professional service tailored to your needs.'}</p>
                    </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </section>

    <!-- What We Offer Section -->
    ${displayContent.whatWeOffer?.offerings && displayContent.whatWeOffer.offerings.length > 0 ? `
    <section class="section offerings-section">
        <div class="container">
            <h2>${displayContent.whatWeOffer.title || 'What We Offer'}</h2>
            <p class="section-description">${displayContent.whatWeOffer.valueStatement}</p>
            <div class="offerings-grid">
                ${displayContent.whatWeOffer.offerings.map(offering => `
                    <div class="offering-item">
                        <h3>${offering.title || offering.name || offering}</h3>
                        <p>${offering.description || 'Quality offering designed for your success.'}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Who We Serve Section -->
    ${displayContent.whoWeServe?.description || displayContent.whoWeServe?.industries?.length > 0 ? `
    <section class="section serve-section">
        <div class="container">
            <h2>${displayContent.whoWeServe.title || 'Who We Serve'}</h2>
            <p class="section-description">${displayContent.whoWeServe.description}</p>
            ${displayContent.whoWeServe.industries && displayContent.whoWeServe.industries.length > 0 ? `
            <div class="industries-list">
                ${displayContent.whoWeServe.industries.map(industry => `
                    <span class="industry-tag">${industry}</span>
                `).join('')}
            </div>
            ` : ''}
            <p class="coverage-info">Coverage: ${displayContent.whoWeServe.coverage}</p>
        </div>
    </section>
    ` : ''}

    <!-- Testimonials Section -->
    <section class="section testimonials-section" id="testimonials">
        <div class="container">
            <h2>${displayContent.testimonials?.title || 'What Our Clients Say'}</h2>
            <div class="testimonials-stats">
                <div class="rating">
                    <span class="rating-number">${displayContent.testimonials?.overallRating || '4.9'}</span>
                    <span class="rating-stars">★★★★★</span>
                    <span class="rating-text">Based on ${displayContent.testimonials?.totalReviews || '100+'} reviews</span>
                </div>
            </div>
            
            ${displayContent.testimonials?.reviews && displayContent.testimonials.reviews.length > 0 ? `
            <div class="testimonials-grid">
                ${displayContent.testimonials.reviews.slice(0, 3).map(review => `
                    <div class="testimonial-item">
                        <div class="testimonial-content">
                            <p>"${review.comment || review.review || review}"</p>
                        </div>
                        <div class="testimonial-author">
                            <strong>${review.name || review.author || 'Satisfied Customer'}</strong>
                            ${review.company ? `<span class="company">${review.company}</span>` : ''}
                            <div class="testimonial-rating">★★★★★</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : `
            <div class="testimonials-grid">
                <div class="testimonial-item">
                    <div class="testimonial-content">
                        <p>"Excellent service and professional results. Highly recommended!"</p>
                    </div>
                    <div class="testimonial-author">
                        <strong>Satisfied Customer</strong>
                        <div class="testimonial-rating">★★★★★</div>
                    </div>
                </div>
            </div>
            `}
        </div>
    </section>

    <!-- Why Choose Us Section -->
    ${displayContent.whyChooseUs?.differentiators && displayContent.whyChooseUs.differentiators.length > 0 ? `
    <section class="section why-choose-section">
        <div class="container">
            <h2>${displayContent.whyChooseUs.title || 'Why Choose Us'}</h2>
            <div class="differentiators-grid">
                ${displayContent.whyChooseUs.differentiators.map(diff => `
                    <div class="differentiator-item">
                        <h3>${diff.title || diff}</h3>
                        <p>${diff.description || 'We excel in delivering exceptional results.'}</p>
                    </div>
                `).join('')}
            </div>
            <div class="guarantee">
                <p class="guarantee-text">${displayContent.whyChooseUs.guarantees}</p>
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <footer id="contact">
        <div class="container">
            <div class="contact-section">
                <h2>${displayContent.contact?.title || 'Get In Touch'}</h2>
                <p class="contact-encouragement">${displayContent.contact?.encouragement || displayContent.callToAction}</p>
                <p class="contact-expectation">${displayContent.contact?.expectation || 'We\'ll respond promptly to discuss your needs.'}</p>
                
                <div class="contact-info">
                    ${businessInfo.address ? `<p class="contact-item">📍 ${businessInfo.address}</p>` : ''}
                    ${businessInfo.phone ? `<p class="contact-item">📞 ${businessInfo.phone}</p>` : ''}
                    ${businessInfo.email ? `<p class="contact-item">✉️ ${businessInfo.email}</p>` : ''}
                </div>
                
                <div class="response-info">
                    <p>Response time: ${displayContent.contact?.responseTime || 'Within 24 hours'}</p>
                    <p>${displayContent.contact?.consultationInfo || 'Free consultation available'}</p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>© 2025 ${businessInfo.name || 'Your Business'}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;

      case 'bold':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessInfo.name || 'Business Website'}</title>
    <style>${generateCSS()}</style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="business-name">${businessInfo.name || 'BUSINESS NAME'}</div>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero" id="home">
        <div class="container">
            <h1>${displayContent.headline}</h1>
            <p class="tagline">${displayContent.tagline}</p>
            <a href="#contact" class="btn">${displayContent.callToAction}</a>
        </div>
    </section>

    <section class="section about-section" id="about">
        <div class="container">
            <h2>About Us</h2>
            <div class="section-content">
                <p>${displayContent.about}</p>
            </div>
        </div>
    </section>

    <section class="section services-section" id="services">
        <div class="container">
            <h2>${businessInfo.services ? 'Our Services' : 'Our Products'}</h2>
            <div class="section-content">
                <p>${displayContent.services}</p>
            </div>
        </div>
    </section>

    <section class="section contact-section" id="contact">
        <div class="container">
            <h2>Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    ${businessInfo.address ? `<p><strong>Address:</strong> ${businessInfo.address}</p>` : ''}
                    ${businessInfo.phone ? `<p><strong>Phone:</strong> ${businessInfo.phone}</p>` : ''}
                    ${businessInfo.email ? `<p><strong>Email:</strong> ${businessInfo.email}</p>` : ''}
                </div>
                <div class="contact-form">
                    <input type="text" placeholder="Name" required>
                    <input type="email" placeholder="Email" required>
                    <textarea placeholder="Message" rows="5" required></textarea>
                    <button type="submit" class="btn">Send Message</button>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>© 2025 ${businessInfo.name || 'Your Business'}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

      case 'classic':
      default:
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessInfo.name || 'Business Website'}</title>
    <style>${generateCSS()}</style>
</head>
<body>
    <header>
        <div class="container">
            <div class="header-content">
                <div class="business-name">${businessInfo.name || 'Business Name'}</div>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#services">Services</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <section class="hero" id="home">
        <div class="container">
            <h1>${displayContent.headline}</h1>
            <p class="tagline">${displayContent.tagline}</p>
            <a href="#contact" class="btn">${displayContent.callToAction}</a>
        </div>
    </section>

    <section class="section about-section" id="about">
        <div class="container">
            <h2>About Us</h2>
            <div class="divider"></div>
            <div class="section-content">
                <p>${displayContent.about}</p>
            </div>
        </div>
    </section>

    <section class="section services-section" id="services">
        <div class="container">
            <h2>${businessInfo.services ? 'Our Services' : 'Our Products'}</h2>
            <div class="divider"></div>
            <div class="section-content">
                <p>${displayContent.services}</p>
            </div>
        </div>
    </section>

    <footer id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="contact-info">
                    <h3>Contact Us</h3>
                    ${businessInfo.address ? `<p>${businessInfo.address}</p>` : ''}
                    ${businessInfo.phone ? `<p>${businessInfo.phone}</p>` : ''}
                    ${businessInfo.email ? `<p>${businessInfo.email}</p>` : ''}
                </div>
                <div class="hours">
                    <h3>Hours</h3>
                    <p>Monday - Friday: 9am - 5pm</p>
                    <p>Saturday: 10am - 4pm</p>
                    <p>Sunday: Closed</p>
                </div>
            </div>
            <div class="copyright">
                <p>© 2025 ${businessInfo.name || 'Your Business'}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
    }
  };

  return generateHTML();
};

export const downloadWebsite = (businessInfo, content, template, styles, onSuccess = null, onError = null) => {
  try {
    const html = generateWebsiteHTML(businessInfo, content, template, styles);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const filename = `${(businessInfo.name || 'website').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    if (onSuccess) {
      onSuccess(`Website downloaded successfully as ${filename}`);
    }
  } catch (error) {
    console.error('Error downloading website:', error);
    if (onError) {
      onError('Failed to download website. Please try again.');
    }
  }
};

export const previewWebsite = (businessInfo, content, template, styles, onSuccess = null, onError = null) => {
  try {
    const html = generateWebsiteHTML(businessInfo, content, template, styles);
    const newWindow = window.open('', '_blank');
    
    if (!newWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }
    
    newWindow.document.write(html);
    newWindow.document.close();
    
    if (onSuccess) {
      onSuccess('Website preview opened in new tab');
    }
  } catch (error) {
    console.error('Error previewing website:', error);
    if (onError) {
      onError(error.message || 'Failed to open preview. Please check your popup settings.');
    }
  }
};
