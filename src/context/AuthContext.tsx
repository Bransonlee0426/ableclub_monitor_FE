import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserMe } from '../api/auth';

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, rememberMe?: boolean) => void;
  logout: () => void;
  getToken: () => string | null;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Token storage key
const TOKEN_KEY = 'authToken';

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize authentication state on component mount
  useEffect(() => {
    const verifyTokenOnLoad = async () => {
      const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      
      if (token) {
        try {
          // Verify token with server
          await getUserMe();
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(TOKEN_KEY);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      // Set loading to false after verification is complete
      setIsLoading(false);
    };

    verifyTokenOnLoad();

    // Listen for logout events from API interceptor
    const handleLogout = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-logout', handleLogout);

    return () => {
      window.removeEventListener('auth-logout', handleLogout);
    };
  }, []);

  // Login function: store token based on rememberMe flag and update auth state
  const login = (token: string, rememberMe: boolean = false) => {
    if (rememberMe) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    // 同時清除兩個儲存位置，確保完全登出
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  };

  const getToken = (): string | null => {
    // Priority: localStorage first, then sessionStorage
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  };

  // Context value object
  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};