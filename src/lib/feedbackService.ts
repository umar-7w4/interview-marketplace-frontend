import axios from "@/lib/axios";
import { Feedback } from "@/types/entities";


export async function getUserFeedback(token: string, userId: number): Promise<Feedback[]> {
    const response = await axios.get<Feedback[]>(`/feedbacks/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }

  export async function createFeedback(token: string, feedback: Feedback) {
    const res = await axios.post("/feedbacks/register", feedback, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  export async function checkFeedback(token: string, interviewId: number, giverId: number) {
    const res = await axios.get<Feedback | null>(
      `/feedbacks/check?interviewId=${interviewId}&giverId=${giverId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data; 
  }

  export async function updateFeedback(token: string, feedbackId: number, payload: Feedback

  ): Promise<Feedback> {
    const res = await axios.put<Feedback>(`/feedbacks/${feedbackId}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }

  export async function getFeedbackById(
    token: string,
    feedbackId: number
  ): Promise<Feedback> {
    const response = await axios.get<Feedback>(`/feedbacks/${feedbackId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }