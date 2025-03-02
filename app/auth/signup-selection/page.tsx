"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUserTie, FaLaptopCode } from "react-icons/fa6"; // Icons for roles

export default function SignupSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
  };

  const handleProceed = () => {
    if (selectedRole) {
      router.push(`/auth/signup?role=${selectedRole}`);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-dark text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl p-12"
      >
        <h1 className="text-5xl font-extrabold text-center">
          How do you want to use MockXpert?
        </h1>
        <p className="text-center text-gray-300 text-xl mt-2">
          We’ll personalize your experience accordingly.
        </p>

        {/* Role Selection Cards */}
        <div className="mt-10 space-y-8">
          {/* Interviewer Selection */}
          <div
            className={`flex items-center p-12 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedRole === "interviewer"
                ? "border-primary bg-primary/20 shadow-lg"
                : "border-gray-600 hover:border-primary hover:bg-primary/10"
            }`}
            onClick={() => handleSelectRole("interviewer")}
          >
            <FaUserTie className="text-6xl text-primary mr-6" />
            <div>
              <h3 className="text-2xl font-bold">I'm an Interviewer</h3>
              <p className="text-lg text-gray-300">
                Conduct expert interviews and earn by helping candidates.
              </p>
            </div>
          </div>

          {/* Interviewee Selection */}
          <div
            className={`flex items-center p-12 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedRole === "interviewee"
                ? "border-secondary bg-secondary/20 shadow-lg"
                : "border-gray-600 hover:border-secondary hover:bg-secondary/10"
            }`}
            onClick={() => handleSelectRole("interviewee")}
          >
            <FaLaptopCode className="text-6xl text-secondary mr-6" />
            <div>
              <h3 className="text-2xl font-bold">I'm an Interviewee</h3>
              <p className="text-lg text-gray-300">
                Prepare for job interviews with expert interviewers.
              </p>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <div className="mt-10 flex justify-center">
          <Button
            className={`px-10 py-8 text-2xl font-semibold rounded-lg ${
              selectedRole
                ? "bg-primary text-white hover:bg-primary/80"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedRole}
            onClick={handleProceed}
          >
            Create Account
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
