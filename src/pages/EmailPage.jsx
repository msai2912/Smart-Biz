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
      

      <div className="email-page-content">
        <EmailSender />
      </div>
    </div>
  );
};

export default EmailPage;
