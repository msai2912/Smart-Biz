import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import './ContentGeneratorPage.css';

const ContentGeneratorPage = () => {
  const { currentUser } = useAuth();
  const [contentType, setContentType] = useState('social-post');
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const contentTypes = [
    { id: 'social-post', name: 'Social Media Post' },
    { id: 'product-description', name: 'Product Description' },
    { id: 'marketing-email', name: 'Marketing Email' },
    { id: 'ad-copy', name: 'Advertisement Copy' },
    { id: 'blog-post', name: 'Blog Post' },
    { id: 'press-release', name: 'Press Release' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt for content generation');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would call an API with Gemini or OpenAI
      const sampleContent = generateSampleContent(contentType, prompt);
      setGeneratedContent(sampleContent);
      setIsGenerating(false);
    }, 1500);
  };

  const generateSampleContent = (type, prompt) => {
    // This is just placeholder content - in a real app would come from AI API
    const samples = {
      'social-post': `📣 EXCITING NEWS! ${prompt}\n\nAt ${currentUser.businessName}, we're thrilled to announce our latest offering that will revolutionize how you experience our products. Check it out at our website or visit us in-store today!\n\n#Innovation #SmallBusiness #CustomerFirst`,
      
      'product-description': `Introducing our premium ${prompt} - meticulously crafted to exceed your expectations. This standout offering from ${currentUser.businessName} combines exceptional quality with innovative design, ensuring you receive nothing but the best. Features include superior durability, attention to detail, and our signature commitment to excellence.`,
      
      'marketing-email': `Subject: Special Announcement: ${prompt}\n\nDear Valued Customer,\n\nWe hope this message finds you well. ${currentUser.businessName} is excited to share some fantastic news with you regarding ${prompt}.\n\nFor a limited time, we're offering an exclusive promotion that we believe will truly enhance your experience with our products/services.\n\nReply to this email or visit our website to learn more.\n\nWarm regards,\n${currentUser.name}\n${currentUser.businessName}`,
      
      'ad-copy': `${prompt.toUpperCase()} | LIMITED TIME OFFER\n\nDiscover what makes ${currentUser.businessName} different. Our commitment to quality and customer satisfaction means you'll always receive the best value. Act now - this special opportunity won't last long!`,
      
      'blog-post': `# ${prompt}: Why It Matters For Your Business\n\nIn today's competitive landscape, staying ahead of trends is crucial for business success. At ${currentUser.businessName}, we've been exploring how ${prompt} can transform your operations and customer experience.\n\n## The Impact of ${prompt}\n\nInnovation doesn't happen overnight. It requires careful planning, execution, and adaptation. When implementing ${prompt} in your business strategy, consider these key factors:\n\n1. Customer-centric approach\n2. Data-driven decision making\n3. Continuous improvement\n\nRead more on our website to discover how we can help you implement these strategies.`,
      
      'press-release': `FOR IMMEDIATE RELEASE\n\n${currentUser.businessName} Announces ${prompt}\n\n${new Date().toLocaleDateString()}\n\n${currentUser.businessName} today announced ${prompt}, marking a significant milestone in the company's journey. This development represents our ongoing commitment to innovation and excellence in serving our customers.\n\n"We're excited to share this news with our community," said ${currentUser.name}, founder of ${currentUser.businessName}. "This initiative reflects our dedication to providing outstanding value and service."\n\nFor more information, please contact: ${currentUser.email}`
    };
    
    return samples[type] || "Content could not be generated. Please try again with a different prompt.";
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    alert('Content copied to clipboard!');
  };

  return (
    <div className="content-generator-page">
      <header className="page-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h1>AI Content Generator</h1>
        <p>Create professional marketing content with AI</p>
      </header>
      
      <div className="content-generator-container">
        <div className="content-form-container">
          <form onSubmit={handleSubmit} className="content-form">
            <div className="form-group">
              <label htmlFor="contentType">Content Type</label>
              <select 
                id="contentType" 
                value={contentType} 
                onChange={(e) => setContentType(e.target.value)}
                className="content-type-select"
              >
                {contentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="prompt">Content Prompt</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe what you want to create, e.g., "A new summer sale on our handmade soaps"`}
                rows={4}
                className="content-prompt"
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="generate-button"
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </button>
          </form>
        </div>
        
        <div className="content-result-container">
          <h2>Generated Content</h2>
          
          {isGenerating ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>AI is crafting your content...</p>
            </div>
          ) : generatedContent ? (
            <>
              <div className="content-preview">
                <pre>{generatedContent}</pre>
              </div>
              
              <div className="content-actions">
                <button 
                  onClick={handleCopy} 
                  className="copy-button"
                >
                  Copy to Clipboard
                </button>
                <button 
                  onClick={() => setGeneratedContent('')} 
                  className="clear-button"
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Your generated content will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGeneratorPage;
