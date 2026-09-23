import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * ProtectedRoute component:
 * Ensures that only authenticated users (with a valid token in localStorage)
 * can access protected pages/routes. Unauthenticated users are redirected
 * to /login with an informative toast and original location preserved.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to access this page.", {
        id: "auth-required",
        duration: 3500,
      });
    }
  }, [token, location.pathname]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
