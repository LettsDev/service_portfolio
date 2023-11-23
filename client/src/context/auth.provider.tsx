import React, { createContext, useContext, useState } from "react";
import { IUser, ExtendedError } from "../types";
import axios from "axios";
interface AuthContextType {
  user: IUser | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  isAuthorized: (neededCredentials: IUser["auth"]) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      await axios.post("/api/session", { email, password });
      //will respond with refresh and accessTokens that axios will automatically attach to subsequent requests
      const userResponse = await axios.get("/api/me");
      setUser(userResponse.data);
    } catch (error) {
      //axios will throw on non-200 responses
      if (axios.isAxiosError(error)) {
        if (error.response) {
          //the request was made and there was a response
          throw new ExtendedError(error.response.data, error.response.status);
        } else {
          //there was no response
          throw new ExtendedError(error.message, 404);
        }
      }
      //not an axios Error
      console.error(error);
      throw new Error("client-side login error");
    }
  };

  const logout = async () => {
    try {
      await axios.delete("/api/session");
      setUser(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          //the request was made and there was a response
          throw new ExtendedError(error.message, error.response.status);
        } else {
          //there was no response
          throw new ExtendedError(error.message, 404);
        }
      }
      console.error(error);
      throw new Error("client-side logout error");
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAuthorized = (neededCredentials: IUser["auth"]) => {
    if (user) {
      switch (neededCredentials) {
        case "ADMIN":
          if (user.auth !== "ADMIN") {
            return false;
          }
          return true;

        case "ENHANCED":
          if (user.auth === "USER") {
            return false;
          }
          return true;

        case "USER":
          return true;
      }
    }
    return false;
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isAuthorized,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
