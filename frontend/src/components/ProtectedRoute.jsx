import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  // Show a loading indicator while checking auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Check if we have a valid auth token
  const hasAuthToken = !!localStorage.getItem('auth_token');
  
  // If no user is found after loading and we don't have a token, redirect to auth
  if (!user && !hasAuthToken) {
    // Save the attempted URL to redirect back after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}