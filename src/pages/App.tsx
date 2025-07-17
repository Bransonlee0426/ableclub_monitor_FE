import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouterConfig from '../router';
import { AuthProvider, useAuth } from '../context/AuthContext';

// App content component that can access the auth context
const AppContent = () => {
  const { isLoading } = useAuth();

  // Show loading screen while verifying token
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-ring loading-xl"></span>
      </div>
    );
  }

  // Show router content once loading is complete
  return <RouterConfig />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
