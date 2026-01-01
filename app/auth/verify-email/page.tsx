"use client";

import React, { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "primary";
  const email = searchParams.get("email") || "your email";
  const userId = JSON.parse(localStorage.getItem("user") as string)?.userId;

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // only digits allowed
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);
    const enteredOtp = otp.join("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens") as string).idToken
        : "";
      // Choose endpoint based on type
      let endpoint = "";
      if (type === "primary") {
        endpoint = `${apiUrl}/api/verification/user/verifyOtp/${userId}`;
      } else {
        endpoint = `${apiUrl}/api/verification/verifyOtp/${userId}`;
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: enteredOtp }),
      });
      console.log(response);
      if (response.ok) {
        const resultMessage = await response.text();
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        let errMsg = "Verification failed";
        try {
          const data = await response.json();
          errMsg = data.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
    } catch (err: any) {
      console.error("Verification Error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    }
    setIsVerifying(false);
  };

  const handleResendOtp = async () => {
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("authTokens")
        ? JSON.parse(localStorage.getItem("authTokens") as string).idToken
        : "";
      let endpoint = "";
      if (type === "primary") {
        endpoint = `${apiUrl}/api/verification/user/resendOtp/${userId}`;
      } else {
        endpoint = `${apiUrl}/api/verification/resendOtp/${userId}`;
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        let errMsg = "Failed to resend OTP";
        try {
          const data = await response.json();
          errMsg = data.message || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      alert("OTP has been resent successfully.");
    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      setError(error.message || "Error resending OTP");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl p-10"
      >
        <Card className="bg-[#1E2535] shadow-lg p-12 rounded-xl border border-gray-700 text-center">
          <h2 className="text-4xl font-extrabold">
            {type === "primary"
              ? "Verify Your Email"
              : "Verify Your Work Email"}
          </h2>
          <p className="text-gray-300 mt-2">
            Enter the OTP sent to <span className="font-semibold">{email}</span>
          </p>
          {isSuccess ? (
            <p className="text-green-500 text-xl mt-6">
              OTP Verified! Redirecting...
            </p>
          ) : (
            <form className="space-y-6 mt-6" onSubmit={handleVerifyOTP}>
              <Label className="text-lg">Enter OTP</Label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    className="w-14 h-14 bg-[#1E2535] text-white border-white text-2xl text-center rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    value={digit}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>
              {error && <p className="text-red-500 text-lg">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-buttonBg text-white hover:bg-buttonHover p-5 text-lg rounded-lg mt-6"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}
          <div className="mt-6">
            <Button
              onClick={handleResendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-bold p-4 rounded-lg"
            >
              Resend OTP
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
