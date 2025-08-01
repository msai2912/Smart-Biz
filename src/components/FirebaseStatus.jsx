import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';

const FirebaseStatus = () => {
  const [status, setStatus] = useState({
    auth: 'checking...',
    firestore: 'checking...',
    config: 'checking...'
  });

  useEffect(() => {
    // Check Firebase Auth
    try {
      if (auth) {
        setStatus(prev => ({ ...prev, auth: '✅ Connected' }));
      } else {
        setStatus(prev => ({ ...prev, auth: '❌ Not initialized' }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, auth: `❌ Error: ${error.message}` }));
    }

    // Check Firestore
    try {
      if (db) {
        setStatus(prev => ({ ...prev, firestore: '✅ Connected' }));
      } else {
        setStatus(prev => ({ ...prev, firestore: '❌ Not initialized' }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, firestore: `❌ Error: ${error.message}` }));
    }

    // Check Config
    try {
      if (auth?.app?.options) {
        setStatus(prev => ({ ...prev, config: '✅ Configuration loaded' }));
      } else {
        setStatus(prev => ({ ...prev, config: '❌ Configuration missing' }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, config: `❌ Error: ${error.message}` }));
    }
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Firebase Status</h4>
      <div><strong>Auth:</strong> {status.auth}</div>
      <div><strong>Firestore:</strong> {status.firestore}</div>
      <div><strong>Config:</strong> {status.config}</div>
      <div style={{ marginTop: '8px', fontSize: '10px', color: '#666' }}>
        Project: tv25-1facd
      </div>
    </div>
  );
};

export default FirebaseStatus;
