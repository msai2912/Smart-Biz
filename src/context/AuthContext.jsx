import { createContext, useState, useContext, useEffect } from 'react';

// Create auth context
const AuthContext = createContext();

// Default user data for static authentication
const defaultUsers = [
  {
    id: 1,
    email: 'demo@smartbiz.com',
    password: 'password123',
    name: 'Demo User',
    businessName: 'Demo Business',
    businessType: 'Retail',
    profileImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: 2,
    email: 'jane@example.com',
    password: 'password123',
    name: 'Jane Smith',
    businessName: 'Jane\'s Bakery',
    businessType: 'Food & Beverage',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg'
  }
];

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for user in localStorage (for persistence)
    const storedUser = localStorage.getItem('smartbiz_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (email, password) => {
    setError('');
    // Find user with matching credentials
    const user = defaultUsers.find(
      user => user.email === email && user.password === password
    );
    
    if (user) {
      // Remove password before storing
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('smartbiz_user', JSON.stringify(userWithoutPassword));
      return true;
    } else {
      setError('Invalid email or password');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('smartbiz_user');
  };

  // Register function (for demonstration, just adds to localStorage)
  const register = (name, email, password, businessName, businessType) => {
    // Check if email already exists
    if (defaultUsers.some(user => user.email === email)) {
      setError('Email already in use');
      return false;
    }

    // Create new user
    const newUser = {
      id: defaultUsers.length + 1,
      email,
      password,
      name,
      businessName,
      businessType,
      profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg' // Default profile image
    };

    // In a real app, you'd call an API here
    // For our static demo, we'll just set the current user
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('smartbiz_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    error
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
