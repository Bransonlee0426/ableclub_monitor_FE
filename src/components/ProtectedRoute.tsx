import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ProtectedRoute component that guards access to protected pages
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If loading, return null since App.tsx is already showing the loading screen
  if (isLoading) {
    return null;
  }

  // If user is authenticated, render the child routes
  // If not authenticated, redirect to login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;