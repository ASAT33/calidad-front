import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  // Verifica si el usuario está autenticado (por ejemplo, revisando el token en sessionStorage)
  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('role'); 
  
  // Si no hay token o el rol del usuario no es el requerido, redirigir a la página de inicio de sesión
  if (!token) {
    return <Navigate to="/" />;
  }

  // Verifica si el rol del usuario coincide con el requerido
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />; // o a una página de "acceso denegado"
  }

  return children;
};

export default PrivateRoute;
