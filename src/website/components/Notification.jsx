import React, { useState, useEffect } from 'react';
import './Notification.css';

function Notification({ message, type = 'success', onClose, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Wait for fade out animation
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  return (
    <div className={`notification ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="notification-content">
        <span className="notification-icon">{getIcon()}</span>
        <span className="notification-message">{message}</span>
        <button className="notification-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
}

export function useNotification() {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success', duration = 4000) => {
    setNotification({ message, type, duration });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const NotificationComponent = notification ? (
    <Notification
      message={notification.message}
      type={notification.type}
      duration={notification.duration}
      onClose={hideNotification}
    />
  ) : null;

  return {
    showNotification,
    hideNotification,
    NotificationComponent
  };
}

export default Notification;
