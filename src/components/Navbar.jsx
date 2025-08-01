import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">SmartBiz</span>
        </Link>

        {/* Navigation Links */}
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {currentUser ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🏠</span>
                Dashboard
              </Link>
              <Link 
                to="/dashboard/website-builder" 
                className={`nav-link ${isActive('/dashboard/website-builder') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🌐</span>
                Website Builder
              </Link>
              <Link 
                to="/dashboard/content-generation" 
                className={`nav-link ${isActive('/dashboard/content-generation') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">🎨</span>
                Content Generator
              </Link>
              <Link 
                to="/dashboard/business-cards" 
                className={`nav-link ${isActive('/dashboard/business-cards') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="nav-icon">💼</span>
                Business Cards
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/" 
                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/login" 
                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${isActive('/register') ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* User Profile & Mobile Menu */}
        <div className="nav-actions">
          {currentUser && (
            <div className="user-profile">
              <img 
                src={currentUser.profileImage} 
                alt={currentUser.name} 
                className="profile-avatar"
              />
              <div className="user-dropdown">
                <div className="user-info">
                  <span className="user-name">{currentUser.name}</span>
                  <span className="user-business">{currentUser.businessName}</span>
                </div>
                <Link 
                  to="/dashboard/profile" 
                  className="profile-btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">👤</span>
                  Profile Settings
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  <span className="nav-icon">🚪</span>
                  Logout
                </button>
              </div>
            </div>
          )}
          
          <div className="mobile-menu-toggle" onClick={toggleMenu}>
            <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
