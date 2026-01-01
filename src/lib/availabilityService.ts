/* src/lib/availabilityService.ts */

import axios from "@/lib/axios";

const BASE_URL = "/availabilities";

function getAuthConfig() {
  let token = "";
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      token = parsedUser.idToken || parsedUser.token;
    }
  } catch (err) {
    console.error("Error reading user from localStorage:", err);
  }

  return {
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
  };
}

export const getAvailabilities = async (params: {
  startDate?: string
  endDate?: string
  startTime?: string
  endTime?: string
  timezone?: string
  status?: string
} = {}) => {
  try {
    const authTokensStr = localStorage.getItem("authTokens");
    const idToken = authTokensStr ? JSON.parse(authTokensStr).idToken : "";
    const response = await axios.get("/availabilities/filter", {
      headers: { Authorization: `Bearer ${idToken}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch availabilities via server filters");
  }
}

export const createAvailability = async (availabilityData: any) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/register`,
      availabilityData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create availability");
  }
};

export const updateAvailability = async (
  availabilityId: number,
  availabilityData: any
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${availabilityId}`,
      availabilityData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update availability");
  }
};

export const deleteAvailability = async (availabilityId: number) => {
  try {
    await axios.delete(`${BASE_URL}/${availabilityId}`, getAuthConfig());
    return "Availability deleted successfully";
  } catch (error) {
    throw new Error("Failed to delete availability");
  }
};

export const getInterviewerByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`/interviewers/by-user/${userId}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch interviewer record");
  }
};

export const getIntervieweeByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`/interviewees/user/${userId}`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch interviewee record");
  }
};


