"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Password reset link sent to your email.");
      } else {
        const data = await response.json();
        setError(data.message || "User not found.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-dark">
      <Card className="bg-cardBg shadow-xl p-12 rounded-lg border border-gray-700 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center">Forgot Password?</h2>
        <p className="text-center text-textSecondary text-lg">
          Enter your email to receive a reset link.
        </p>

        <form className="space-y-6 mt-6" onSubmit={handleForgotPassword}>
          <div>
            <Label className="text-xl">Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              className="mt-2 bg-inputBg text-textPrimary border-none p-4 text-lg w-full rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-buttonBg text-white hover:bg-buttonHover p-4 text-lg rounded-lg"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        {message && (
          <p className="text-green-500 text-center mt-4">{message}</p>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <Separator className="my-6 bg-gray-600" />
        <p className="text-center">
          Remembered your password?{" "}
          <a
            href="/auth/login"
            className="text-primary hover:underline font-semibold"
          >
            Log in
          </a>
        </p>
      </Card>
    </div>
  );
}
