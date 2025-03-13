import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("authToken"); // Get token from storage

  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children; // Allow access to protected pages
};

export default RequireAuth;
