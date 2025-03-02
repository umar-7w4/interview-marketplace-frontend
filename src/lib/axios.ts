import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }
  const storedData = localStorage.getItem("mockx-user");
  if (storedData) {
    const { idToken } = JSON.parse(storedData);
    console.log("Printing Id token"+idToken);
    config.headers.Authorization = `Bearer ${idToken}`;
  }
  return config;
});

export default api;
 