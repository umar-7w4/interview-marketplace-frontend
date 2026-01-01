"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import IntervieweeDashboard from "./IntervieweeDashboard";
import InterviewerDashboard from "./InterviewerDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-white">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white px-8 py-12">
      <h1 className="text-5xl font-extrabold text-center mb-10 tracking-wide">
        Welcome to the MockXpert {user.role} Dashboard
      </h1>

      {user.role === "INTERVIEWEE" ? (
        <IntervieweeDashboard />
      ) : user.role === "INTERVIEWER" ? (
        <InterviewerDashboard />
      ) : (
        <p className="text-center text-xl text-red-400">
          Unknown user role: {user.role}
        </p>
      )}
    </main>
  );
}
