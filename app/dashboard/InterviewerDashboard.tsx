"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RiCalendarEventFill,
  RiMoneyDollarCircleFill,
  RiStarFill,
} from "react-icons/ri";
import { FiClock, FiTrendingUp, FiEdit } from "react-icons/fi";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  getInterviewerDashboardData,
  InterviewerDashboardData,
} from "@/lib/dashboardService";
import { doesInterviewerProfileExist } from "@/lib/profileService";
import { Interview } from "@/types/entities";

export default function InterviewerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] =
    useState<InterviewerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isWorkEmailVerified, setIsWorkEmailVerified] = useState(true);
  const [showAllInterviews, setShowAllInterviews] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const stored = localStorage.getItem("user");
    if (!stored) {
      setLoading(false);
      return;
    }
    const parsed = JSON.parse(stored);
    setIsEmailVerified(parsed.emailVerified);
    setIsWorkEmailVerified(parsed.workEmailVerified);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    async function checkProfileAndVerification() {
      if (!user) return;
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const token = parsed.idToken;
      if (!token) return;

      try {
        const exists = await doesInterviewerProfileExist(token, user.userId);
        if (!exists) {
          setShowProfileModal(true);
        } else {
          if (!parsed.emailVerified || !parsed.workEmailVerified) {
            setShowVerificationModal(true);
          }
        }
      } catch {
        setShowProfileModal(true);
      }
    }
    checkProfileAndVerification();
  }, [user]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const localUser = localStorage.getItem("user");
        if (!localUser) return;
        const token = JSON.parse(localUser).idToken;
        const data = await getInterviewerDashboardData(token, user.userId);
        setDashboardData(data);
      } catch {}
      setLoading(false);
    }
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const allInterviews = dashboardData?.upcomingInterviews || [];
  const interviewsToShow = showAllInterviews
    ? allInterviews
    : allInterviews.slice(0, 2);

  const handleVerify = async (type: "primary" | "work") => {
    try {
      const storedTokens = localStorage.getItem("authTokens");
      if (!storedTokens) {
        alert("No auth token found!");
        return;
      }
      const token = JSON.parse(storedTokens).idToken;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const url =
        type === "primary"
          ? `${apiUrl}/api/verification/user/sendOtp/${user?.userId}`
          : `${apiUrl}/api/verification/sendOtp/${user?.userId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      const email =
        type === "primary"
          ? encodeURIComponent(user?.email || "")
          : encodeURIComponent(user?.workEmail || "");
      window.location.href = `/auth/verify-email?type=${type}&email=${email}`;
    } catch {
      alert("Error sending OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-dark text-white relative">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome, {user?.firstName} 👋
      </h1>

      {}
      <div className="bg-dark grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-emerald-900 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RiMoneyDollarCircleFill className="text-2xl" />
              Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              ${dashboardData?.totalEarnings}
            </p>
            <p className="text-sm text-gray-200">Total earned this month</p>
            <Button variant="secondary" className="mt-3 w-full text-base">
              <Link href="/dashboard/transactions">View Transactions</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-indigo-900 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RiCalendarEventFill className="text-2xl" />
              Scheduled Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {dashboardData?.scheduledInterviewsCount}
            </p>
            <p className="text-sm text-gray-200">Total interviews scheduled</p>
            <Button variant="secondary" className="mt-3 w-full text-base">
              <Link href="/dashboard/schedule">Manage Schedule</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-900 text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RiStarFill className="text-2xl" />
              Your Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {dashboardData?.averageRating?.toFixed(1)} ⭐
            </p>
            <p className="text-sm text-gray-200">
              Based on interviewee feedback
            </p>
            <Button variant="secondary" className="mt-3 w-full text-base">
              <Link href="/dashboard/feedbacks">View Feedbacks</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Interviews</h2>
        {interviewsToShow.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interviewsToShow.map((interview: Interview) => (
                <div
                  key={interview.interviewId}
                  className="bg-gradient-to-br from-[#232946] to-[#2c2f4a] p-4 border-none shadow-xl rounded-lg transform hover:scale-[1.02] transition-all"
                >
                  <h3 className="text-xl font-semibold mb-1">
                    {interview.title || `#${interview.intervieweeId}`}
                  </h3>
                  <p className="text-gray-300 text-base">
                    {interview.date} — {interview.startTime}
                  </p>
                  <p
                    className={`text-sm font-bold mt-1 ${
                      interview.status === "BOOKED"
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
                </div>
              ))}
            </div>
            {allInterviews.length > 2 && (
              <div className="mt-4 text-center">
                <Button
                  variant="secondary"
                  onClick={() => setShowAllInterviews(!showAllInterviews)}
                  className="text-base"
                >
                  {showAllInterviews ? "Show Less" : "View More"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400 text-lg">No upcoming interviews</p>
        )}
      </div>

      {}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/availability">
            <Button className="flex gap-2 items-center w-full text-base">
              <FiClock className="text-lg" /> Manage Availability
            </Button>
          </Link>
          <Link href="/dashboard/transactions">
            <Button className="flex gap-2 items-center w-full text-base">
              <FiTrendingUp className="text-lg" /> View Earnings
            </Button>
          </Link>
          <Link href="/profile/edit">
            <Button className="flex gap-2 items-center w-full text-base">
              <FiEdit className="text-lg" /> Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-1 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 mb-28"
          >
            <div className="bg-[#1E2535] rounded-3xl p-8 text-center border border-gray-700 shadow-2xl w-[500px] h-[350px]">
              <img
                src="/images/interviewer.png"
                alt="Interviewer"
                className="h-40 w-40 mx-auto rounded-full object-cover shadow-2xl mb-4"
              />
              <h2 className="text-2xl font-bold text-white mb-2">
                Create Interviewer Profile
              </h2>
              <p className="text-gray-300 mb-4">
                Complete your profile to start conducting interviews
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

      {}
      {!showProfileModal && showVerificationModal && (
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
                Please verify your primary and work email addresses to continue
                using the platform.
              </p>
              <div className="flex flex-col gap-4">
                {!isEmailVerified && (
                  <Button
                    onClick={() => handleVerify("primary")}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg font-bold py-3 rounded-xl transition duration-300"
                  >
                    Verify Email
                  </Button>
                )}
                {!isWorkEmailVerified && (
                  <Button
                    onClick={() => handleVerify("work")}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg font-bold py-3 rounded-xl transition duration-300"
                  >
                    Verify Work Email
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
