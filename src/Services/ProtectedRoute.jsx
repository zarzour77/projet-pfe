import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // If the user is not logged in, redirect to the home page.
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Always allow the Admin.
  if (currentUser.role === "Admin") {
    return children;
  }

  // If allowedRoles is provided and the user's role is not in allowedRoles, redirect to home.
  if (!allowedRoles || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
