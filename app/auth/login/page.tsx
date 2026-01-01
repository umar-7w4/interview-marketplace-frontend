"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center bg-dark text-white">
        We are loading dashboard for you, just a second!
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-dark text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl p-12 min-h-[500px]"
      >
        <Card className="bg-[#1E2535] shadow-lg p-12 rounded-xl border border-gray-700 mt-24">
          <div className="flex justify-center">
            <Avatar className="w-24 h-2">
              <AvatarImage src="/logo.png" alt="MockXpert Logo" />
            </Avatar>
          </div>
          <h2 className="text-4xl font-extrabold text-center mt-6 text-white">
            Welcome Back
          </h2>
          <p className="text-center text-gray-300 text-xl">
            Sign in to continue
          </p>
          {error && (
            <p className="text-red-500 text-center text-lg mt-4">{error}</p>
          )}
          <form className="space-y-6 mt-8" onSubmit={handleSubmit}>
            <div>
              <Label className="text-2xl text-white">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="mt-2 bg-white text-black placeholder-black border-white p-4 text-xl w-full rounded-xl"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-2xl text-white">Password</Label>
              <Input
                type="password"
                placeholder="********"
                className="mt-2 bg-white text-black placeholder-black border-white p-4 text-xl w-full rounded-xl"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <div className="text-right mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-primary hover:underline font-semibold text-lg"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-buttonBg text-white hover:bg-buttonHover p-6 text-xl rounded-xl"
              disabled={localLoading}
            >
              {localLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <Separator className="my-6 bg-gray-600" />
          <div className="flex flex-col space-y-4">
            <Button className="w-full flex items-center justify-center gap-3 bg-white text-black text-xl p-6 rounded-xl hover:opacity-90">
              <FcGoogle size={28} /> Sign in with Google
            </Button>
            <Button className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white text-xl p-6 rounded-xl hover:bg-blue-700">
              <FaLinkedin size={28} /> Sign in with LinkedIn
            </Button>
            <Button className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white text-xl p-6 rounded-xl hover:bg-gray-800">
              <FaGithub size={28} /> Sign in with GitHub
            </Button>
          </div>
          <Separator className="my-6 bg-gray-600" />
          <p className="text-lg text-center text-white">
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
      <style jsx global>{`
        input {
          color: black !important;
          caret-color: black !important;
        }
      `}</style>
    </div>
  );
}
