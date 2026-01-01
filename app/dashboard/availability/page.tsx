"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Select from "@/components/ui/select";
import TimePicker from "@/components/ui/time-picker";
import { toast } from "react-hot-toast";
import { InterviewerDto, IAvailability } from "@/types/entities";
import { RiSearchLine } from "react-icons/ri";
import { FiClock, FiTrash2, FiEdit } from "react-icons/fi";
import { RiCalendarEventFill } from "react-icons/ri";

import {
  createAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailabilities, // Now fetches from /api/availabilities/filter
  getInterviewerByUserId,
} from "@/lib/availabilityService";

import { timezones } from "@/constants/options";

export default function ManageAvailability() {
  const { user } = useAuth();

  const [availabilities, setAvailabilities] = useState<IAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [interviewerId, setInterviewerId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterTimeZone, setFilterTimeZone] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartTime, setFilterStartTime] = useState("");
  const [filterEndTime, setFilterEndTime] = useState("");
  const [showAll, setShowAll] = useState(false);

  const totalAvailabilities = availabilities.length;

  const months = [
    { label: "January", value: 0 },
    { label: "February", value: 1 },
    { label: "March", value: 2 },
    { label: "April", value: 3 },
    { label: "May", value: 4 },
    { label: "June", value: 5 },
    { label: "July", value: 6 },
    { label: "August", value: 7 },
    { label: "September", value: 8 },
    { label: "October", value: 9 },
    { label: "November", value: 10 },
    { label: "December", value: 11 },
  ];
  const years = [];
  for (let y = 2025; y <= 2100; y++) {
    years.push(y);
  }

  useEffect(() => {
    if (user?.userId) {
      fetchInterviewer(user.userId);
    }
    setSelectedDate(new Date()); // fix hydration mismatch
  }, [user?.userId]);

  async function fetchInterviewer(userId: number) {
    try {
      const interviewer = (await getInterviewerByUserId(
        userId
      )) as InterviewerDto;
      setInterviewerId(interviewer.interviewerId ?? null);
    } catch (error) {
      console.error("Failed to fetch interviewer:", error);
    }
  }

  async function fetchFilteredAvailabilities() {
    try {
      const data = await getAvailabilities({
        startDate: filterStartDate || undefined,
        endDate: filterEndDate || undefined,
        startTime: filterStartTime || undefined,
        endTime: filterEndTime || undefined,
        timezone: filterTimeZone || undefined,
        status: filterStatus || undefined,
      });
      setAvailabilities(data);
    } catch (error) {
      console.error("Failed to fetch availabilities with filters:", error);
    }
  }

  useEffect(() => {
    // On first load, no filters => fetch all from the server
    fetchFilteredAvailabilities();
  }, []);

  function resetForm() {
    setSelectedDate(new Date());
    setMonth(new Date().getMonth());
    setYear(new Date().getFullYear());
    setStartTime("");
    setEndTime("");
    setTimezone("America/New_York");
    setEditingId(null);
  }

  async function handleSave() {
    if (!startTime || !endTime) {
      toast.error("Please select start and end time.");
      return;
    }
    if (!interviewerId) {
      toast.error("Interviewer ID is required.");
      return;
    }
    if (!selectedDate) {
      toast.error("Please select a date.");
      return;
    }

    const availabilityData = {
      interviewerId,
      date: selectedDate.toISOString().split("T")[0],
      startTime,
      endTime,
      status: "AVAILABLE",
      timezone,
    };

    setLoading(true);
    try {
      if (editingId) {
        await updateAvailability(editingId, availabilityData);
        toast.success("Availability updated successfully!");
        setFeedbackMessage("Your availability was updated successfully!");
      } else {
        await createAvailability(availabilityData);
        toast.success("Availability added successfully!");
        setFeedbackMessage("Your availability was added successfully!");
      }
      resetForm();
      await fetchFilteredAvailabilities();
    } catch (error) {
      toast.error("Failed to save availability. Try again.");
      setFeedbackMessage("Failed to save availability. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(avail: IAvailability) {
    setEditingId(avail.availabilityId);
    const dateParts = avail.date.split("-");
    const dateObj = new Date(
      Number(dateParts[0]),
      Number(dateParts[1]) - 1,
      Number(dateParts[2])
    );
    setSelectedDate(dateObj);
    setMonth(dateObj.getMonth());
    setYear(dateObj.getFullYear());
    setStartTime(avail.startTime?.trim() || "00:00");
    setEndTime(avail.endTime?.trim() || "00:00");
    setTimezone(avail.timezone);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this availability?")) return;
    try {
      await deleteAvailability(id);
      toast.success("Availability deleted successfully!");
      setFeedbackMessage("Availability deleted successfully!");
      await fetchFilteredAvailabilities();
    } catch (error) {
      toast.error("Failed to delete availability.");
      setFeedbackMessage("Failed to delete availability.");
    }
  }

  function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newMonth = Number(e.target.value);
    setMonth(newMonth);
    const updatedDate = new Date(year, newMonth, selectedDate?.getDate() || 1);
    setSelectedDate(updatedDate);
  }

  function handleYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newYear = Number(e.target.value);
    setYear(newYear);
    const updatedDate = new Date(newYear, month, selectedDate?.getDate() || 1);
    setSelectedDate(updatedDate);
  }

  async function applyServerFilters() {
    await fetchFilteredAvailabilities();
  }

  const displayedAvailabilities = showAll
    ? availabilities
    : availabilities.slice(0, 2);

  return (
    <div className="mt-20 min-h-screen px-6 py-10 bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white">
      {feedbackMessage && (
        <div className="mb-4 text-center font-bold text-green-400">
          {feedbackMessage}
        </div>
      )}
      <h1 className="text-4xl font-bold text-center mb-8">
        Manage Availability, {user?.firstName} 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card #1: Create or Update Availability */}
        <Card className="bg-gradient-to-r from-[#1a0b33] to-[#4a0072] text-white shadow-xl transform hover:scale-[1.02] transition-all">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FiClock className="text-2xl" />
              {editingId ? "Update Availability" : "Add Availability"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200 text-sm mb-2 text-center">
              Select a date & time slot to create or update availability.
            </p>
            <div className="flex gap-2 justify-center items-center mb-4">
              <select
                className="rounded-md bg-[#1E2535] text-white p-2"
                value={month}
                onChange={handleMonthChange}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                className="rounded-md bg-[#1E2535] text-white p-2"
                value={year}
                onChange={handleYearChange}
              >
                {years.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center items-center">
              <DayPicker
                mode="single"
                selected={selectedDate || new Date()}
                onSelect={(day) => day && setSelectedDate(day)}
                month={new Date(year, month)}
                className="bg-[#1E2535] p-4 rounded-lg shadow-lg"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={setStartTime}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={setEndTime}
              />
            </div>
            <div>
              <p className="mt-3 font-bold">Timezone</p>
              <Select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-4 pt-2 pb-2 pr-2 pl-2 bg-[#1E2535] rounded-md"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="mt-4 w-full text-base"
              variant="secondary"
            >
              {loading
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                ? "Update Availability"
                : "Add Availability"}
            </Button>
          </CardContent>
        </Card>

        {}
        <Card className="bg-gradient-to-r from-[#1a0d3f] to-[#5b21b6] text-white shadow-xl transform hover:scale-[1.02] transition-all">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <RiSearchLine className="text-2xl" />
              Filter Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{availabilities.length}</p>
            <p className="text-sm text-gray-300">
              Currently loaded availability slots
            </p>
          </CardContent>
          <CardContent>
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
            <div className="flex flex-col gap-2 mb-3">
              <label className="font-semibold">Timezone</label>
              <Select
                value={filterTimeZone}
                onChange={(e) => setFilterTimeZone(e.target.value)}
                className="bg-[#1E2535] text-white p-2 rounded-md"
              >
                <option value="">All Timezones</option>
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <label className="font-semibold">Status</label>
              <select
                className={`rounded-md p-2 text-white transition-all duration-300 
                  ${
                    filterStatus === "AVAILABLE"
                      ? "bg-green-600"
                      : filterStatus === "BOOKED"
                      ? "bg-yellow-600"
                      : filterStatus === "EXPIRED"
                      ? "bg-red-600"
                      : "bg-[#1E2535]"
                  }`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="" className="bg-[#1E2535]">
                  All
                </option>
                <option value="AVAILABLE" className="bg-green-600">
                  Available
                </option>
                <option value="BOOKED" className="bg-yellow-600">
                  Booked
                </option>
                <option value="EXPIRED" className="bg-red-600">
                  Expired
                </option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                className="w-full text-base"
                onClick={applyServerFilters}
              >
                Apply Filters
              </Button>
              <Button
                variant="secondary"
                className="w-full text-base"
                onClick={() => {
                  setFilterStartDate("");
                  setFilterEndDate("");
                  setFilterStartTime("");
                  setFilterEndTime("");
                  setFilterTimeZone("");
                  setFilterStatus("");
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">
          Your Filtered Availabilities
        </h2>
        {displayedAvailabilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedAvailabilities.map((avail) => (
              <motion.div
                key={avail.availabilityId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gradient-to-br from-[#232946] to-[#2c2f4a] border-none shadow-xl p-4 transform hover:scale-[1.02] transition-all">
                  <CardContent>
                    <h3 className="text-xl font-semibold mb-1">{avail.date}</h3>
                    <p className="text-gray-300 text-base">
                      {avail.startTime} — {avail.endTime}
                    </p>
                    <p className="text-sm text-gray-200 mt-1">
                      Timezone: {avail.timezone}
                    </p>
                    <p
                      className={`text-sm font-bold mt-1 ${
                        avail.status === "BOOKED"
                          ? "text-green-400"
                          : avail.status === "EXPIRED"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {avail.status}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="secondary"
                        className="flex gap-1 items-center"
                        onClick={() => handleEdit(avail)}
                      >
                        <FiEdit />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex gap-1 items-center"
                        onClick={() => handleDelete(avail.availabilityId)}
                      >
                        <FiTrash2 />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-lg">
            No availabilities found with the given filters
          </p>
        )}
        {availabilities.length > 2 && (
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
