"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    NProgress.start();
    const timer = setTimeout(() => {
      setLoading(false);
      NProgress.done();
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#15192e] text-white`}>
        <AuthProvider>
          <Navbar />

          {}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="h-16 w-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
          )}

          {}
          <main
            key={pathname}
            className={`min-h-screen transform transition-all duration-500 ease-in-out ${
              loading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
