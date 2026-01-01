"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  getInterviewerByUserId,
  getIntervieweeByUserId,
} from "@/lib/availabilityService";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem("authTokens");
    const idToken = stored ? JSON.parse(stored).idToken : "";

    if (user.role === "INTERVIEWER") {
      getInterviewerByUserId(user.userId)
        .then((interviewer) => {
          setProfileImageUrl(
            interviewer.profileImage && interviewer.profileImage.trim() !== ""
              ? interviewer.profileImage
              : "/default-user-icon.png"
          );
        })
        .catch(() => {
          setProfileImageUrl("/default-user-icon.png");
        });
    } else {
      getIntervieweeByUserId(user.userId)
        .then((interviewee) => {
          setProfileImageUrl(
            interviewee.profileImage && interviewee.profileImage.trim() !== ""
              ? interviewee.profileImage
              : "/default-user-icon.png"
          );
        })
        .catch(() => {
          setProfileImageUrl("/default-user-icon.png");
        });
    }
  }, [user]);

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-dark backdrop-blur-md shadow-lg py-6 px-12 flex justify-between items-center text-xl">
      <Link
        href="/"
        className="text-5xl font-extrabold text-white flex items-center"
      >
        <span className="text-primary">Mock</span>Xpert
      </Link>
      <div className="hidden md:flex space-x-14">
        {user?.role === "INTERVIEWEE" && (
          <Link
            href="/home"
            className="text-white hover:text-primary transition-all text-3xl font-semibold"
          >
            Interviewers
          </Link>
        )}
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
      <div className="flex items-center space-x-4">
        {user ? (
          <div className="relative">
            {profileImageUrl ? (
              <img
                src={profileImageUrl || "/default-user-icon.png"}
                onError={(e) => {
                  e.currentTarget.src = "/default-user-icon.png";
                }}
                alt="Profile"
                onClick={handleToggleDropdown}
                className="w-16 h-16 rounded-full object-cover cursor-pointer border-2 border-primary"
              />
            ) : (
              <FaUserCircle
                onClick={handleToggleDropdown}
                className="text-white text-5xl cursor-pointer hover:text-primary transition"
              />
            )}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gradient-to-br from-[#232946] to-[#2c2f4a] text-white text-base rounded-lg shadow-2xl ring-1 ring-gray-600 py-2 transform origin-top-right animate-dropdown">
                <Link
                  href="/profile/edit"
                  className="block px-4 py-2 hover:bg-primary hover:text-white transition-colors font-semibold rounded-sm text-xl"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 hover:bg-primary hover:text-white transition-colors font-semibold rounded-sm text-xl"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/"
                  className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-white transition-colors font-semibold rounded-sm text-xl"
                  onClick={() => {
                    logout();
                    setDropdownOpen(false);
                  }}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/auth/login-selection"
              className="bg-primary text-white px-6 py-3 rounded-lg text-2xl font-semibold hover:bg-buttonHover"
            >
              Login
            </Link>
            <Link
              href="/auth/signup-selection"
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-2xl font-semibold hover:bg-green-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
