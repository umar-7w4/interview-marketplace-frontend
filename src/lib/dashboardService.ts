import axios from "@/lib/axios";
import { Interview } from "@/types/entities";

export interface InterviewerDashboardData {
  totalEarnings: number; 
  scheduledInterviewsCount: number;
  averageRating: number;
  upcomingInterviews: Interview[];
}

export async function getInterviewerDashboardData(
  token: string,
  interviewerId: number
): Promise<InterviewerDashboardData> {
  const [earningsRes, countRes, ratingRes, upcomingRes] = await Promise.all([
    axios.get<number>(`/payments/interviewer/${interviewerId}/earnings`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    axios.get<number>(`/interviews/interviewer/${interviewerId}/count`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    axios.get<number>(`/feedbacks/interviewer/${interviewerId}/rating`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    axios.get<Interview[]>(`/interviews/interviewer/${interviewerId}/upcoming`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  return {
    totalEarnings: earningsRes.data,
    scheduledInterviewsCount: countRes.data,
    averageRating: ratingRes.data,
    upcomingInterviews: upcomingRes.data,
  };
}
