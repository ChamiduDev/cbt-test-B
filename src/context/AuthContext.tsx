"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  userStatus: "pending" | "approved" | "rejected" | undefined;
  setUserStatus: (status: "pending" | "approved" | "rejected" | undefined) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    // Initialize admin state based on existing token
    if (typeof window !== 'undefined') {
      const existingToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      const adminState = !!existingToken;
      console.log("AuthContext initialization:", { existingToken: !!existingToken, adminState });
      // If there's a token, assume admin until verified otherwise
      return adminState;
    }
    return false;
  });
  
  const [userStatus, setUserStatus] = useState<"pending" | "approved" | "rejected" | undefined>(undefined);
  const [token, setToken] = useState<string | null>(() => {
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      const existingToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log("Token initialization:", { existingToken: !!existingToken });
      return existingToken;
    }
    return null;
  });

  const login = (newToken: string) => {
    console.log("Login called with token:", !!newToken);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    sessionStorage.setItem('token', newToken);
    setIsAdmin(true); // Set admin to true when logging in
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setIsAdmin(false);
    setUserStatus(undefined);
  };

  // Create a wrapped setIsAdmin function for debugging
  const wrappedSetIsAdmin = (value: boolean) => {
    console.log("setIsAdmin called with:", value);
    setIsAdmin(value);
  };

  return (
    <AuthContext.Provider value={{ 
      isAdmin, 
      setIsAdmin: wrappedSetIsAdmin, 
      userStatus, 
      setUserStatus, 
      token, 
      setToken, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
