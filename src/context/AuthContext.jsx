import { createContext, useState, useContext, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { createMockUser, getMockUser, clearMockUser } from '../utils/mockAuth';

// Create auth context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for mock user first
    const mockUser = getMockUser();
    if (mockUser) {
      setCurrentUser(mockUser);
      setLoading(false);
      return;
    }

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              id: user.uid,
              email: user.email,
              name: userData.name || user.displayName,
              businessName: userData.businessName,
              businessType: userData.businessType,
              profileImage: userData.profileImage || user.photoURL
            });
          } else {
            // If no Firestore document, use basic user info
            setCurrentUser({
              id: user.uid,
              email: user.email,
              name: user.displayName || 'User',
              businessName: '',
              businessType: '',
              profileImage: user.photoURL
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser({
            id: user.uid,
            email: user.email,
            name: user.displayName || 'User',
            businessName: '',
            businessType: '',
            profileImage: user.photoURL
          });
        }
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      // If Firebase fails, check for mock user
      const mockUser = getMockUser();
      if (mockUser) {
        setCurrentUser(mockUser);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(getErrorMessage(error.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Check if using mock authentication
      if (getMockUser()) {
        clearMockUser();
        setCurrentUser(null);
        return;
      }
      
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout');
    }
  };

  // Register function
  const register = async (name, email, password, businessName, businessType) => {
    try {
      setError('');
      setLoading(true);
      
      console.log('Starting registration process...');
      console.log('Auth object:', auth);
      
      // Create user account
      console.log('Creating user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created successfully:', user.uid);

      // Update user profile with display name
      console.log('Updating user profile...');
      await updateProfile(user, {
        displayName: name
      });
      console.log('Profile updated successfully');

      // Store additional user data in Firestore
      console.log('Storing user data in Firestore...');
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        businessName,
        businessType,
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`,
        createdAt: new Date()
      });
      console.log('User data stored in Firestore successfully');

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // If Firebase fails with configuration error, use mock authentication
      if (error.code === 'auth/configuration-not-found' || 
          error.code === 'auth/api-key-not-valid' ||
          error.code === 'auth/project-not-found') {
        
        console.log('Firebase not configured, using mock authentication');
        const mockUser = createMockUser(name, email, businessName, businessType);
        setCurrentUser(mockUser);
        setError('Using demo mode - Firebase not configured. Your data will be stored locally.');
        return true;
      }
      
      setError(getErrorMessage(error.code));
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile function
  const updateUserProfile = async (profileData) => {
    try {
      setError('');
      setLoading(true);

      // Check if using mock authentication
      if (getMockUser()) {
        console.log('Updating mock user profile...');
        const updatedUser = {
          ...currentUser,
          ...profileData,
          updatedAt: new Date().toISOString()
        };
        
        // Update localStorage
        localStorage.setItem('smartbiz_user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        console.log('Mock user profile updated successfully');
        return true;
      }

      // Firebase update
      if (auth.currentUser) {
        console.log('Updating Firebase user profile...');
        
        // Update display name in Firebase Auth if name changed
        if (profileData.name !== currentUser.name) {
          await updateProfile(auth.currentUser, {
            displayName: profileData.name
          });
        }

        // Update user document in Firestore
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          ...profileData,
          email: currentUser.email, // Keep original email
          updatedAt: new Date()
        }, { merge: true });

        // Update local state
        setCurrentUser(prev => ({
          ...prev,
          ...profileData
        }));

        console.log('Firebase user profile updated successfully');
        return true;
      }

      throw new Error('No authenticated user found');
    } catch (error) {
      console.error('Profile update error:', error);
      setError(getErrorMessage(error.code) || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/configuration-not-found':
        return 'Firebase Authentication is not properly configured. Please check the Firebase console.';
      case 'auth/api-key-not-valid':
        return 'Invalid API key. Please check Firebase configuration.';
      case 'auth/project-not-found':
        return 'Firebase project not found. Please check project configuration.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/internal-error':
        return 'Internal error. Please try again later.';
      default:
        return `Authentication error: ${errorCode}. Please try again or contact support.`;
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    updateUserProfile,
    error,
    loading
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
