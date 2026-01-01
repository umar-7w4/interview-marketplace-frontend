// File: src/lib/profileService.ts

import axios from "@/lib/axios";
import { OptionType } from "@/constants/options";
import {
  Interview,
  IntervieweeDto,
  InterviewerDto,
  IntervieweeSkillDto,
  InterviewerSkillDto,
} from "@/types/entities";


export interface SkillApiResponse {
  skillId: number;
  name: string;
  description?: string;
}

function getAuthToken(): string | null {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      console.error("No user data found in localStorage.");
      return null;
    }
  
    try {
      const parsed = JSON.parse(storedUser);
      return parsed.idToken || null; // Extract idToken instead of token
    } catch (err) {
      console.error("Error parsing token from localStorage:", err);
      return null;
    }
  }
  

export async function getAllSkills(): Promise<OptionType[]> {
    const token = getAuthToken();
  
    if (!token) {
      console.error("No authentication token found.");
      return [];
    }
  
    try {
      console.log("Fetching skills with token:", token);
  
      const response = await axios.get<SkillApiResponse[]>("/skills", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.map((skill) => ({
        label: skill.name,
        value: skill.skillId, 
      }));
    } catch (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
  }
  

export const profileService = {
  async registerInterviewee(token: string, intervieweeData: IntervieweeDto) {
    return axios.post("/interviewees/register", intervieweeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async findIntervieweeByUserId(token: string, userId: number) {
    return axios.get(`/interviewees/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async deactivateInterviewee(token: string, intervieweeId: number) {
    return axios.put(`/interviewees/${intervieweeId}/deactivate`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async reactivateInterviewee(token: string, intervieweeId: number) {
    return axios.put(`/interviewees/${intervieweeId}/reactivate`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async registerInterviewer(token: string, interviewerData: InterviewerDto) {
    return axios.post("/interviewers/register", interviewerData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateInterviewerProfile(
    token: string,
    interviewerId: number,
    data: Partial<InterviewerDto>
  ) {
    return axios.put(`/interviewers/${interviewerId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async findInterviewerByUserId(token: string, userId: number) {
    return axios.get(`/interviewers/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async verifyInterviewer(token: string, interviewerId: number, verified: boolean) {
    return axios.put(
      `/interviewers/${interviewerId}/verify?verified=${verified}`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  },

  async deactivateInterviewer(token: string, interviewerId: number) {
    return axios.put(`/interviewers/${interviewerId}/deactivate`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async reactivateInterviewer(token: string, interviewerId: number) {
    return axios.put(`/interviewers/${interviewerId}/reactivate`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async addIntervieweeSkill(token: string, skillData: IntervieweeSkillDto) {
    // skillData needs { intervieweeId, skillId, yearsOfExperience, proficiencyLevel, certified }
    return axios.post("/interviewee-skills/add", skillData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateIntervieweeSkill(
    token: string,
    intervieweeSkillId: number,
    skillData: Partial<IntervieweeSkillDto>
  ) {
    return axios.put(`/interviewee-skills/${intervieweeSkillId}`, skillData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getIntervieweeSkills(token: string, intervieweeId: number) {
    return axios.get(`/interviewee-skills/interviewee/${intervieweeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async deleteIntervieweeSkill(token: string, intervieweeSkillId: number) {
    return axios.delete(`/interviewee-skills/${intervieweeSkillId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async addInterviewerSkill(token: string, skillData: InterviewerSkillDto) {
    // skillData = { interviewerId, skillId, yearsOfExperience, proficiencyLevel, certified }
    return axios.post("/interviewer-skills/add", skillData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async updateInterviewerSkill(
    token: string,
    interviewerSkillId: number,
    skillData: Partial<InterviewerSkillDto>
  ) {
    return axios.put(`/interviewer-skills/${interviewerSkillId}`, skillData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getInterviewerSkills(token: string, interviewerId: number) {
    return axios.get(`/interviewer-skills/interviewer/${interviewerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async deleteInterviewerSkill(token: string, interviewerSkillId: number) {
    return axios.delete(`/interviewer-skills/${interviewerSkillId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};


export async function registerInterviewer(token: string, data: InterviewerDto) {
    return axios.post("/interviewers/register", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  

  export async function updateInterviewerProfile(token: string, data: InterviewerDto) {
    console.log(data.interviewerId);
    return axios.put(`/interviewers/${data.interviewerId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
  }

export async function getTotalSpent(
  token: string,
  userId: number
): Promise<number> {
  const response = await axios.get<number>(
    `/payments/interviewee/${userId}/total-spent`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function getUpcomingInterviewsCount(
  token: string,
  userId: number
): Promise<number> {
  const response = await axios.get<number>(
    `/interviews/interviewee/${userId}/upcoming-count`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function getCompletedInterviewsCount(
  token: string,
  userId: number
): Promise<number> {
  const response = await axios.get<number>(
    `/interviews/interviewee/${userId}/completed-count`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function getCompletedInterviews(
  token: string,
  userId: number
): Promise<Interview[]> {
  const response = await axios.get<Interview[]>(
    `/interviews/interviewee/${userId}/completed`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function updateIntervieweeProfile(token: string, data: any) {
    return axios.put(`/interviewees/${data.intervieweeId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  export async function registerInterviewee(token: string, data: any) {
    return axios.post("/interviewees/register", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  export async function fetchUpcomingInterviews(token: string, userId: number): Promise<Interview[]> {
    const response = await axios.get<Interview[]>(`/interviews/interviewee/${userId}/upcoming`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
  
  export async function doesIntervieweeProfileExist(token: string, userId: number): Promise<boolean> {
    const response = await axios.get(`/interviewees/user/${userId}/exists`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data === true
  }
  
  export async function doesInterviewerProfileExist(token: string, userId: number): Promise<boolean> {
    const response = await axios.get(`/interviewers/user/${userId}/exists`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data === true
  }