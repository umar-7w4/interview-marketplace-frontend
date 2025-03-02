"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-dark/90 backdrop-blur-md shadow-lg py-6 px-12 flex justify-between items-center fixed w-full z-50 text-xl">
      {/* Logo */}
      <Link
        href="/"
        className="text-5xl font-extrabold text-white flex items-center"
      >
        <span className="text-primary">Mock</span>Xpert
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-14">
        <Link
          href="#"
          className="text-white hover:text-primary transition-all text-3xl font-semibold"
        >
          Features
        </Link>
        <Link
          href="#"
          className="text-white hover:text-primary transition-all text-3xl font-semibold"
        >
          Pricing
        </Link>
        <Link
          href="#"
          className="text-white hover:text-primary transition-all text-3xl font-semibold"
        >
          Resources
        </Link>
      </div>

      {/* Authentication Buttons */}
      <div className="flex space-x-4">
        {user ? (
          // Show Logout Button When Logged In
          <button
            onClick={logout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg text-2xl font-semibold hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          // Show Login & Signup Buttons When Logged Out
          <>
            <Link
              href="/auth/login"
              className="bg-primary text-white px-6 py-3 rounded-lg text-2xl font-semibold hover:bg-buttonHover"
            >
              Login
            </Link>
            <Link
              href="/auth/signup-selection"
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-2xl font-semibold hover:bg-green-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
