"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPassword() {
  const searchParams = useSearchParams(); //  Extract query parameters
  const token = searchParams.get("token"); //  Get the reset token from the URL
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (!token) {
      setError("Reset token is missing. Please request a new reset link.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/reset-password?token=${token}&newPassword=${encodeURIComponent(
          newPassword
        )}&confirmPassword=${encodeURIComponent(confirmPassword)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        setMessage("Password reset successfully. Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Reset Password Error:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-dark">
      <div className="bg-[#1E2535] shadow-xl p-12 rounded-lg border border-gray-700 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-white">
          Reset Password
        </h2>
        <p className="text-center text-textSecondary text-lg text-white">
          Enter your new password below.
        </p>

        <form className="space-y-6 mt-6" onSubmit={handleResetPassword}>
          <div>
            <label className="text-xl text-white">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              className="mt-2 bg-inputBg text-textPrimary border-none p-4 text-lg w-full rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xl text-white">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm new password"
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
      </div>
      <style jsx global>{`
        input {
          color: black !important;
          caret-color: black !important;
        }
      `}</style>
    </div>
  );
}
