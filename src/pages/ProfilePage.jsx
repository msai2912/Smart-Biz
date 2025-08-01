import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser, updateUserProfile, error } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    businessType: '',
    phone: '',
    website: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        businessName: currentUser.businessName || '',
        businessType: currentUser.businessType || '',
        phone: currentUser.phone || '',
        website: currentUser.website || '',
        address: currentUser.address || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess('');

    try {
      const success = await updateUserProfile(formData);
      if (success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current user data
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      businessName: currentUser.businessName || '',
      businessType: currentUser.businessType || '',
      phone: currentUser.phone || '',
      website: currentUser.website || '',
      address: currentUser.address || '',
      bio: currentUser.bio || ''
    });
    setIsEditing(false);
  };

  const businessTypes = [
    'Retail',
    'Food & Beverage',
    'Professional Services',
    'Health & Wellness',
    'Technology',
    'Education',
    'Hospitality',
    'Construction',
    'Manufacturing',
    'Other'
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-section">
            <img
              src={currentUser.profileImage}
              alt={currentUser.name}
              className="profile-avatar-large"
            />
            <div className="profile-title">
              <h1>{currentUser.name}</h1>
              <p className="profile-email">{currentUser.email}</p>
              {currentUser.businessName && (
                <p className="profile-business">{currentUser.businessName}</p>
              )}
            </div>
          </div>
          
          <div className="profile-actions">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                <span className="btn-icon">✏️</span>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={isLoading}
                >
                  <span className="btn-icon">💾</span>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">❌</span>
            {error}
          </div>
        )}

        <div className="profile-content">
          <form onSubmit={handleSave} className="profile-form">
            
            {/* Personal Information Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">👤</span>
                Personal Information
              </h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true} // Email should not be editable after registration
                    className="readonly-field"
                  />
                  <small className="field-note">Email cannot be changed</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="website">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">🏢</span>
                Business Information
              </h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessName">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="businessType">Business Type</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  >
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Business Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="123 Business St, City, State 12345"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Business Description</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Tell us about your business..."
                  rows="4"
                />
              </div>
            </div>

            {/* Account Statistics */}
            <div className="form-section">
              <h2 className="section-title">
                <span className="section-icon">📊</span>
                Account Information
              </h2>
              
              <div className="account-stats">
                <div className="stat-card">
                  <div className="stat-value">
                    {currentUser.createdAt ? 
                      new Date(currentUser.createdAt).toLocaleDateString() : 
                      'N/A'
                    }
                  </div>
                  <div className="stat-label">Member Since</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">
                    {localStorage.getItem('smartbiz_auth_method') === 'mock' ? 
                      'Demo Mode' : 
                      'Firebase'
                    }
                  </div>
                  <div className="stat-label">Account Type</div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-value">Active</div>
                  <div className="stat-label">Status</div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
