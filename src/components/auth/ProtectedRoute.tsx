
import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If authentication state changes and user is no longer authenticated
    // while on a protected route, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  // If still loading auth state, show a spinner
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Redirect to login and keep track of where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and we have a user, render the protected content
  if (user) {
    return <>{children}</>;
  }

  // Fallback if something unexpected happens
  return <Navigate to="/login" replace />;
}
