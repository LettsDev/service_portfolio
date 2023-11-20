import React from "react";
import { UseAuth } from "../context/auth.provider";
import { Navigate } from "react-router-dom";
import { IUser } from "../types";
const WithAuth = ({
  children,
  authorityNeeded,
}: {
  children: React.ReactNode;
  authorityNeeded: IUser["auth"];
}) => {
  const { isAuthenticated, isAuthorized } = UseAuth();

  if (isAuthenticated() && isAuthorized(authorityNeeded)) {
    return children;
  }
  return <Navigate to="/login" />;
};
export default WithAuth;
