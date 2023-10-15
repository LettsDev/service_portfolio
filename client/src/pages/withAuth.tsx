import React from "react";
import { UseAuth } from "../context/auth.provider";
import { Navigate } from "react-router-dom";
const WithAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = UseAuth();

  if (isAuthenticated()) {
    return children;
  }
  return <Navigate to="/login" />;
};
export default WithAuth;
