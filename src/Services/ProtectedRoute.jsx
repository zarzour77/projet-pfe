// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  if (currentUser.role === "Admin") {
    return children;
  }
  // Si l'utilisateur n'est pas connecté ou son rôle n'est pas autorisé, rediriger
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;