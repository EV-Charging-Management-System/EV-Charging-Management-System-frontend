import { apiClient } from "../utils/api";

export const adminService = {
  // 👤 Lấy danh sách người dùng (đúng backend)
  async getAllUsers() {
    const res = await apiClient.get("/admin/users");
    return res.data.data;
  },

  // ⚡ Lấy danh sách trạm sạc (đúng backend thật)
  async getAllStations() {
    try {
      const res = await apiClient.get("/station/getAllSations"); // ⚠️ BE viết sai chữ "Stations"
      return res.data.data;
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách trạm sạc:", error);
      return [];
    }
  },

  // 💳 Lấy danh sách thanh toán (dựa theo BE PaymentController)
  async getAllPayments() {
    try {
      const res = await apiClient.get("/payment/getInvoices");
      return res.data.data;
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách thanh toán:", error);
      return [];
    }
  },
};
