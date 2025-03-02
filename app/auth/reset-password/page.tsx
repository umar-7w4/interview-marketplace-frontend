"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword, confirmPassword }),
      });

      if (response.ok) {
        setMessage("Password successfully reset. Redirecting...");
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        const data = await response.json();
        setError(data.message || "Invalid or expired token.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-dark">
      <Card className="bg-cardBg shadow-xl p-10 rounded-lg border border-gray-700 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center">Reset Password</h2>
        <p className="text-center text-textSecondary text-lg">
          Enter your new password below.
        </p>

        <form className="space-y-6 mt-6" onSubmit={handleResetPassword}>
          <div>
            <Label className="text-xl">New Password</Label>
            <Input
              type="password"
              placeholder="********"
              className="mt-2 bg-inputBg text-textPrimary border-none p-4 text-lg w-full rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="text-xl">Confirm Password</Label>
            <Input
              type="password"
              placeholder="********"
              className="mt-2 bg-inputBg text-textPrimary border-none p-4 text-lg w-full rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-buttonBg text-white hover:bg-buttonHover p-4 text-lg rounded-lg"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
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
