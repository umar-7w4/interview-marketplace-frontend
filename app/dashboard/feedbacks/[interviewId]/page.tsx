"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

import {
  createFeedback,
  checkFeedback,
  updateFeedback,
  getFeedbackById,
} from "@/lib/feedbackService";

import {
  getInterviewByIdFeedback,
  getUserIdForInterviewer,
} from "@/lib/interviewService";

import { Feedback, Interview } from "@/types/entities";

export default function FeedbackFormPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const interviewId = Number(params.interviewId);
  const existingFeedbackId = searchParams.get("feedbackId");

  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState("");
  const [positives, setPositives] = useState("");
  const [negatives, setNegatives] = useState("");
  const [improvements, setImprovements] = useState("");

  const [giverId, setGiverId] = useState<number | null>(null);
  const [receiverId, setReceiverId] = useState<number | null>(null);

  const [feedbackId, setFeedbackId] = useState<number | null>(
    existingFeedbackId ? Number(existingFeedbackId) : null
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const authTokens = localStorage.getItem("authTokens");
    if (!storedUser || !authTokens) {
      toast.error("No user or tokens found. Please log in.");
      router.push("/auth/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    const userId = parsedUser.userId;
    if (!userId) {
      toast.error("User ID not found. Cannot proceed.");
      router.push("/dashboard");
      return;
    }
    setGiverId(userId);

    const parsedTokens = JSON.parse(authTokens);
    const token = parsedTokens.idToken;

    getInterviewByIdFeedback(token, interviewId)
      .then((iv: Interview) => getUserIdForInterviewer(token, iv.interviewerId))
      .then((uidForInterviewer: number) => {
        setReceiverId(uidForInterviewer);
      })
      .catch((err) => {
        console.error("Failed to fetch interviewer’s user ID:", err);
        toast.error("Cannot determine interviewer user ID");
        router.push("/dashboard");
      });

    if (existingFeedbackId) {
      const fbIdNum = Number(existingFeedbackId);
      fetchFeedbackById(token, fbIdNum);
    } else {
      checkFeedback(token, interviewId, userId)
        .then((found) => {
          if (found) {
            setFeedbackId(found.feedbackId!);
            fillFormWithExisting(found);
          }
        })
        .catch((err) => {
          console.error("Failed to check existing feedback:", err);
        });
    }
  }, [interviewId, router, existingFeedbackId]);

  async function fetchFeedbackById(token: string, fbId: number) {
    try {
      const existing = await getFeedbackById(token, fbId);
      if (existing) {
        fillFormWithExisting(existing);
      }
    } catch (err) {
      console.error("Failed to fetch existing feedback by ID:", err);
      toast.error("Cannot load existing feedback data.");
    }
  }

  function fillFormWithExisting(found: Feedback) {
    setFeedbackId(found.feedbackId || null);
    setRating(found.rating || 5);
    setComments(found.comments || "");
    setPositives(found.positives || "");
    setNegatives(found.negatives || "");
    setImprovements(found.improvements || "");
  }

  async function handleSubmit() {
    if (!giverId || !receiverId) {
      toast.error("Missing giver/receiver ID. Cannot proceed.");
      return;
    }
    try {
      setLoading(true);

      const authTokens = localStorage.getItem("authTokens");
      if (!authTokens) {
        toast.error("No auth token. Please log in again.");
        return;
      }
      const { idToken: token } = JSON.parse(authTokens);

      const payload: Feedback = {
        feedbackId: feedbackId || undefined,
        interviewId,
        giverId,
        receiverId,
        rating,
        comments,
        positives,
        negatives,
        improvements,
      };

      if (feedbackId) {
        await updateFeedback(token, feedbackId, payload);
        toast.success("Feedback updated successfully!");
      } else {
        await createFeedback(token, payload);
        toast.success("Feedback created successfully!");
      }

      router.push("/dashboard/past-sessions");
    } catch (err) {
      console.error("Feedback submission failed:", err);
      toast.error("Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-20 min-h-screen px-6 py-10 bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white">
      <motion.div
        className="mx-auto w-full max-w-4xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-center mb-8">
          {feedbackId ? "Edit Feedback" : "Give Feedback"}
        </h1>

        <Card className="bg-gradient-to-r from-[#1a0d3f] to-[#5b21b6] shadow-xl p-6 transform hover:scale-[1.02] transition-all">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white">
              {feedbackId ? "Update Your Feedback" : "Share Your Experience"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {}
            <label className="text-white font-semibold">Rating (1-10)</label>
            <input
              type="number"
              min={1}
              max={10}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-md bg-[#1E2535] text-white p-2 mb-4 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {}
            <label className="text-white font-semibold">Overall Comments</label>
            <Textarea
              placeholder="Share your general thoughts about the interview..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />

            {}
            <label className="text-white font-semibold mt-4 block">
              Positives
            </label>
            <Textarea
              placeholder="What went well?"
              value={positives}
              onChange={(e) => setPositives(e.target.value)}
            />

            {}
            <label className="text-white font-semibold mt-4 block">
              Negatives
            </label>
            <Textarea
              placeholder="Any aspects that were lacking?"
              value={negatives}
              onChange={(e) => setNegatives(e.target.value)}
            />

            {}
            <label className="text-white font-semibold mt-4 block">
              Improvements
            </label>
            <Textarea
              placeholder="Suggestions to improve future interviews..."
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
            />

            <div className="mt-6 flex justify-center items-center">
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="text-base px-5 py-3"
              >
                {loading
                  ? "Submitting..."
                  : feedbackId
                  ? "Update Feedback"
                  : "Submit Feedback"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
