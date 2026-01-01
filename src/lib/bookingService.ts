import axios from "@/lib/axios";
import { Booking } from "@/types/entities";

export const bookingService = {
  async getBookingById(token: string, id: number): Promise<Booking> {
    const response = await axios.get<Booking>(`/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },

  async createBooking(token: string, booking: Booking) {
    return axios.post("/bookings/register", booking, { headers: { Authorization: `Bearer ${token}` } });
  },

  async updateBooking(token: string, id: number, booking: Booking) {
    return axios.put(`/bookings/${id}`, booking, { headers: { Authorization: `Bearer ${token}` } });
  },

  async cancelBooking(token: string, id: number, reason: string) {
    return axios.put(`/bookings/${id}/cancel?reason=${reason}`, null, { headers: { Authorization: `Bearer ${token}` } });
  },
};

export async function registerBooking(bookingDto: {
  intervieweeId: number;
  availabilityId: number;
  bookingDate: string; // format: "YYYY-MM-DD"
  totalPrice: number;
  paymentStatus: string; // example: "PENDING"
}): Promise<{ bookingId: number; totalPrice: number }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  const authTokensStr = localStorage.getItem("authTokens");
  const idToken = authTokensStr ? JSON.parse(authTokensStr).idToken : "";

  const res = await fetch(`${apiUrl}/api/bookings/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(bookingDto),
  });

  if (!res.ok) {
    throw new Error("Failed to register booking");
  }

  return res.json(); // expected to return { bookingId, totalPrice }
}
