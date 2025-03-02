"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import axios from "@/lib/axios";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    workEmail: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const userPayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        passwordHash: formData.password,
        confirmPassword: formData.confirmPassword,
        preferredLanguage: "English",
        timezone: "America/New_York",
        status: role === "interviewer" ? "PENDING" : "ACTIVE",
        role: role === "interviewer" ? "INTERVIEWER" : "INTERVIEWEE",
        workEmail: role === "interviewer" ? formData.workEmail : "",
      };

      await axios.post("/users/register", userPayload);

      if (role === "interviewer") {
        router.push(`/auth/verify-email?email=${formData.workEmail}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err.response?.data) {
        setError(err.response.data);
      } else {
        setError("Failed to create account. Please try again.");
      }
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center bg-dark text-white pt-32 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl p-12 min-h-[500px]"
      >
        <Card className="bg-[#1E2535] shadow-lg p-8 rounded-xl border border-gray-700">
          <h2 className="text-4xl font-extrabold text-center text-white mt-6">
            Create Your Account
          </h2>
          <p className="text-center text-gray-300">Sign up to get started</p>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-lg text-white">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  className="mt-2 bg-[#1E2535] text-white border-white p-4 text-lg w-full rounded-lg"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="text-lg text-white">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  className="mt-2 bg-[#1E2535] text-white border-white p-4 text-lg w-full rounded-lg"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="text-lg text-white">Email</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="mt-2 bg-[#1E2535] text-white border-white p-4 text-lg w-full rounded-lg"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="text-lg text-white">Phone Number</Label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+1 123 456 7890"
                  className="mt-2 bg-[#1E2535] text-white border-white p-4 text-lg w-full rounded-lg"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="text-lg text-white">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="********"
                  className="mt-2 bg-[#1E2535] text-white border-white p-4 text-lg w-full rounded-lg"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label className="text-lg text-white">Confirm Password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="********"
                  className="mt-2 bg-[#1E2535] text-white border-white p-4 text-lg w-full rounded-lg"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {role === "interviewer" && (
                <div className="col-span-2">
                  <Label className="text-lg text-white">Work Email</Label>
                  <Input
                    type="email"
                    name="workEmail"
                    placeholder="yourname@company.com"
                    className="mt-2 bg-[#1E2535] text-white border-white p-4 text-lg w-full rounded-lg"
                    value={formData.workEmail}
                    onChange={handleChange}
                    required={role === "interviewer"}
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    A verification code will be sent to your work email.
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-buttonBg text-white hover:bg-buttonHover p-5 text-lg rounded-lg"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <Separator className="my-6 bg-gray-600" />

          <div className="flex flex-col space-y-4">
            <Button className="w-full flex items-center justify-center gap-3 bg-white text-black text-xl p-6 rounded-xl hover:opacity-90">
              <FcGoogle size={28} /> Sign up with Google
            </Button>
            <Button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white text-xl p-6 rounded-xl hover:bg-blue-700">
              <FaLinkedin size={28} /> Sign up with LinkedIn
            </Button>
            <Button className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white text-xl p-6 rounded-xl hover:bg-gray-800">
              <FaGithub size={28} /> Sign up with GitHub
            </Button>
          </div>

          <Separator className="my-8 bg-gray-600" />

          <p className="text-lg text-center text-white">
            Already have an account?{" "}
            <Link
              href="/auth/login-selection"
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
