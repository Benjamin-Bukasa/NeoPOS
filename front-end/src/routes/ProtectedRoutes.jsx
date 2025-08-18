
import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const ProtectedRoutes = ({ children }) => {
  const { token } = useAuthStore();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated and trying to access /login, redirect to dashboard
  if (location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoutes;
