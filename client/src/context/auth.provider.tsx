import React, { createContext, useContext, useState } from "react";
import { IUser } from "../types";
import { createSession, deleteSession } from "../data/session.data";
import { getCurrentUser } from "../data/user.data";
interface AuthContextType {
  user: IUser | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

//need to check on load if the user is already logged in, if so then set the user
export function UseAuth() {
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
    const response = await createSession({ email, password });
    const userResponse = await getCurrentUser();
    if (response.status >= 400 || userResponse.status >= 400) {
      throw new Error(`Login error: ${response.statusText}`);
    }
    console.log(response);
    setUser(userResponse.data);
  };

  const logout = async () => {
    const response = await deleteSession();
    if (response.status >= 400) {
      throw new Error(`Log out error: ${response.statusText}`);
    }
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
