import React from 'react';
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const ProtectedRoutes = ({ children }) => {
  const { token } = useAuthStore();

  if (!token) return <Navigate to="/orders" replace />;
  return children;
}

export default ProtectedRoutes;
