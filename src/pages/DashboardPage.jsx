import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Feature cards data
  const features = [
    {
      id: 'website-builder',
      title: 'AI Website Builder',
      description: 'Create a professional website tailored to your business in minutes.',
      icon: '🌐',
      color: '#4A90E2',
      link: '/dashboard/website-builder'
    },
    {
      id: 'content-generation',
      title: 'Content Generation',
      description: 'Generate marketing content, product descriptions, and social media posts.',
      icon: '✨',
      color: '#50E3C2',
      link: '/dashboard/content-generator'
    },
    {
      id: 'business-analytics',
      title: 'Business Analytics',
      description: 'Track and analyze your business performance with easy-to-understand metrics.',
      icon: '📊',
      color: '#F5A623',
      link: '/dashboard/analytics'
    },
    {
      id: 'social-media',
      title: 'Social Media Manager',
      description: 'Schedule and automate posts across all your social media channels.',
      icon: '📱',
      color: '#BD10E0',
      link: '/dashboard/social-media'
    },
    {
      id: 'customer-support',
      title: 'AI Customer Support',
      description: 'Set up an AI-powered chatbot to handle common customer inquiries.',
      icon: '🤖',
      color: '#9013FE',
      link: '/dashboard/customer-support'
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      description: 'Create and send professional email campaigns to your customers.',
      icon: '📧',
      color: '#F5A623',
      link: '/dashboard/email-marketing'
    }
  ];

  // Quick stats for dashboard
  const stats = [
    { label: 'Website Visitors', value: '145', change: '+12%' },
    { label: 'Social Engagement', value: '2.3K', change: '+5%' },
    { label: 'Customer Inquiries', value: '24', change: '-3%' },
    { label: 'Email Open Rate', value: '32%', change: '+2%' }
  ];

  // Recent activity data (would come from API in real app)
  const recentActivity = [
    { id: 1, type: 'website', message: 'Website received 25 new visitors today', time: '2 hours ago' },
    { id: 2, type: 'content', message: 'New blog post "10 Tips for Small Businesses" generated', time: '1 day ago' },
    { id: 3, type: 'social', message: 'Instagram post scheduled for tomorrow at 9 AM', time: '3 days ago' },
    { id: 4, type: 'customer', message: 'New customer inquiry about business hours', time: '4 days ago' }
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>SmartBiz</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        
        <div className="user-profile">
          <img src={currentUser.profileImage} alt={currentUser.name} className="profile-image" />
          <div className="user-info">
            <h3>{currentUser.name}</h3>
            <p>{currentUser.businessName}</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <Link to="/dashboard">
                <span className="nav-icon">📊</span>
                <span className="nav-text">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/website-builder">
                <span className="nav-icon">🌐</span>
                <span className="nav-text">Website Builder</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/content-generator">
                <span className="nav-icon">✨</span>
                <span className="nav-text">Content Generator</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/analytics">
                <span className="nav-icon">📈</span>
                <span className="nav-text">Analytics</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/social-media">
                <span className="nav-icon">📱</span>
                <span className="nav-text">Social Media</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboard/settings">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={logout} className="logout-button">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back, {currentUser.name}!</h1>
          <p>Here's what's happening with {currentUser.businessName} today</p>
        </header>

        {/* Stats overview */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
                <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="dashboard-section">
          <h2>Tools & Features</h2>
          <div className="features-grid">
            {features.map(feature => (
              <Link to={feature.link} className="feature-card" key={feature.id} style={{ borderTopColor: feature.color }}>
                <div className="feature-icon" style={{ backgroundColor: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent activity */}
        <section className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'website' && '🌐'}
                  {activity.type === 'content' && '✨'}
                  {activity.type === 'social' && '📱'}
                  {activity.type === 'customer' && '👤'}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
