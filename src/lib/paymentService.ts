import axios from "@/lib/axios";
import { Payment } from "@/types/entities";

export const paymentService = {
  async createCheckoutSession(token: string, bookingId: number, amount: number) {
    return axios.post("/payments/create-checkout-session", { bookingId, amount }, { headers: { Authorization: `Bearer ${token}` } });
  },

  async getPaymentById(token: string, id: number): Promise<Payment> {
    const response = await axios.get<Payment>(`/payments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },

  async getAllPayments(token: string): Promise<Payment[]> {
    const response = await axios.get<Payment[]>("/payments", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },
};

export async function getUserPayments(token: string, userId: number): Promise<Payment[]> {
    const response = await axios.get<Payment[]>(`/payments/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }