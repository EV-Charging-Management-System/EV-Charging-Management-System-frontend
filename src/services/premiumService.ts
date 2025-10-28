import { apiClient } from "../utils/api";
import type { ApiResponse } from "../utils/types";

export const premiumService = {
  // ✅ Gọi API mua gói
  async purchase(data: { userId: number; packageId: number; paymentMethod: string }) {
    const response = await apiClient.post<ApiResponse<any>>("/membership/subscribe", data);
    return response.data;
  },

  // ✅ Lấy thông tin gói hiện tại (tuỳ chọn)
  async getCurrentMembership() {
    const response = await apiClient.get<ApiResponse<any>>("/membership/my");
    return response.data;
  },
};
