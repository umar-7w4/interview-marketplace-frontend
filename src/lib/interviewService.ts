import axios from "@/lib/axios";
import { Interview } from "@/types/entities";

export const interviewService = {
  async getInterviewById(token: string, id: number): Promise<Interview> {
    const response = await axios.get<Interview>(`/interviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async createInterview(token: string, interview: Interview) {
    return axios.post("/interviews/register", interview, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateInterview(token: string, id: number, interview: Interview) {
    return axios.put(`/interviews/${id}`, interview, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async cancelInterview(token: string, id: number, reason: string) {
    return axios.put(`/interviews/${id}/cancel?reason=${reason}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAllInterviews(token: string): Promise<Interview[]> {
    const response = await axios.get<Interview[]>("/interviews", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getInterviewsByMonth(token: string, year: number, month: number, userId: number): Promise<Interview[]> {
    const response = await axios.get<Interview[]>(`/interviews/by-month?year=${year}&month=${month}&userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getInterviewsByWeek(token: string, start: string, end: string, userId: number): Promise<Interview[]> {
    const response = await axios.get<Interview[]>(`/interviews/by-week?start=${start}&end=${end}&userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async getInterviewsByDate(token: string, date: string, userId: number): Promise<Interview[]> {
    const response = await axios.get<Interview[]>(`/interviews/by-date?date=${date}&userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  async rescheduleInterview(token: string, interviewId: number, updatedData: Interview) {
    return axios.put(`/interviews/${interviewId}/reschedule`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export async function getPastSessionsForInterviewee(
  token: string,
  userId: number,
  filters?: {
    startDate?: string; 
    endDate?: string;  
    status?: string;   
    timezone?: string; 
    startTime?: string; 
    endTime?: string;  
  }
): Promise<Interview[]> {
  const params = new URLSearchParams();

  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.timezone) params.append("timezone", filters.timezone);
  if (filters?.startTime) params.append("startTime", filters.startTime);
  if (filters?.endTime) params.append("endTime", filters.endTime);

  const response = await axios.get<Interview[]>(
    `/interviews/past-sessions?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  console.log(response.data);
  return response.data;
}

export async function getUserIdForInterviewer(token: string, interviewerId: number): Promise<number> {
  const res = await axios.get<{ userId: number }>(`/interviewers/${interviewerId}/user-id`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.userId;
}

export async function getInterviewByIdFeedback(token: string, interviewId: number): Promise<Interview> {
  const res = await axios.get<Interview>(`/interviews/${interviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getInterviewerSkills(interviewerId: number): Promise<string[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const authTokensStr = localStorage.getItem("authTokens");
  const idToken = authTokensStr ? JSON.parse(authTokensStr).idToken : "";
  
  const res = await fetch(`${apiUrl}/api/interviewers/${interviewerId}/skills`, {
    headers: {
      "Authorization": `Bearer ${idToken}`,
    },
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch interviewer skills");
  }
  
  return res.json(); 
}

export async function fetchInterviewerDto(interviewerId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const authTokensStr = localStorage.getItem("authTokens");
  const idToken = authTokensStr ? JSON.parse(authTokensStr).idToken : "";

  const res = await fetch(`${apiUrl}/api/interviewers/${interviewerId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch interviewer details");
  }
  return res.json(); 
}

export async function fetchAvailability(
  interviewerId: number,
  date: Date
): Promise<Array<{
  slotId: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const authTokensStr = localStorage.getItem("authTokens");
  const idToken = authTokensStr ? JSON.parse(authTokensStr).idToken : "";

  const dateStr = date.toISOString().split("T")[0]; 

  const res = await fetch(
    `${apiUrl}/api/availabilities/${interviewerId}/availability?date=${dateStr}`,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch availability slots");
  }
  return res.json(); 
}


export async function fetchUserById(userId: number) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const authTokensStr = localStorage.getItem("authTokens");
  const idToken = authTokensStr ? JSON.parse(authTokensStr).idToken : "";

  const res = await fetch(`${apiUrl}/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json(); 
}

