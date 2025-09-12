import * as React from 'react';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: FC<PropsWithChildren> = ({ children }): ReactElement => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Save the attempted path for redirect after login
  React.useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      localStorage.setItem("redirectPath", location.pathname);
    }
  }, [isAuthenticated, isLoading, location.pathname]);

  // Show nothing while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
