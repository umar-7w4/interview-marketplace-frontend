"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Select from "@/components/ui/select";
import TimePicker from "@/components/ui/time-picker";
import { toast } from "react-hot-toast";
import { RiSearchLine } from "react-icons/ri";

import { Interview } from "@/types/entities";
import { getPastSessionsForInterviewee } from "@/lib/interviewService";
import { checkFeedback } from "@/lib/feedbackService"; // <-- (New) For checking existing feedback
import { OptionType, timezones } from "@/constants/options";
import Link from "next/link";

export default function PastSessionsPage() {
  const [userId, setUserId] = useState<number | null>(null);

  const [sessions, setSessions] = useState<Interview[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterStartTime, setFilterStartTime] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");
  const [filterTimeZone, setFilterTimeZone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [feedbackMap, setFeedbackMap] = useState<
    Record<number, { hasFeedback: boolean; feedbackId?: number }>
  >({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const rawTokens = localStorage.getItem("authTokens");

    if (storedUser && rawTokens) {
      const parsedUser = JSON.parse(storedUser);
      const uid = parsedUser.userId;

      const parsedTokens = JSON.parse(rawTokens);
      const token = parsedTokens.idToken;

      if (uid && token) {
        setUserId(uid);
        fetchSessionsAndFeedback(uid, token);
      } else {
        toast.error("User ID or ID token missing");
      }
    } else {
      toast.error("User or authentication token not found");
    }
  }, []);

  async function fetchSessionsAndFeedback(uid: number, token: string) {
    try {
      const data = await getPastSessionsForInterviewee(token, uid);
      setSessions(data);

      const tempMap: Record<
        number,
        { hasFeedback: boolean; feedbackId?: number }
      > = {};
      for (const interview of data) {
        const existing = await checkFeedback(token, interview.interviewId, uid);
        if (existing) {
          tempMap[interview.interviewId] = {
            hasFeedback: true,
            feedbackId: existing.feedbackId,
          };
        } else {
          tempMap[interview.interviewId] = { hasFeedback: false };
        }
      }
      setFeedbackMap(tempMap);
    } catch (err) {
      toast.error("Failed to load past sessions");
      console.error("fetchSessionsAndFeedback error:", err);
    }
  }

  function applyFilters() {
    const sDate = filterStartDate ? new Date(filterStartDate) : null;
    const eDate = filterEndDate ? new Date(filterEndDate) : null;
    const tz = filterTimeZone || null;
    const stTime = filterStartTime || null;
    const enTime = filterEndTime || null;
    const stat = filterStatus || null;

    let filtered = [...sessions];

    if (sDate || eDate) {
      filtered = filtered.filter((sess) => {
        const [yyyy, mm, dd] = sess.date.split("-").map(Number);
        const d = new Date(yyyy, mm - 1, dd);
        if (sDate && d < sDate) return false;
        if (eDate && d > eDate) return false;
        return true;
      });
    }

    if (tz) {
      filtered = filtered.filter((sess) => sess.timezone === tz);
    }

    if (stat) {
      filtered = filtered.filter((sess) => sess.status === stat);
    }

    if (stTime || enTime) {
      filtered = filtered.filter((sess) => {
        const [sh, sm] = sess.startTime.split(":");
        const startMins = Number(sh) * 60 + Number(sm);

        const [eh, em] = (sess.endTime || "0:0").split(":");
        const endMins = Number(eh) * 60 + Number(em);

        let startLimit = 0;
        let endLimit = 24 * 60;
        if (stTime) {
          const [sH, sMi] = stTime.split(":");
          startLimit = Number(sH) * 60 + Number(sMi);
        }
        if (enTime) {
          const [eH, eMi] = enTime.split(":");
          endLimit = Number(eH) * 60 + Number(eMi);
        }
        return startMins >= startLimit && endMins <= endLimit;
      });
    }

    return filtered;
  }

  const filteredSessions = applyFilters();
  const displayedSessions = showAll
    ? filteredSessions
    : filteredSessions.slice(0, 2);

  function resetFilters() {
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterStartTime("");
    setFilterEndTime("");
    setFilterTimeZone("");
    setFilterStatus("");
  }

  return (
    <div className="mt-20 min-h-screen px-6 py-10 bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white">
      {feedbackMessage && (
        <div className="mb-4 text-center font-bold text-green-400">
          {feedbackMessage}
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-8">
        Your Past Sessions
      </h1>

      {}
      <div className="flex justify-center mb-10">
        <Card className="bg-gradient-to-r from-fuchsia-900 text-white shadow-xl transform hover:scale-[1.02] transition-all w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RiSearchLine className="text-2xl" />
              Filter Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{displayedSessions.length}</p>
            <p className="text-sm text-gray-300">
              Currently displayed sessions
            </p>
          </CardContent>

          <CardContent>
            {}
            <div className="flex flex-col gap-2 mb-3">
              <label className="font-semibold">Start Date</label>
              <input
                type="date"
                className="rounded-md bg-[#1E2535] text-white p-2"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <label className="font-semibold">End Date</label>
              <input
                type="date"
                className="rounded-md bg-[#1E2535] text-white p-2"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>

            {}
            <div className="flex flex-col gap-2 mb-3">
              <label className="font-semibold">Start Time</label>
              <TimePicker
                label="Select Start Time"
                value={filterStartTime}
                onChange={setFilterStartTime}
              />
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <label className="font-semibold">End Time</label>
              <TimePicker
                label="Select End Time"
                value={filterEndTime}
                onChange={setFilterEndTime}
              />
            </div>

            {}
            <div className="flex flex-col gap-2 mb-3">
              <label className="font-semibold">Timezone</label>
              <Select
                value={filterTimeZone}
                onChange={(e) => setFilterTimeZone(e.target.value)}
                className="bg-[#1E2535] text-white p-2 rounded-md"
              >
                <option value="">All Timezones</option>
                {timezones.map((tz: OptionType) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </Select>
            </div>

            {}
            <div className="flex flex-col gap-2 mb-3">
              <label className="font-semibold">Status</label>
              <select
                className={`rounded-md p-2 text-white transition-all duration-300
                  ${
                    filterStatus === "COMPLETED"
                      ? "bg-blue-600"
                      : filterStatus === "CANCELLED"
                      ? "bg-red-600"
                      : "bg-[#1E2535]"
                  }
                `}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="" className="bg-[#1E2535]">
                  All
                </option>
                <option value="COMPLETED" className="bg-blue-600">
                  Completed
                </option>
                <option value="CANCELLED" className="bg-red-600">
                  Cancelled
                </option>
              </select>
            </div>

            {}
            <div className="mt-4 text-center">
              <Button
                variant="secondary"
                className="w-full text-base"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Past Interviews</h2>

        {displayedSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedSessions.map((sess) => {
              const fData = feedbackMap[sess.interviewId];
              const hasFeedback = fData?.hasFeedback || false;
              const label = hasFeedback ? "Edit Feedback" : "Give Feedback";
              // If you want to pass feedbackId, you can do ?feedbackId=xxx:
              const linkHref = hasFeedback
                ? `/dashboard/feedbacks/${sess.interviewId}?feedbackId=${fData?.feedbackId}`
                : `/dashboard/feedbacks/${sess.interviewId}`;

              return (
                <motion.div
                  key={sess.interviewId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-[#232946] to-[#2c2f4a] border-none shadow-xl p-4 transform hover:scale-[1.02] transition-all">
                    <CardContent>
                      <h3 className="text-xl font-semibold mb-1">
                        {sess.title || `Interview #${sess.interviewId}`}
                      </h3>
                      <p className="text-gray-300 text-base">
                        {sess.date} — {sess.startTime} to{" "}
                        {sess.endTime || "???"}
                      </p>
                      <p className="text-sm text-gray-200 mt-1">
                        Timezone: {sess.timezone}
                      </p>
                      <p
                        className={`text-sm font-bold mt-1 ${
                          sess.status === "COMPLETED"
                            ? "text-blue-400"
                            : sess.status === "CANCELLED"
                            ? "text-red-400"
                            : "text-gray-400"
                        }`}
                      >
                        {sess.status}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button className="text-base">
                          <Link href={linkHref}>{label}</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">
            No sessions found with the given filters
          </p>
        )}

        {}
        {filteredSessions.length > 2 && (
          <div className="mt-4 text-center">
            <Button
              variant="secondary"
              onClick={() => setShowAll(!showAll)}
              className="text-base"
            >
              {showAll ? "Show Less" : "View More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
