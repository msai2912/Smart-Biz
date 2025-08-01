import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import './BusinessCardPage.css';

const BusinessCardPage = () => {
  const { currentUser } = useAuth();
  const [cardData, setCardData] = useState({
    name: currentUser?.name || '',
    jobTitle: 'Founder & CEO',
    businessName: currentUser?.businessName || '',
    email: currentUser?.email || '',
    phone: '+1 (555) 123-4567',
    website: 'www.yourbusiness.com',
    address: '123 Business St, City, State',
    logo: null,
    template: 'modern',
    primaryColor: '#4A90E2',
    secondaryColor: '#50E3C2'
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const templates = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'minimal', name: 'Minimal' },
    { id: 'bold', name: 'Bold' },
    { id: 'creative', name: 'Creative' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardData(prev => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneratePreview = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsGenerating(false);
      setPreviewUrl('generated'); // This would normally be a URL to the generated image
    }, 1500);
  };

  const renderBusinessCard = () => {
    // In a real app, this would be rendered by the backend or a canvas library
    const templateStyles = {
      modern: {
        container: {
          background: 'linear-gradient(135deg, white 50%, ' + cardData.primaryColor + ' 50%)',
          color: '#333',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          width: '350px',
          height: '200px',
          position: 'relative',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden'
        },
        logo: {
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: cardData.secondaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px'
        },
        name: {
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '4px'
        },
        jobTitle: {
          fontSize: '14px',
          color: cardData.primaryColor,
          marginBottom: '15px',
          fontWeight: '500'
        },
        businessName: {
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '15px'
        },
        contact: {
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          fontSize: '12px'
        },
        line: {
          position: 'absolute',
          bottom: '30px',
          left: '30px',
          width: '40px',
          height: '3px',
          background: cardData.secondaryColor
        }
      },
      classic: {
        container: {
          background: 'white',
          color: '#333',
          padding: '30px',
          border: '1px solid #ddd',
          width: '350px',
          height: '200px',
          position: 'relative',
          fontFamily: 'Georgia, serif',
          textAlign: 'center'
        },
        logo: {
          width: '80px',
          height: '80px',
          margin: '0 auto 15px',
          borderRadius: '50%',
          background: cardData.primaryColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px'
        },
        name: {
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '4px'
        },
        jobTitle: {
          fontSize: '14px',
          color: cardData.primaryColor,
          marginBottom: '15px',
          fontStyle: 'italic'
        },
        businessName: {
          fontSize: '16px',
          fontWeight: '600',
          marginBottom: '15px'
        },
        contact: {
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          fontSize: '12px',
          alignItems: 'center'
        },
        line: null
      }
    };
    
    const style = templateStyles[cardData.template] || templateStyles.modern;
    
    return (
      <div style={style.container} className="business-card-preview">
        {style.logo && (
          <div style={style.logo}>
            {cardData.logo ? (
              <img src={cardData.logo} alt="Logo" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
            ) : (
              cardData.businessName.charAt(0)
            )}
          </div>
        )}
        <div>
          <div style={style.name}>{cardData.name}</div>
          <div style={style.jobTitle}>{cardData.jobTitle}</div>
          <div style={style.businessName}>{cardData.businessName}</div>
          <div style={style.contact}>
            <div>{cardData.email}</div>
            <div>{cardData.phone}</div>
            <div>{cardData.website}</div>
            <div>{cardData.address}</div>
          </div>
          {style.line && <div style={style.line}></div>}
        </div>
      </div>
    );
  };

  return (
    <div className="business-card-page">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>Business Card Generator</h1>
        <p>Create professional business cards for your team</p>
      </header>
      
      <div className="business-card-container">
        <div className="card-form-container">
          <form onSubmit={handleGeneratePreview} className="card-form">
            <div className="form-group">
              <label htmlFor="template">Card Template</label>
              <select 
                id="template" 
                name="template"
                value={cardData.template} 
                onChange={handleChange}
              >
                {templates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={cardData.name} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="jobTitle">Job Title</label>
                <input 
                  type="text" 
                  id="jobTitle" 
                  name="jobTitle"
                  value={cardData.jobTitle} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="businessName">Business Name</label>
              <input 
                type="text" 
                id="businessName" 
                name="businessName"
                value={cardData.businessName} 
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={cardData.email} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                  type="text" 
                  id="phone" 
                  name="phone"
                  value={cardData.phone} 
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input 
                  type="text" 
                  id="website" 
                  name="website"
                  value={cardData.website} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address"
                  value={cardData.address} 
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="primaryColor">Primary Color</label>
                <input 
                  type="color" 
                  id="primaryColor" 
                  name="primaryColor"
                  value={cardData.primaryColor} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="secondaryColor">Secondary Color</label>
                <input 
                  type="color" 
                  id="secondaryColor" 
                  name="secondaryColor"
                  value={cardData.secondaryColor} 
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="logo">Logo (Optional)</label>
              <input 
                type="file" 
                id="logo" 
                name="logo"
                onChange={handleLogoChange}
                accept="image/*"
              />
            </div>
            
            <button 
              type="submit" 
              className="generate-button"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Update Preview'}
            </button>
          </form>
        </div>
        
        <div className="card-preview-container">
          <h2>Business Card Preview</h2>
          
          <div className="preview-content">
            {isGenerating ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Generating your business card...</p>
              </div>
            ) : (
              renderBusinessCard()
            )}
          </div>
          
          <div className="preview-actions">
            <button className="download-button">
              Download PDF
            </button>
            <button className="print-button">
              Print Cards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardPage;
