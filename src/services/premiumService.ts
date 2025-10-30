import { apiClient } from "../utils/api";
import type { ApiResponse } from "../utils/types";

export const premiumService = {
  /**
   * 🧾 Mua gói Premium hoặc Business
   * Endpoint: POST /membership/subscribe
   */
  async purchase(data: { userId: number; packageId: number; paymentMethod: string }) {
    try {
      console.log("[premiumService] purchase payload:", data);
      const response = await apiClient.post<ApiResponse<any>>("/membership/subscribe", data);
      console.log("[premiumService] purchase response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("[premiumService] purchase error:", error);
      return { success: false, message: "Không thể mua gói Premium." };
    }
  },

  /**
   * 👤 Lấy thông tin gói Premium hiện tại của người dùng
   * Endpoint: GET /membership/my
   */
  async getCurrentMembership() {
    try {
      const response = await apiClient.get<ApiResponse<any>>("/membership/my");
      return response.data;
    } catch (error: any) {
      console.error("[premiumService] getCurrentMembership error:", error);
      return { success: false, message: "Không thể lấy thông tin hội viên." };
    }
  },
};
