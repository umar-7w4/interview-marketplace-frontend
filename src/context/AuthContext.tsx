"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { User, LoginResponse } from "@/types/auth";

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

  const fetchUserData = async (idToken: string) => {
    try {
      const response = await axios.get<User>("/users/current-user", {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const fullUserData = { ...response.data, idToken };
      localStorage.setItem("user", JSON.stringify(fullUserData));
      setUser(fullUserData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedTokens = localStorage.getItem("authTokens");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    if (storedTokens) {
      const { idToken } = JSON.parse(storedTokens);
      if (idToken) {
        fetchUserData(idToken);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>("/users/login", {
        email,
        password,
      });
      const { idToken, refreshToken } = response.data;
      localStorage.setItem(
        "authTokens",
        JSON.stringify({ idToken, refreshToken })
      );
      if (idToken) {
        await fetchUserData(idToken);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid email or password. Please try again.");
    }
  };

  const signup = async (userData: Partial<User>) => {
    try {
      const response = await axios.post<LoginResponse>(
        "/users/register",
        userData
      );
      const { idToken, refreshToken } = response.data;
      localStorage.setItem(
        "authTokens",
        JSON.stringify({ idToken, refreshToken })
      );
      if (idToken) {
        await fetchUserData(idToken);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Failed to create account. Please try again!");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authTokens");
    setUser(null);
    router.push("/");
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
