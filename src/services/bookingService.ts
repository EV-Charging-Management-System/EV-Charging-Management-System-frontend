import { apiClient } from "../utils/api";

export const bookingService = {
  // Lấy tất cả trạm sạc từ backend
  async getAllStations(): Promise<any[]> {
    try {
      const res = await apiClient.get("/station/getAllSations");
      // Backend returns { data: [...] }
      return res.data?.data || [];
    } catch (error) {
      console.warn("bookingService.getAllStations failed:", error);
      throw error;
    }
  }
};

export default bookingService;
