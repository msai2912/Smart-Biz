import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import EmailSender from '../components/email/EmailSender';
import './EmailPage.css';

const EmailPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="email-page">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <div className="header-content">
          <h1>Email Marketing</h1>
          <p>Communicate with your customers through professional email campaigns</p>
        </div>
      </header>

      <div className="email-page-content">
        <EmailSender />
      </div>
    </div>
  );
};

export default EmailPage;
