import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAllowed(false);
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data?.user?.subscriptionValid) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch (error) {
        console.error("Erreur de vérification :", error);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  if (loading) return <div className="text-center mt-10">🔒 Vérification de l'accès...</div>;

  if (!allowed) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
