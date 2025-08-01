

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
            margin-bottom: 30px;
            opacity: 0.9;
          }
          
          .section {
            padding: 80px 0;
          }
          
          .section h2 {
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 50px;
            color: ${displayStyles.primaryColor};
          }
          
          .about-section {
            background: #f8f9fa;
          }
          
          .about-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.1rem;
          }
          
          .services-section {
            background: white;
          }
          
          .services-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            font-size: 1.1rem;
          }
          
          footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 50px 0;
          }
          
          .contact-info {
            margin-bottom: 20px;
          }
          
          .contact-info p {
            margin-bottom: 5px;
          }
          
          @media (max-width: 768px) {
            .hero h1 {
              font-size: 2.5rem;
            }
            
            nav ul {
              flex-direction: column;
              gap: 15px;
            }
            
            .header-content {
              flex-direction: column;
              gap: 20px;
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
            <div class="about-content">
                <p>${displayContent.about}</p>
            </div>
        </div>
    </section>

    <section class="section services-section" id="services">
        <div class="container">
            <h2>${businessInfo.services ? 'Our Services' : 'Our Products'}</h2>
            <div class="services-content">
                <p>${displayContent.services}</p>
            </div>
        </div>
    </section>

    <footer id="contact">
        <div class="container">
            <div class="contact-info">
                ${businessInfo.address ? `<p>${businessInfo.address}</p>` : ''}
                ${businessInfo.phone ? `<p>${businessInfo.phone}</p>` : ''}
                ${businessInfo.email ? `<p>${businessInfo.email}</p>` : ''}
            </div>
            <p>© 2025 ${businessInfo.name || 'Your Business'}. All rights reserved.</p>
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
