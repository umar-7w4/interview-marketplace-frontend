"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const fireworksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initFireworks = async () => {
      const { Fireworks } = await import("fireworks-js");

      if (fireworksRef.current) {
        const fw = new Fireworks(fireworksRef.current, {
          speed: 3,
          gravity: 1.5,
          particles: 100,
          explosion: 6,
          friction: 0.95,
          boundaries: {
            x: 50,
            y: 50,
            width: fireworksRef.current.clientWidth,
            height: fireworksRef.current.clientHeight,
          },
          hue: { min: 0, max: 360 },
          delay: { min: 15, max: 30 },
        });

        fw.start();
        return () => fw.stop();
      }
    };

    initFireworks();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-8 overflow-hidden">
      {}
      <div ref={fireworksRef} className="absolute inset-0 z-[-1]" />

      {}
      <div className="relative bg-gray-900 rounded-3xl shadow-2xl p-10 max-w-3xl w-full text-center animate-fadeIn">
        {}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-green-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold text-green-500 mb-4">
          Payment Successful!
        </h1>
        <p className="text-2xl text-gray-300 mb-8">
          Your payment has been processed successfully.
        </p>
        <Button
          onClick={() => router.push("/dashboard")}
          className="bg-green-600 hover:bg-green-700 text-2xl font-bold px-8 py-4"
        >
          Go Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
