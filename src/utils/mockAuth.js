// Fallback authentication for development/testing
export const createMockUser = (name, email, businessName, businessType) => {
  const mockUser = {
    id: `mock_${Date.now()}`,
    email,
    name,
    businessName,
    businessType,
    phone: '',
    website: '',
    address: '',
    bio: '',
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
    createdAt: new Date().toISOString()
  };
  
  // Store in localStorage for persistence
  localStorage.setItem('smartbiz_user', JSON.stringify(mockUser));
  localStorage.setItem('smartbiz_auth_method', 'mock');
  
  return mockUser;
};

export const getMockUser = () => {
  const authMethod = localStorage.getItem('smartbiz_auth_method');
  if (authMethod === 'mock') {
    const stored = localStorage.getItem('smartbiz_user');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const clearMockUser = () => {
  localStorage.removeItem('smartbiz_user');
  localStorage.removeItem('smartbiz_auth_method');
};
