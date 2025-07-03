// src/components/AuthRoleRoute.tsx
import type { JSX } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface Props {
  children: JSX.Element;
  allowedRoles: string[];
}

const AuthRoleRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, role } = useSelector((state: any) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AuthRoleRoute;
