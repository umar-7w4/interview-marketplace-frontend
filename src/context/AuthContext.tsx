"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface LoginResponse {
  email: string;
  role: string;
  idToken: string;
  refreshToken: string;
}

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  workEmail?: string;
  password: string;
  phoneNumber: string;
  profilePictureUrl?: string;
  preferredLanguage?: string;
  timezone?: string;
  createdAt: string;
  lastLogin?: string;
  role: string;
  status: string;
  idToken?: string;
  refreshToken?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<User>("/users/login", {
        email,
        password,
      });

      const userData: User = response.data;

      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password. Please try again.");
    }
  };

  const signup = async (userData: Partial<User>) => {
    try {
      const response = await axios.post<User>("/users/register", userData);
      const newUser: User = response.data; // TypeScript now correctly infers this

      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Failed to create account. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth/login-selection");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
