// Responsive CSS Generator
// Generates mobile-first responsive styles

export const generateResponsiveCSS = () => {
  return `
/* Responsive Styles */

/* Large screens (desktops) */
@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
  
  .hero-title {
    font-size: 4rem;
  }
  
  .services-grid,
  .offerings-grid,
  .testimonials-grid,
  .differentiators-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Medium screens (tablets) */
@media (max-width: 991px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .section {
    padding: 60px 0;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .about-stats {
    flex-direction: row;
    justify-content: center;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 20px;
  }
}

/* Small screens (mobile landscape) */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  /* Navigation */
  .nav-menu {
    position: fixed;
    top: 80px;
    left: -100%;
    width: 100%;
    height: calc(100vh - 80px);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    transition: left 0.3s ease;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 50px;
  }
  
  .nav-menu.active {
    left: 0;
  }
  
  .nav-list {
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }
  
  .nav-link {
    font-size: 1.2rem;
    padding: 10px 20px;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .nav-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .nav-toggle.active span:nth-child(2) {
    opacity: 0;
  }
  
  .nav-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
  
  /* Hero section */
  .hero {
    padding: 100px 0 60px;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .btn {
    width: 250px;
    padding: 12px 25px;
  }
  
  /* Sections */
  .section {
    padding: 50px 0;
  }
  
  .section-title {
    font-size: 2rem;
    margin-bottom: 15px;
  }
  
  .section-description {
    font-size: 1rem;
    margin-bottom: 30px;
  }
  
  /* Grids */
  .services-grid,
  .offerings-grid,
  .testimonials-grid,
  .differentiators-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    margin-top: 30px;
  }
  
  /* Cards */
  .service-card,
  .offering-card,
  .testimonial-card,
  .differentiator-card {
    padding: 20px;
  }
  
  /* About section */
  .about-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .stat-item {
    padding: 15px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  /* Testimonials */
  .rating-display {
    padding: 15px 25px;
  }
  
  .rating-number {
    font-size: 2rem;
  }
  
  .rating-stars {
    font-size: 1.2rem;
  }
  
  /* Contact */
  .contact-item {
    justify-content: center;
  }
}

/* Extra small screens (mobile portrait) */
@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  .hero-title {
    font-size: 2rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .service-card,
  .offering-card,
  .testimonial-card,
  .differentiator-card {
    padding: 15px;
  }
  
  .btn {
    width: 200px;
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .logo {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .brand-name {
    font-size: 1.2rem;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  /* Optimizations for retina displays */
  .logo {
    background-size: contain;
  }
}

/* Print styles */
@media print {
  .navbar,
  .nav-toggle,
  .hero-buttons,
  .btn {
    display: none;
  }
  
  .hero {
    background: none;
    color: #333;
    padding: 20px 0;
  }
  
  .section {
    padding: 20px 0;
    page-break-inside: avoid;
  }
  
  .contact-section {
    background: none;
    color: #333;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .btn {
    border: 2px solid;
  }
  
  .service-card,
  .offering-card,
  .testimonial-card,
  .differentiator-card {
    border: 2px solid;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }
  
  .navbar {
    background: rgba(26, 26, 26, 0.95);
  }
  
  .service-card,
  .offering-card,
  .testimonial-card,
  .differentiator-card {
    background: #2a2a2a;
    color: #e0e0e0;
  }
  
  .about-section,
  .offerings-section,
  .why-choose-section {
    background: #2a2a2a;
  }
}
`;
};
