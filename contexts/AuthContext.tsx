"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser } from "@/lib/api";
import type { LoginRequest, AuthResponse } from "@/lib/types";

interface AuthContextType {
user: AuthResponse | null;
loading: boolean;
login: (email: string, password: string) => Promise<AuthResponse>;
logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
const [user, setUser] = useState<AuthResponse | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    localStorage.removeItem("user");
  } finally {
    setLoading(false);
  }
}, []);

const login = async (email: string, password: string) => {
  try {
    const data = await loginUser({ email, password });
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};

const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
  // Redirect to home or login page
  window.location.href = '/login';
};

const value = { user, loading, login, logout };

return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
const context = useContext(AuthContext);
if (context === undefined) {
  throw new Error("useAuth must be used within an AuthProvider");
}
return context;
}
