"use client";
import React, { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

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
    if (!/^\d*$/.test(value)) return; // Allow only numbers

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

    const enteredOtp = otp.join(""); // Convert array to string

    setTimeout(() => {
      if (enteredOtp === "123456") {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError("Invalid OTP. Please try again.");
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-dark text-white pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl p-10"
      >
        <Card className="bg-[#1E2535] shadow-lg p-12 rounded-xl border border-gray-700 text-center">
          <h2 className="text-4xl font-extrabold">Verify Your Email</h2>
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
        </Card>
      </motion.div>
    </div>
  );
}
