"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserFeedback } from "@/lib/feedbackService";
import { Feedback } from "@/types/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RiStarFill, RiStarHalfFill, RiStarLine } from "react-icons/ri";

function getStarsForRating(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < 10; i++) {
    if (i < fullStars) {
      stars.push(<RiStarFill key={i} className="text-yellow-400 text-2xl" />);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <RiStarHalfFill key={i} className="text-yellow-400 text-2xl" />
      );
    } else {
      stars.push(<RiStarLine key={i} className="text-gray-500 text-2xl" />);
    }
  }
  return stars;
}

export default function FeedbacksPage() {
  const { user } = useAuth();
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeedback() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = JSON.parse(localStorage.getItem("user")!).idToken;
        const data = await getUserFeedback(token, user.userId);

        if (Array.isArray(data)) {
          setFeedbackList(data);
        } else {
          console.warn("Feedback data is not an array:", data);
          setFeedbackList([]);
        }
      } catch (error: any) {
        console.error("Error fetching feedback:", error);
        setFeedbackList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#15192e] text-white">
        Loading feedback...
      </div>
    );
  }

  const totalFeedback = feedbackList.length;
  const averageRating =
    totalFeedback > 0
      ? feedbackList.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
      : 0;

  const summaryStars = getStarsForRating(averageRating);

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white">
      {}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Feedback & Ratings</h1>
        <Link href="/dashboard">
          <Button variant="outline" className="text-base">
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {}
      <Card className="mb-8 bg-gradient-to-r from-purple-950 text-white shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-yellow-400 text-3xl">★</span> {}
            Your Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {}
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-extrabold">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex items-center">{summaryStars}</div>
              </div>
              <p className="text-lg text-gray-100">
                Based on interviewee feedback
              </p>
            </div>
            {}
          </div>
        </CardContent>
      </Card>

      {}
      {totalFeedback === 0 ? (
        <p className="text-gray-400 text-xl">No feedback found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbackList.map((feedback) => {
            const cardStars = getStarsForRating(feedback.rating);

            return (
              <Card
                key={feedback.feedbackId}
                className="bg-gradient-to-br from-[#232946] to-[#2c2f4a] border-none shadow-xl p-4 transform hover:scale-[1.02] transition-all"
              >
                <CardHeader className="pb-2">
                  <CardTitle>
                    <div className="flex items-center gap-2">
                      {}
                      <div className="flex items-center gap-1">{cardStars}</div>
                      <span className="text-xl font-semibold">
                        {feedback.rating}/10
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-lg text-gray-100">
                  {}
                  {feedback.comments && (
                    <p>
                      <span className="font-semibold">Comments:</span>{" "}
                      {feedback.comments}
                    </p>
                  )}
                  {}
                  {feedback.positives && (
                    <p className="text-green-400">
                      <span className="font-semibold">Positives:</span>{" "}
                      {feedback.positives}
                    </p>
                  )}
                  {}
                  {feedback.negatives && (
                    <p className="text-red-400">
                      <span className="font-semibold">Negatives:</span>{" "}
                      {feedback.negatives}
                    </p>
                  )}
                  {}
                  {feedback.improvements && (
                    <p>
                      <span className="font-semibold">Improvements:</span>{" "}
                      {feedback.improvements}
                    </p>
                  )}
                  {/* Date */}
                  <p className="text-sm text-gray-300 pt-2">
                    Created: {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
