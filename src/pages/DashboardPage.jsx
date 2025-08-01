import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Core features data - only the 3 you requested
  const features = [
    {
      id: 'website-builder',
      title: 'AI Website Builder',
      description: 'Create stunning, professional websites in minutes with our AI-powered builder.',
      longDescription: 'Transform your business ideas into beautiful, responsive websites. Our AI analyzes your business type and generates custom designs, content, and layouts tailored specifically for your industry.',
      icon: '🌐',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      link: '/dashboard/website-builder',
      stats: { created: '2.3K+', avgTime: '5 mins' }
    },
    {
      id: 'content-generation',
      title: 'Content Generator',
      description: 'Generate compelling marketing content, blog posts, and social media copy instantly.',
      longDescription: 'Leverage the power of AI to create engaging content for your business. From product descriptions to social media posts, our generator creates content that converts.',
      icon: '✨',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      link: '/dashboard/content-generator',
      stats: { generated: '15K+', saved: '80% time' }
    },
    {
      id: 'business-cards',
      title: 'Business Cards',
      description: 'Design professional business cards that make lasting first impressions.',
      longDescription: 'Create stunning business cards that reflect your brand identity. Choose from premium templates or let our AI design the perfect card for your business.',
      icon: '�',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      link: '/dashboard/business-cards',
      stats: { designs: '500+', printed: '1M+' }
    }
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <div className="welcome-section">
            <h1 className="hero-title">
              {getGreeting()}, <span className="user-name">{currentUser.name}</span>
            </h1>
            <p className="hero-subtitle">
              Ready to grow <span className="business-highlight">{currentUser.businessName}</span>? 
              Let's create something amazing together.
            </p>
          </div>
          
          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">3</div>
              <div className="stat-label">Powerful Tools</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{currentTime.toLocaleTimeString()}</div>
              <div className="stat-label">Current Time</div>
            </div>
          </div>
        </div>
        
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-element" style={{animationDelay: '0s'}}>🚀</div>
            <div className="floating-element" style={{animationDelay: '2s'}}>⭐</div>
            <div className="floating-element" style={{animationDelay: '4s'}}>💡</div>
            <div className="floating-element" style={{animationDelay: '6s'}}>🎯</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Your Digital Toolkit</h2>
          <p className="section-subtitle">Everything you need to digitize and grow your business</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Link 
              to={feature.link} 
              key={feature.id} 
              className="feature-card"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="card-background" style={{background: feature.gradient}}></div>
              
              <div className="card-content">
                <div className="card-header">
                  <div className="feature-icon" style={{background: feature.gradient}}>
                    {feature.icon}
                  </div>
                  <div className="feature-stats">
                    <div className="stat">
                      <span className="stat-value">{Object.values(feature.stats)[0]}</span>
                      <span className="stat-key">{Object.keys(feature.stats)[0]}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{Object.values(feature.stats)[1]}</span>
                      <span className="stat-key">{Object.keys(feature.stats)[1]}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <p className="feature-long-description">{feature.longDescription}</p>
                </div>
                
                <div className="card-footer">
                  <button className="feature-button">
                    <span>Get Started</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="card-glow"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <div className="actions-container">
          <div className="action-item">
            <div className="action-icon">📊</div>
            <div className="action-content">
              <h4>Track Progress</h4>
              <p>Monitor your digital transformation journey</p>
            </div>
          </div>
          
          <div className="action-item">
            <div className="action-icon">🎨</div>
            <div className="action-content">
              <h4>Design Assets</h4>
              <p>Create cohesive brand materials</p>
            </div>
          </div>
          
          <div className="action-item">
            <div className="action-icon">🌟</div>
            <div className="action-content">
              <h4>Grow Online</h4>
              <p>Expand your digital presence</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

