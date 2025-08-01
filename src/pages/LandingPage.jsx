import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <>
      <header>
        <div className="header-container container">
          <Link to="/" className="logo">
            <span className="logo-text">SmartBiz</span>
          </Link>
          <nav>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><Link to="/login" className="cta-button">Get Started</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-container container">
          <div className="hero-content">
            <h1>AI-Powered Digital Toolkit for Small Businesses</h1>
            <p>
              Our AI-powered toolkit helps small businesses create professional websites, 
              automate marketing, and engage customers - all without coding or hiring expensive experts.
            </p>
            <Link to="/register" className="cta-button">Start For Free</Link>
          </div>
          <div className="hero-image">
            <img src="/logo.png" alt="AI Website Builder" style={{ width: '300px', height: '300px' }}/>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="container">
          <div className="section-title">
            <h2>Powerful Features For Small Businesses</h2>
            <p>Everything you need to establish a professional online presence</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>AI Website Builder</h3>
              <p>Create a professional website in minutes by answering a few simple questions about your business.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Business Analytics</h3>
              <p>Track sales, customer engagement, and business performance with easy-to-understand insights.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Content Generation</h3>
              <p>Automatically create marketing materials, social media posts, and product descriptions.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Customer Support</h3>
              <p>Let our AI chatbot handle common customer questions while you focus on running your business.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Social Media Integration</h3>
              <p>Connect all your social profiles and manage them from a single dashboard.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📧</div>
              <h3>Email Marketing</h3>
              <p>Create and send professional email campaigns with AI-generated content.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-title">
            <h2>How SmartBiz Works</h2>
            <p>Building your online business presence has never been easier</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <h3>Answer Simple Questions</h3>
              <p>Tell us about your business type, products, and services through a simple questionnaire.</p>
            </div>
            
            <div className="step">
              <h3>Our AI Creates Your Website</h3>
              <p>Our artificial intelligence generates a complete, professional website tailored to your business.</p>
            </div>
            
            <div className="step">
              <h3>Customize If You Want</h3>
              <p>Make simple edits or let our AI handle adjustments based on your natural language requests.</p>
            </div>
            
            <div className="step">
              <h3>Publish and Grow</h3>
              <p>Launch your site and use our marketing tools to attract customers and grow your business.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Grow Your Business Online?</h2>
          <p>Join thousands of small businesses using SmartBiz to establish their digital presence without technical headaches or expensive consultants.</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary">Get Started Free</Link>
            <Link to="/login" className="cta-secondary">See Demo</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <h3>SmartBiz</h3>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Product</h3>
              <ul>
                <li><a href="/features">Features</a></li>
                <li><a href="/pricing">Pricing</a></li>
                <li><a href="/testimonials">Testimonials</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/api">API Documentation</a></li>
                <li><a href="/partners">Partners</a></li>
                <li><a href="/community">Community</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Legal</h3>
              <ul>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/cookies">Cookie Policy</a></li>
                <li><a href="/security">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 SmartBiz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
