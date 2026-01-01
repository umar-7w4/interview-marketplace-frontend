"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
  View,
  NavigateAction,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

import { Interview } from "@/types/entities";
import { interviewService } from "@/lib/interviewService";

const localizer = momentLocalizer(moment);

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [showAll, setShowAll] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState("");

  const userObj = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : {};
  const token = userObj.idToken || "";
  const userId = userObj.userId || 0;

  useEffect(() => {
    fetchInterviews(currentView, currentDate);
  }, []);

  async function fetchInterviews(view: View, date: Date) {
    try {
      setFeedbackMsg("");
      let data: Interview[] = [];

      if (view === "month") {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        data = await interviewService.getInterviewsByMonth(
          token,
          year,
          month,
          userId
        );
      } else if (view === "week") {
        const startOfWeek = moment(date).startOf("week").format("YYYY-MM-DD");
        const endOfWeek = moment(date).endOf("week").format("YYYY-MM-DD");
        data = await interviewService.getInterviewsByWeek(
          token,
          startOfWeek,
          endOfWeek,
          userId
        );
      } else if (view === "day") {
        const dateString = moment(date).format("YYYY-MM-DD");
        data = await interviewService.getInterviewsByDate(
          token,
          dateString,
          userId
        );
      }
      setInterviews(data);
    } catch (err) {
      console.error("Error fetching interviews:", err);
      setFeedbackMsg("Failed to load interviews for this period.");
    }
  }

  function handleNavigate(
    newDate: Date,
    _view?: View,
    _action?: NavigateAction
  ) {
    setCurrentDate(newDate);
    // Re-fetch for the same currentView
    fetchInterviews(currentView, newDate);
  }

  function handleViewChange(newView: View) {
    setCurrentView(newView);
    fetchInterviews(newView, currentDate);
  }

  function handleSelectEvent(event: {
    interviewId: number;
    title: string;
    status: string;
  }) {
    setFeedbackMsg(`Interview #${event.interviewId} selected`);
  }

  async function handleCancelInterview(id: number) {
    if (!confirm("Are you sure you want to cancel this interview?")) return;
    try {
      await interviewService.cancelInterview(token, id, "Canceled from UI");
      toast.success("Interview canceled");
      // Re-fetch
      fetchInterviews(currentView, currentDate);
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel interview");
    }
  }

  async function handleRescheduleInterview(id: number) {
    const updated: Interview = {
      interviewId: id,
      date: "2025-12-25",
      startTime: "09:00:00",
      endTime: "10:00:00",
      duration: "PT1H",
      status: "BOOKED",
      title: "Rescheduled from UI",
      interviewLink: "https://zoom.us/rescheduled",
    };
    try {
      await interviewService.rescheduleInterview(token, id, updated);
      toast.success("Interview rescheduled");
      fetchInterviews(currentView, currentDate);
    } catch (err) {
      console.error("Reschedule error:", err);
      toast.error("Failed to reschedule interview");
    }
  }

  const events = interviews.map((int) => {
    // Force parse date with T00:00:00 for time zone safety
    const dateObj = new Date(`${int.date}T00:00:00`);
    const [sh, sm] = int.startTime.split(":");
    const [eh, em] = (int.endTime || "00:00").split(":");

    const start = new Date(dateObj);
    start.setHours(Number(sh), Number(sm), 0, 0);

    const end = new Date(dateObj);
    end.setHours(Number(eh), Number(em), 0, 0);

    return {
      title: int.title || "Interview",
      start,
      end,
      interviewId: int.interviewId,
      status: int.status,
    };
  });

  const displayedInterviews = showAll ? interviews : interviews.slice(0, 2);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white mt-8">
      {feedbackMsg && (
        <div className="mb-4 text-center font-bold text-green-400">
          {feedbackMsg}
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-8">Manage Schedule</h1>

      <Card className="bg-gradient-to-br from-[#4b145b] text-white shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Schedule Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: "600px" }}>
            <Calendar
              localizer={localizer}
              events={events}
              date={currentDate}
              view={currentView}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%", backgroundColor: "transparent" }}
              eventPropGetter={(event) => {
                let backgroundColor = "#4a0072";
                if (event.status === "BOOKED") {
                  backgroundColor = "#34D399";
                } else if (event.status === "DONE") {
                  backgroundColor = "#3B82F6";
                } else if (event.status === "CANCELLED") {
                  backgroundColor = "#EF4444";
                }
                return {
                  style: {
                    backgroundColor,
                    color: "#fff",
                    borderRadius: "4px",
                    border: "none",
                  },
                };
              }}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-center mb-4">
        {currentView.toUpperCase()} Interviews
      </h2>

      {interviews.length === 0 ? (
        <p className="text-center text-gray-400 text-lg mb-4">
          No interviews in this {currentView} range
        </p>
      ) : (
        <>
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedInterviews.map((int) => (
              <motion.div
                key={int.interviewId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-[#232946] to-[#2c2f4a] p-8 rounded-lg shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-1">
                  {int.title || `Interview #${int.interviewId}`}
                </h3>
                <p className="text-gray-300">
                  Time: {int.startTime} - {int.endTime || "???"}
                </p>
                <p
                  className={`text-sm mt-1 font-bold ${
                    int.status === "BOOKED"
                      ? "text-green-400"
                      : int.status === "DONE"
                      ? "text-blue-400"
                      : "text-red-400"
                  }`}
                >
                  {int.status}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleCancelInterview(int.interviewId!)}
                    className="text-base flex gap-1 items-center"
                  >
                    <FiTrash2 />
                    Cancel
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleRescheduleInterview(int.interviewId!)}
                    className="text-base flex gap-1 items-center"
                  >
                    <FiEdit />
                    Reschedule
                  </Button>
                  {int.interviewLink && (
                    <Button
                      asChild
                      className="text-base flex gap-1 items-center"
                    >
                      <a
                        href={int.interviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join
                      </a>
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {interviews.length > 2 && (
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
        </>
      )}
    </div>
  );
}
