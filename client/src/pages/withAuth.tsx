import React, { useEffect } from "react";
import { useAuth } from "../context/auth.provider";
import { useAlert } from "../context/alert.provider";
import { useLocation, useNavigate } from "react-router-dom";
import { IUser } from "../types";
const WithAuth = ({
  children,
  authorityNeeded = "USER",
}: {
  children: React.ReactNode;
  authorityNeeded?: IUser["auth"];
}) => {
  const { isAuthenticated, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { addAlert } = useAlert();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!isAuthorized(authorityNeeded)) {
      navigate("..");
      addAlert({
        type: "warning",
        message: "You do not have the necessary authority for this action",
      });
      return;
    }
  }, []);

  return children;
};
export default WithAuth;
