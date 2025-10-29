import { apiClient } from "../utils/api";

export const adminService = {
  // 👤 Lấy danh sách người dùng
  async getAllUsers() {
    const res = await apiClient.get("/admin/users");
    return res.data.data;
  },

  // ⚡ Lấy danh sách trạm sạc
   async getAllStations(): Promise<any[]> {
    try {
      const res = await apiClient.get("/station/getAllStations");
      // Backend returns { data: [...] }
      return res.data?.data || [];
    } catch (error) {
      console.warn("adminservices.getAllStations failed:", error);
      throw error;
    }
  },

  // 💳 Lấy danh sách thanh toán
  async getAllPayments() {
    try {
      const res = await apiClient.get("/payment/getInvoices");
      return res.data.data;
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách thanh toán:", error);
      return [];
    }
  },

  // 🆕 Lấy danh sách đặt lịch (mock hoặc BE thật sau này)
  async getAllBookings() {
    try {
      const res = await apiClient.get("/admin/bookings"); // khi BE có endpoint
      return res.data.data;
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách đặt lịch:", error);

      // Dữ liệu giả tạm thời nếu BE chưa có
      return [
        {
          BookingId: 1,
          UserName: "driver01",
          StationName: "Trạm Sạc Trung Tâm",
          StartTime: "2025-10-26T08:00:00Z",
          EndTime: "2025-10-26T09:00:00Z",
          Status: "Completed",
        },
        {
          BookingId: 2,
          UserName: "driver02",
          StationName: "Trạm EV Nguyễn Huệ",
          StartTime: "2025-10-26T10:30:00Z",
          EndTime: "2025-10-26T12:00:00Z",
          Status: "Pending",
        },
      ];
    }
  },
};
