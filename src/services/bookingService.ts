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
  ,
  // Tạo URL thanh toán VNPAY
  async createVnPay(payload: { amount: number | string; orderInfo?: string; [key: string]: any }) {
    try {
      const res = await apiClient.post("/vnpay/create", payload);
      // response shape: { data: { url: 'https://...' } }
      return res.data?.data?.url || res.data?.url || null;
    } catch (error) {
      console.error("bookingService.createVnPay failed:", error);
      throw error;
    }
  }
  ,
  // Verify / handle vnpay return query
  async verifyVnPay(queryString: string) {
    try {
      // forward full query string to backend return endpoint
      const res = await apiClient.get(`/vnpay/return${queryString}`);
      return res.data;
    } catch (error) {
      console.error('bookingService.verifyVnPay failed:', error);
      throw error;
    }
  }
};

export default bookingService;
