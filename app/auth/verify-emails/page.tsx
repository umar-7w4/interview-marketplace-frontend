"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailsPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.isEmailVerified && user?.isWorkEmailVerified) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleVerifyEmail = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens") as string).idToken
        : "";
      const response = await fetch(
        `${apiUrl}/api/verification/user/sendOtp/${user?.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send OTP to primary email");
      }
      alert("OTP sent successfully to your primary email address.");
      router.push(
        `/verify-email?type=primary&email=${encodeURIComponent(
          user?.email || ""
        )}`
      );
    } catch (error) {
      console.error("Error sending OTP for primary email:", error);
      alert("Error sending OTP for primary email.");
    }
  };

  const handleVerifyWorkEmail = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens") as string).idToken
        : "";
      const response = await fetch(
        `${apiUrl}/api/verification/sendOtp/${user?.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to send OTP to work email");
      }
      alert("OTP sent successfully to your work email address.");
      router.push(
        `/verify-email?type=work&email=${encodeURIComponent(
          user?.workEmail || ""
        )}`
      );
    } catch (error) {
      console.error("Error sending OTP for work email:", error);
      alert("Error sending OTP for work email.");
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-10">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        {}
        <Card className="bg-[#1E2535] shadow-xl p-12 rounded-2xl border border-gray-600 text-center flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold text-red-500">
              Email Not Verified
            </h2>
            <p className="text-lg text-gray-300 mt-4">
              Your primary email has not been verified. Please check your inbox
              and verify your email address to continue accessing all features.
            </p>
          </div>
          <div className="mt-8">
            <Button
              onClick={handleVerifyEmail}
              className="w-full bg-green-600 hover:bg-green-700 text-xl font-bold py-4 rounded-xl transition duration-300"
            >
              Verify Email
            </Button>
          </div>
        </Card>
        {}
        <Card className="bg-[#1E2535] shadow-xl p-12 rounded-2xl border border-gray-600 text-center flex flex-col justify-between">
          <div>
            <h2 className="text-4xl font-bold text-red-500">
              Work Email Not Verified
            </h2>
            <p className="text-lg text-gray-300 mt-4">
              Your work email has not been verified. Please verify your work
              email address to complete your profile and gain full access.
            </p>
          </div>
          <div className="mt-8">
            <Button
              onClick={handleVerifyWorkEmail}
              className="w-full bg-green-600 hover:bg-green-700 text-xl font-bold py-4 rounded-xl transition duration-300"
            >
              Verify Work Email
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
