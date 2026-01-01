"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import userImage from "@/images/user.png";
import Calendar from "@/components/ui/calendar";
import {
  fetchInterviewerDto,
  fetchAvailability,
  fetchUserById,
} from "@/lib/interviewService";
import { InterviewerDto, Availability, IntervieweeDto } from "@/types/entities";
import { InterviewerSkills } from "@/components/InterviewerSkills";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { getUserFeedback } from "@/lib/feedbackService";

type UserEntity = {
  userId: number;
  fullName: string;
  profilePictureUrl?: string;
};
type BookingDetails = {
  interviewerName: string;
  intervieweeName: string;
  slotTiming: string;
  slotDate: string;
  sessionRate: number;
  platformFee: number;
  tax: number;
  additional: number;
  totalCost: number;
};

export default function InterviewerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const interviewerId = Number(params.id);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [interviewer, setInterviewer] = useState<InterviewerDto | null>(null);
  const [userInfo, setUserInfo] = useState<UserEntity | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Availability[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 10 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.21 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-5 h-5" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="gray" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGrad)"
            className="text-yellow-400"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.21 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
          />
        </svg>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.21 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z"
          />
        </svg>
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    return feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length;
  }, [feedbacks]);

  useEffect(() => {
    async function loadInterviewer() {
      try {
        setLoading(true);
        const data = await fetchInterviewerDto(interviewerId);
        setInterviewer(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (interviewerId) loadInterviewer();
  }, [interviewerId]);

  useEffect(() => {
    if (!interviewer) return;
    async function loadUser() {
      try {
        const data = await fetchUserById(interviewer.userId);
        setUserInfo(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadUser();
  }, [interviewer]);

  useEffect(() => {
    async function loadSlots() {
      try {
        const data = await fetchAvailability(interviewerId, selectedDate);
        setSlots(data);
        setSelectedSlot(null);
      } catch (error) {
        console.error(error);
      }
    }
    if (interviewerId && selectedDate) loadSlots();
  }, [interviewerId, selectedDate]);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        const stored = localStorage.getItem("user");
        if (stored && interviewer) {
          const idToken = JSON.parse(stored).idToken;
          const feedbackData = await getUserFeedback(
            idToken,
            interviewer.userId
          );
          setFeedbacks(feedbackData);
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (interviewer) {
      fetchFeedbacks();
    }
  }, [interviewer]);

  const handleSlotClick = (slot: Availability) => {
    if (slot.status === "AVAILABLE") setSelectedSlot(slot);
  };

  const createBooking = async () => {
    if (!selectedSlot || !interviewer) return;
    const interviewerName = userInfo?.fullName || "Unknown";
    const intervieweeName = user?.fullName || "Guest";
    const slotTiming = `${selectedSlot.startTime.slice(
      0,
      5
    )} - ${selectedSlot.endTime.slice(0, 5)}`;
    const slotDate = selectedDate.toISOString().split("T")[0];
    const sessionRate = interviewer.sessionRate;
    const platformFee = sessionRate * 0.1;
    const tax = sessionRate * 0.05;
    const additional = 5;
    const totalCost = sessionRate + platformFee + tax + additional;
    setBookingDetails({
      interviewerName,
      intervieweeName,
      slotTiming,
      slotDate,
      sessionRate,
      platformFee,
      tax,
      additional,
      totalCost,
    });
    setShowBookingModal(true);
  };

  const handleProceedToBook = () => {
    if (!selectedSlot) return;
    createBooking();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#15192e] to-[#0c0f1c] flex items-center justify-center">
        <p className="text-white text-xl">Loading interviewer data...</p>
      </div>
    );
  }
  if (!interviewer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#15192e] to-[#0c0f1c] flex items-center justify-center">
        <p className="text-white text-xl">Interviewer not found.</p>
      </div>
    );
  }
  const fullName = userInfo?.fullName || "Unknown";
  const ratingValue =
    interviewer.averageRating != null ? interviewer.averageRating : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white p-8 mt-20">
      <div className="max-w-full mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 bg-gradient-to-br from-[#1a0d3f] p-8 rounded-2xl shadow-2xl border border-gray-700">
          <div className="flex flex-col items-center mb-8">
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl mb-4">
              <img
                src={interviewer.profileImage || "/default-user-icon.png"}
                alt={fullName}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = userImage.src;
                }}
                width={160}
                height={160}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-4xl font-extrabold">{fullName}</h1>
            {interviewer.isVerified && (
              <p className="text-lg text-green-400 font-bold mt-2">Verified</p>
            )}
          </div>
          {interviewer.linkedinUrl && (
            <div className="flex justify-center">
              <a
                href={
                  interviewer.linkedinUrl.startsWith("http")
                    ? interviewer.linkedinUrl
                    : `https://${interviewer.linkedinUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center px-6 py-3 mb-6 border border-transparent text-lg font-bold rounded-full bg-[#0a66c2] text-white shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
              >
                <span className="absolute left-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11.75 19h-2.5v-9h2.5v9zm-1.25-10.285c-.828 0-1.5-.671-1.5-1.5s.672-1.5 1.5-1.5c.829 0 1.5.672 1.5 1.5 0 .829-.671 1.5-1.5 1.5zm12.25 10.285h-2.5v-4.604c0-1.098-.021-2.507-1.527-2.507-1.528 0-1.762 1.17-1.762 2.428v4.683h-2.5v-9h2.4v1.235h.034c.335-.635 1.155-1.308 2.376-1.308 2.541 0 3.009 1.672 3.009 3.847v5.226z" />
                  </svg>
                </span>
                <span className="ml-8">View LinkedIn</span>
              </a>
            </div>
          )}
          <div className="space-y-4 text-gray-300 text-lg">
            {interviewer.bio && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">Bio:</span>
                <span>{interviewer.bio}</span>
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white">Experience:</span>
              <span>
                {interviewer.yearsOfExperience}{" "}
                {interviewer.yearsOfExperience === 1 ? "year" : "years"} of
                experience
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white">Session Rate:</span>
              <span className="text-emerald-400 font-bold">
                ${interviewer.sessionRate} / session
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white">Rating:</span>
              <span>{ratingValue.toFixed(1)} / 5</span>
            </div>
            {interviewer.currentCompany && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">Company:</span>
                <span>{interviewer.currentCompany}</span>
              </div>
            )}
            {interviewer.timezone && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">Timezone:</span>
                <span>{interviewer.timezone}</span>
              </div>
            )}
            {interviewer.certifications &&
              interviewer.certifications.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">Certifications:</span>
                  <span>{interviewer.certifications.join(", ")}</span>
                </div>
              )}
            {interviewer.skills && interviewer.skills.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">Skills:</span>
                <InterviewerSkills
                  interviewerId={
                    interviewer.interviewerId || interviewer.userId
                  }
                />
              </div>
            )}
            {interviewer.languagesSpoken &&
              interviewer.languagesSpoken.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white">Languages:</span>
                  <span>{interviewer.languagesSpoken.join(", ")}</span>
                </div>
              )}
          </div>
        </div>
        <div className="lg:w-1/2 flex-1 bg-gradient-to-r from-[#1a0d3f] p-8 rounded-2xl shadow-2xl border border-gray-700 flex flex-col">
          <h2 className="text-3xl font-bold mb-6">Select a Date &amp; Time</h2>
          <div className="mb-8 bg-gray-800 p-6 rounded-2xl shadow-inner">
            <Calendar
              selectedDate={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
            />
          </div>
          <div className="flex flex-wrap gap-4 flex-1">
            {slots.length === 0 ? (
              <p className="text-gray-400 text-2xl">
                No availability for selected date.
              </p>
            ) : (
              slots.map((slot) => {
                const isBlocked =
                  slot.status === "BOOKED" || slot.status === "CANCELLED";
                const isSelected =
                  selectedSlot?.availabilityId === slot.availabilityId;
                return (
                  <div
                    key={slot.availabilityId}
                    onClick={() => handleSlotClick(slot)}
                    className={`cursor-pointer w-18 h-10 px-4 py-2 rounded-lg border border-gray-600 transition-all duration-300 ${
                      isBlocked
                        ? "text-gray-500 line-through"
                        : isSelected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-gray-800 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                  </div>
                );
              })
            )}
          </div>
          <Button
            onClick={handleProceedToBook}
            disabled={!selectedSlot}
            className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-2xl font-bold py-4"
          >
            Proceed to Book
          </Button>
        </div>
      </div>
      {showBookingModal && bookingDetails && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-70 pt-40">
          <div className="bg-gray-900 text-white rounded-2xl p-10 max-w-3xl w-full shadow-2xl">
            <h2 className="text-3xl font-bold mb-6 border-b pb-4">
              Booking Details
            </h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Interviewer:</span>
                    <span>{bookingDetails.interviewerName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Interviewee:</span>
                    <span>{bookingDetails.intervieweeName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Slot Timing:</span>
                    <span>{bookingDetails.slotTiming}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Slot Date:</span>
                    <span>{bookingDetails.slotDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-4 text-lg">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Session Rate:</span>
                    <span>${bookingDetails.sessionRate.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Platform Fee (10%):</span>
                    <span>${bookingDetails.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Tax (5%):</span>
                    <span>${bookingDetails.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-bold">Additional:</span>
                    <span>${bookingDetails.additional.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end pt-4">
                    <span className="text-2xl font-bold">
                      Total: ${bookingDetails.totalCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end text-xl mt-8 gap-6">
              <Button
                onClick={async () => {
                  try {
                    const tokenStr = localStorage.getItem("authTokens");
                    const token = tokenStr ? JSON.parse(tokenStr).idToken : "";
                    if (!token) throw new Error("Authorization token missing");
                    const baseUrl =
                      process.env.NEXT_PUBLIC_API_URL ||
                      "http://localhost:8080/api";
                    const intervieweeRes = await axios.get<IntervieweeDto>(
                      `${baseUrl}/interviewees/user/${user?.userId}`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const bookingDto = {
                      intervieweeId: intervieweeRes.data.intervieweeId,
                      availabilityId: selectedSlot?.availabilityId,
                      bookingDate: selectedDate.toISOString().split("T")[0],
                      totalPrice: bookingDetails.totalCost,
                      paymentStatus: "PENDING",
                    };
                    const registerRes = await fetch(
                      `${baseUrl}/bookings/register`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(bookingDto),
                      }
                    );
                    if (!registerRes.ok)
                      throw new Error("Failed to register booking");
                    const { bookingId, totalPrice } = await registerRes.json();
                    const paymentRes = await fetch(
                      `${baseUrl}/payments/create-checkout-session?bookingId=${bookingId}&amount=${totalPrice}`,
                      {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    if (!paymentRes.ok)
                      throw new Error("Failed to create checkout session");
                    const redirectUrl = await paymentRes.text();
                    if (!redirectUrl)
                      throw new Error("No redirect URL returned");
                    window.location.href = redirectUrl;
                  } catch (error) {
                    console.error(
                      "Error during booking/payment process:",
                      error
                    );
                    alert(
                      "An error occurred while processing your booking. Please try again."
                    );
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-2xl font-bold px-6 py-3"
              >
                Proceed to Pay
              </Button>
            </div>
          </div>
        </div>
      )}
      <section className="mt-16">
        {feedbacks.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gradient-to-r from-purple-950 to-indigo-900 p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 text-4xl">★</span>
                <h3 className="text-3xl font-bold text-white">
                  Overall Rating
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-5xl font-extrabold text-[#6366f1]">
                  {averageRating.toFixed(1)}
                </span>
                <div>{renderStars(averageRating)}</div>
              </div>
              <p className="mt-2 text-lg text-gray-300">
                Based on {feedbacks.length}{" "}
                {feedbacks.length === 1 ? "feedback" : "feedbacks"}
              </p>
            </div>
          </div>
        )}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white">Testimonials</h2>
          <p className="text-gray-400 mt-2">
            Hear what other interviewees have to say
          </p>
        </div>
        {feedbacks.length === 0 ? (
          <p className="text-center text-gray-400 text-2xl">
            No feedback available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {feedbacks.map((feedback, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center gap-2">
                  {}
                  <div className="flex items-center mb-4">
                    {renderStars(feedback.rating)}
                  </div>
                  <span className="text-xl font-semibold pl-2 mb-4">
                    {feedback.rating}/10
                  </span>
                </div>

                {feedback.comments && (
                  <p className="text-lg text-gray-300 italic mb-4">
                    “{feedback.comments}”
                  </p>
                )}
                {feedback.positives && (
                  <div className="mb-2">
                    <p className="text-gray-400">
                      <span className="font-semibold text-green-400">
                        Positives:
                      </span>{" "}
                      {feedback.positives}
                    </p>
                  </div>
                )}
                {feedback.negatives && (
                  <div className="mb-2">
                    <p className="text-gray-400">
                      <span className="font-semibold text-red-400">
                        Negatives:
                      </span>{" "}
                      {feedback.negatives}
                    </p>
                  </div>
                )}
                {feedback.improvements && (
                  <div className="mb-2">
                    <p className="text-gray-400">
                      <span className="font-semibold text-blue-400">
                        Improvements:
                      </span>{" "}
                      {feedback.improvements}
                    </p>
                  </div>
                )}
                <div className="mt-4 border-t border-gray-700 pt-2">
                  <p className="text-sm text-gray-500">
                    Feedback by {feedback.giverName} on{" "}
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
