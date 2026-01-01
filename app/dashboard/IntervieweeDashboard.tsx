"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RiMoneyDollarCircleFill,
  RiCalendarEventFill,
  RiCalendarCheckFill,
} from "react-icons/ri";
import { FiTrendingUp, FiEdit } from "react-icons/fi";
import Link from "next/link";
import {
  getTotalSpent,
  getUpcomingInterviewsCount,
  getCompletedInterviewsCount,
  fetchUpcomingInterviews,
  doesIntervieweeProfileExist,
} from "@/lib/profileService";
import { Interview } from "@/types/entities";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function IntervieweeDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [upcomingCount, setUpcomingCount] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [completedInterviews, setCompletedInterviews] = useState<Interview[]>(
    []
  );
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (!user) return;
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.emailVerified) {
          setShowVerificationModal(true);
        }
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    async function checkProfile() {
      if (!user) return;
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const token = parsed.idToken;
      if (!token) return;
      if (parsed.emailVerified) {
        try {
          const exists = await doesIntervieweeProfileExist(token, user.userId);
          if (!exists) setShowProfileModal(true);
        } catch {
          setShowProfileModal(true);
        }
      }
    }
    checkProfile();
  }, [user]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const stored = localStorage.getItem("user");
        if (!stored) return;
        const parsed = JSON.parse(stored);
        const token = parsed.idToken;
        const userId = user.userId;
        if (!token || !userId) {
          setLoading(false);
          return;
        }
        const spent = await getTotalSpent(token, userId);
        setTotalSpent(spent);
        const upcoming = await getUpcomingInterviewsCount(token, userId);
        setUpcomingCount(upcoming);
        const completed = await getCompletedInterviewsCount(token, userId);
        setCompletedCount(completed);
        const completedList = await fetchUpcomingInterviews(token, userId);
        setCompletedInterviews(completedList);
      } catch {}
      setLoading(false);
    }
    fetchDashboardData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const completedToShow = showAllCompleted
    ? completedInterviews
    : completedInterviews.slice(0, 2);

  const handleVerify = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const storedTokens = localStorage.getItem("authTokens");
      if (!storedTokens) {
        alert("No auth token found!");
        return;
      }
      const token = JSON.parse(storedTokens).idToken;
      const url = `${apiUrl}/api/verification/user/sendOtp/${user.userId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to send OTP");
      }
      window.location.href = `/auth/verify-email?type=primary&email=${encodeURIComponent(
        user.email || ""
      )}`;
    } catch {
      alert("Error sending OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white relative">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome, {user.firstName} 👋
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-emerald-900 text-white shadow-xl transform hover:scale-[1.02] transition-all">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RiMoneyDollarCircleFill className="text-2xl" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalSpent}</p>
            <p className="text-sm text-gray-200">Spent on mock interviews</p>
            <Button variant="secondary" className="mt-3 w-full text-base">
              <Link href="/dashboard/transactions">View Transactions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-indigo-900 text-white shadow-xl transform hover:scale-[1.02] transition-all">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RiCalendarEventFill className="text-2xl" />
              Upcoming Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{upcomingCount}</p>
            <p className="text-sm text-gray-200">Scheduled in the future</p>
            <Button variant="secondary" className="mt-3 w-full text-base">
              <Link href="/dashboard/schedule">Manage Schedule</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-fuchsia-900 text-white shadow-xl transform hover:scale-[1.02] transition-all">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RiCalendarCheckFill className="text-2xl" />
              Completed Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completedCount}</p>
            <p className="text-sm text-gray-200">Interviews you've finished</p>
            <Button variant="secondary" className="mt-3 w-full text-base">
              <Link href="/dashboard/past-sessions">Past Sessions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Interviews</h2>
        {completedToShow.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {completedToShow.map((interview) => (
                <Card
                  key={interview.interviewId}
                  className="bg-gradient-to-br from-[#232946] to-[#2c2f4a] border-none shadow-xl p-4 transform hover:scale-[1.02] transition-all"
                >
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-1">
                      {interview.title ||
                        `Interviewer #${interview.interviewerId}`}
                    </h3>
                    <p className="text-gray-300 text-base">
                      {interview.date} — {interview.startTime}
                    </p>
                    <p
                      className={`text-sm font-bold mt-1 ${
                        interview.status === "COMPLETED"
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {interview.status}
                    </p>
                    <Button
                      className="mt-4 w-full"
                      asChild
                      disabled={!interview.interviewLink}
                    >
                      <a
                        href={interview.interviewLink || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Interview
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            {completedInterviews.length > 2 && (
              <div className="mt-4 text-center">
                <Button
                  variant="secondary"
                  onClick={() => setShowAllCompleted(true)}
                  className="text-base"
                >
                  View More
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 text-lg">No completed interviews yet</p>
        )}
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/home">
            <Button
              variant="secondary"
              className="flex gap-2 items-center w-full text-base"
            >
              Book an Interview
            </Button>
          </Link>
          <Link href="/dashboard/transactions">
            <Button
              variant="secondary"
              className="flex gap-2 items-center w-full text-base"
            >
              <FiTrendingUp className="text-lg" /> View Payments
            </Button>
          </Link>
          <Link href="/profile/edit">
            <Button
              variant="secondary"
              className="flex gap-2 items-center w-full text-base"
            >
              <FiEdit className="text-lg" /> Edit Profile
            </Button>
          </Link>
        </div>
      </div>
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-1 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-28"
          >
            <div className="bg-[#1E2535] rounded-3xl p-8 text-center border border-gray-700 shadow-2xl">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Complete Your Verification
              </h2>
              <p className="text-gray-300 mb-6 text-lg">
                Please verify your primary email address to continue using the
                platform.
              </p>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleVerify}
                  className="w-full bg-green-600 hover:bg-green-700 text-lg font-bold py-3 rounded-xl transition duration-300"
                >
                  Verify Email
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowVerificationModal(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-lg font-bold py-3 rounded-xl transition duration-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {showProfileModal && !showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-1 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-28"
          >
            <div className="bg-[#1E2535] rounded-3xl p-8 text-center border border-gray-700 shadow-2xl w-[500px] h-[350px]">
              <img
                src="/images/interviewee.png"
                alt="Interviewee"
                className="h-40 w-40 mx-auto rounded-full object-cover shadow-2xl mb-4"
              />
              <h2 className="text-2xl font-bold text-white mt-2 mb-2">
                Create Interviewee Profile
              </h2>
              <p className="text-gray-300 mb-4">
                Complete your profile to start booking interviews
              </p>
              <Button
                onClick={() => {
                  setShowProfileModal(false);
                  router.push("/profile/add");
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-lg font-bold py-3 rounded-xl transition duration-300"
              >
                Create Profile
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
