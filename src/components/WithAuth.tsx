// src/components/WithAuth.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface WithAuthProps {
  children: ReactNode;
}

const WithAuth: React.FC<WithAuthProps> = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // render wrapped content
};

export default WithAuth;
