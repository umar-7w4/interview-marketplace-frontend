"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaUserTie, FaLaptopCode } from "react-icons/fa6"; // Icons for roles

export default function LoginSelection() {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-dark p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16"
      >
        {/* For Interviewers */}
        <Card className="bg-[#1E2535] shadow-lg p-12 rounded-xl border border-gray-700 shadow-xl text-center w-full">
          <h2 className="text-5xl font-extrabold text-secondary">
            For Interviewers
          </h2>
          <p className="text-gray-300 text-2xl mt-4">
            Conduct expert interviews and earn by helping candidates prepare.
          </p>
          <Button className="w-full bg-secondary text-white text-2xl p-6 mt-8 rounded-xl hover:opacity-90">
            <Link href="/auth/login?role=interviewer">Login</Link>
          </Button>
          <Separator className="my-8 bg-gray-600" />
          <p className="text-xl text-white">
            Don't have an account?{" "}
            <Link
              href="/auth/signup-selection"
              className="text-secondary hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </Card>

        {/* For Interviewees */}
        <Card className="bg-[#1E2535] shadow-lg p-14 rounded-2xl border border-gray-700 shadow-xl text-center w-full">
          <h2 className="text-5xl font-extrabold text-primary">
            For Interviewees
          </h2>
          <p className="text-gray-300 text-2xl mt-4">
            Prepare for job interviews with expert interviewers.
          </p>
          <Button className="w-full bg-primary text-white text-2xl p-6 mt-8 rounded-xl hover:opacity-90">
            <Link href="/auth/login?role=interviewee">Login</Link>
          </Button>
          <Separator className="my-8 bg-gray-600" />
          <p className="text-xl text-white">
            Don't have an account?{" "}
            <Link
              href="/auth/signup-selection"
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
