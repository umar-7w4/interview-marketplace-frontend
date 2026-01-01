import axios from "@/lib/axios";
import { Notification } from "@/types/entities";

export const notificationService = {
  async getNotificationsByUser(token: string, userId: number): Promise<Notification[]> {
    const response = await axios.get<Notification[]>(`/notifications/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },

  async markNotificationAsRead(token: string, notificationId: number) {
    return axios.put(`/notifications/${notificationId}/markAsRead`, null, { headers: { Authorization: `Bearer ${token}` } });
  },
};
