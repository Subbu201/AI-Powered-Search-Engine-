import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../services/authService';

const ProtectedRoute = () => {
  const user = AuthService.getCurrentUser();

  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
