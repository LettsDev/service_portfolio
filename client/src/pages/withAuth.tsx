import React from "react";
import { useAuth } from "../context/auth.provider";
import { useAlert } from "../context/alert.provider";
import { Navigate, useLocation } from "react-router-dom";
import { IUser } from "../types";
const WithAuth = ({
  children,
  authorityNeeded = "USER",
}: {
  children: React.ReactNode;
  authorityNeeded?: IUser["auth"];
}) => {
  const { isAuthenticated, isAuthorized } = useAuth();

  const location = useLocation();
  const { addAlert } = useAlert();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!isAuthorized(authorityNeeded)) {
    console.log("not auth");
    addAlert({
      type: "warning",
      message: "You do not have the necessary authority for this action",
    });
    return <Navigate to=".." />;
  }

  return children;
};
export default WithAuth;
