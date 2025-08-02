// CSS Generator for Website Templates
// Generates comprehensive CSS files for different templates

/**
 * Generate main CSS file with template-specific styles
 */
export const generateMainCSS = (template, styles) => {
  const baseCSS = generateBaseCSS(styles);
  
  switch (template) {
    case 'modern':
      return baseCSS + generateModernCSS(styles);
    case 'bold':
      return baseCSS + generateBoldCSS(styles);
    case 'classic':
      return baseCSS + generateClassicCSS(styles);
    default:
      return baseCSS + generateModernCSS(styles);
  }
};

/**
 * Generate base CSS styles
 */
const generateBaseCSS = (styles) => {
  return `
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: '${styles.bodyFont || 'Open Sans'}', sans-serif;
  line-height: 1.6;
  color: ${styles.textColor || '#333'};
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: '${styles.headingFont || 'Montserrat'}', sans-serif;
  font-weight: 600;
  line-height: 1.2;
}

h1 { font-size: 3rem; }
h2 { font-size: 2.5rem; }
h3 { font-size: 2rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

p {
  margin-bottom: 1rem;
  line-height: 1.6;
}

a {
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 15px 30px;
  border-radius: ${styles.borderRadius || '8'}px;
  font-weight: 600;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: ${styles.primaryColor || '#4A90E2'};
  color: white;
}

.btn-primary:hover {
  background: ${styles.primaryColor || '#4A90E2'}dd;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.btn-secondary {
  background: transparent;
  color: ${styles.primaryColor || '#4A90E2'};
  border: 2px solid ${styles.primaryColor || '#4A90E2'};
}

.btn-secondary:hover {
  background: ${styles.primaryColor || '#4A90E2'};
  color: white;
}

/* Sections */
.section {
  padding: 80px 0;
}

.section-title {
  text-align: center;
  margin-bottom: 20px;
  color: ${styles.primaryColor || '#4A90E2'};
}

.section-description {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto 50px;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 2px 20px rgba(0,0,0,0.1);
}

.navbar .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 50px;
  height: 50px;
  background: ${styles.primaryColor || '#4A90E2'};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: ${styles.primaryColor || '#4A90E2'};
}

.nav-list {
  display: flex;
  list-style: none;
  gap: 30px;
}

.nav-link {
  font-weight: 500;
  color: #333;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: ${styles.primaryColor || '#4A90E2'};
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: #333;
  transition: all 0.3s ease;
}

/* Grid Layouts */
.services-grid,
.offerings-grid,
.testimonials-grid,
.differentiators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

/* Cards */
.service-card,
.offering-card,
.testimonial-card,
.differentiator-card {
  background: white;
  padding: 30px;
  border-radius: ${styles.borderRadius || '8'}px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.service-card:hover,
.offering-card:hover,
.differentiator-card:hover {
  transform: translateY(-5px);
}

.service-title,
.offering-title,
.differentiator-title {
  color: ${styles.primaryColor || '#4A90E2'};
  margin-bottom: 15px;
  font-size: 1.3rem;
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 2rem; }

.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }
.mt-4 { margin-top: 2rem; }
`;
};

/**
 * Generate Modern template specific CSS
 */
const generateModernCSS = (styles) => {
  return `
/* Modern Template Styles */
.hero {
  background: linear-gradient(135deg, ${styles.primaryColor || '#4A90E2'}, ${styles.secondaryColor || '#764ba2'});
  color: white;
  text-align: center;
  padding: 150px 0 100px;
  margin-top: 80px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.1);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.8;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.about-section {
  background: #f8f9fa;
}

.about-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 50px;
  align-items: center;
}

.about-text h3 {
  color: ${styles.primaryColor || '#4A90E2'};
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.about-stats {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: ${styles.borderRadius || '8'}px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${styles.primaryColor || '#4A90E2'};
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.services-section {
  background: white;
}

.offerings-section {
  background: #f8f9fa;
}

.testimonials-section {
  background: white;
}

.testimonials-header {
  text-align: center;
  margin-bottom: 50px;
}

.rating-display {
  display: inline-block;
  background: white;
  padding: 20px 40px;
  border-radius: ${styles.borderRadius || '8'}px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.rating-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: ${styles.primaryColor || '#4A90E2'};
  display: block;
}

.rating-stars {
  color: #ffc107;
  font-size: 1.5rem;
  margin: 5px 0;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.testimonial-card {
  background: #f8f9fa;
  border-left: 4px solid ${styles.primaryColor || '#4A90E2'};
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
  color: ${styles.primaryColor || '#4A90E2'};
  font-size: 1.1rem;
}

.author-company {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-top: 5px;
}

.testimonial-rating {
  color: #ffc107;
  margin-top: 10px;
}

.why-choose-section {
  background: #f8f9fa;
}

.guarantee-section {
  text-align: center;
  background: ${styles.primaryColor || '#4A90E2'}10;
  padding: 30px;
  border-radius: ${styles.borderRadius || '8'}px;
  border-left: 4px solid ${styles.primaryColor || '#4A90E2'};
  margin-top: 40px;
}

.guarantee-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: ${styles.primaryColor || '#4A90E2'};
}

.contact-section {
  background: #333;
  color: white;
  text-align: center;
}

.contact-section .section-title {
  color: white;
  margin-bottom: 20px;
}

.contact-description {
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
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

.contact-icon {
  font-size: 1.2rem;
}

.contact-item a {
  color: ${styles.accentColor || '#f093fb'};
}

.contact-item a:hover {
  color: white;
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
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #555;
  color: #ccc;
}
`;
};

/**
 * Generate Bold template specific CSS
 */
const generateBoldCSS = (styles) => {
  return `
/* Bold Template Styles */
.navbar {
  background: ${styles.primaryColor || '#4A90E2'};
  color: white;
}

.navbar .nav-link {
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.navbar .nav-link:hover {
  color: ${styles.accentColor || '#f093fb'};
}

.hero {
  background: linear-gradient(45deg, ${styles.primaryColor || '#4A90E2'}, ${styles.secondaryColor || '#764ba2'});
  color: white;
  text-align: center;
  padding: 120px 0 80px;
  margin-top: 80px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 30px;
}

/* Bold styling for other sections */
.section-title {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.service-card,
.offering-card,
.differentiator-card {
  border: 3px solid ${styles.primaryColor || '#4A90E2'};
  border-radius: 0;
}

.btn {
  border-radius: 0;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}
`;
};

/**
 * Generate Classic template specific CSS
 */
const generateClassicCSS = (styles) => {
  return `
/* Classic Template Styles */
.hero {
  background: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), 
              linear-gradient(135deg, ${styles.primaryColor || '#4A90E2'}20, ${styles.secondaryColor || '#764ba2'}20);
  text-align: center;
  padding: 120px 0 80px;
  margin-top: 80px;
}

.hero-title {
  color: ${styles.primaryColor || '#4A90E2'};
  font-weight: 300;
  font-size: 3rem;
}

.hero-subtitle {
  color: #666;
  font-style: italic;
  margin-bottom: 30px;
}

/* Classic elegant styling */
.service-card,
.offering-card,
.differentiator-card {
  border: 1px solid #e9ecef;
  border-radius: ${styles.borderRadius || '8'}px;
}

.btn {
  border-radius: 50px;
}

.section-title {
  font-weight: 300;
}
`;
};
