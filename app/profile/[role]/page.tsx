"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InterviewerForm from "../InterviewerForm";
import IntervieweeForm from "../IntervieweeForm";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login-selection");
      } else {
        setIsAuthChecked(true);
      }
    }
  }, [user, loading, router]);

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white text-lg">Checking authentication...</p>
      </div>
    );
  }

  // Ensure user is not null before accessing role
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white text-lg">Error: User not found</p>
      </div>
    );
  }

  const role = user.role?.toLowerCase(); // Ensure lowercase match

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {role === "interviewer" ? <InterviewerForm /> : <IntervieweeForm />}
    </div>
  );
}
