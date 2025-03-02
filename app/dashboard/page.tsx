"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return <div className="text-white text-center mt-20">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome, {user.email}</h1>
      <p className="text-lg text-gray-300">Role: {user.role}</p>
    </div>
  );
}
