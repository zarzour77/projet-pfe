// ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser } = useContext(AuthContext);

  // Si l'utilisateur n'est pas connecté ou son rôle n'est pas autorisé, rediriger
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
