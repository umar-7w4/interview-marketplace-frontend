"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-3xl w-full text-center animate-fadeIn">
        {/* SVG Failure Icon */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.53-10.47a.75.75 0 10-1.06-1.06L10 8.94 7.53 6.47a.75.75 0 00-1.06 1.06L8.94 10l-2.47 2.47a.75.75 0 101.06 1.06L10 11.06l2.47 2.47a.75.75 0 101.06-1.06L11.06 10l2.47-2.47z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold text-red-500 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          Your payment was not completed. No amount has been charged.
        </p>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-red-600 hover:bg-red-700 text-2xl font-bold px-8 py-4"
        >
          Go Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
