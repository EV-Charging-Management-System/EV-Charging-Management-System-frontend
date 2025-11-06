import { apiClient } from "../utils/api";

export const adminService = {
  // 👥 Lấy danh sách người dùng
  async getAllUsers() {
    try {
      const res = await apiClient.get("/admin/users");
      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy danh sách người dùng:", error);
      return [];
    }
  },

  // ⚡ Lấy danh sách trạm sạc
  async getAllStations(): Promise<any[]> {
    try {
      const res = await apiClient.get("/station/getAllStations");
      return Array.isArray(res.data?.data) ? res.data.data : res.data || [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy danh sách trạm sạc:", error);
      return [];
    }
  },

  // 💳 Lấy danh sách thanh toán
  async getAllPayments() {
    try {
      const res = await apiClient.get("/payment/getInvoices");
      return Array.isArray(res.data?.data) ? res.data.data : res.data || [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy danh sách thanh toán:", error);
      return [];
    }
  },

  // 📅 Lấy danh sách đặt lịch
  async getAllBookings() {
    try {
      const res = await apiClient.get("/admin/bookings");
      return Array.isArray(res.data?.data) ? res.data.data : res.data || [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy danh sách đặt lịch:", error);
      return [];
    }
  },

  // 🏢 Lấy danh sách tài khoản doanh nghiệp chờ duyệt
  async getBusinessAccounts() {
    try {
      const res = await apiClient.get("/admin/approvals");
      return Array.isArray(res.data?.data) ? res.data.data : res.data || [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy danh sách doanh nghiệp:", error);
      return [];
    }
  },

  // ✅ Duyệt tài khoản doanh nghiệp
  async approveBusinessAccount(id: number) {
    try {
      const res = await apiClient.patch(`/admin/approvals/${id}/approve`);
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Duyệt doanh nghiệp thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi duyệt doanh nghiệp:", error);
      return { success: false, message: "Lỗi khi duyệt doanh nghiệp!" };
    }
  },

  // ❌ Từ chối tài khoản doanh nghiệp
  async rejectBusinessAccount(id: number) {
    try {
      const res = await apiClient.patch(`/admin/approvals/${id}/reject`);
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Từ chối doanh nghiệp thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi từ chối doanh nghiệp:", error);
      return { success: false, message: "Lỗi khi từ chối doanh nghiệp!" };
    }
  },

  // 👨‍💼 Lấy danh sách staff
  async getAllStaff() {
    try {
      const res = await apiClient.get("/admin/getAllStaff");
      return Array.isArray(res.data?.data) ? res.data.data : res.data || [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy danh sách staff:", error);
      return [];
    }
  },

  // ➕ Tạo staff mới
  async createStaff(email: string, password: string, fullName: string) {
    try {
      const payload = {
        Email: email,
        PasswordHash: password,
        FullName: fullName,
      };
      const res = await apiClient.post("/admin/createstaff", payload);
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Tạo tài khoản staff thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi tạo staff:", error);
      return { success: false, message: "Lỗi khi tạo tài khoản staff!" };
    }
  },
  // 📊 Thống kê tổng quan Dashboard
async getDashboardStats() {
  try {
    const res = await apiClient.get("/admin/dashboard");
    return res.data?.data || res.data || {};
  } catch (error) {
    console.error("⚠️ Lỗi lấy thống kê dashboard:", error);
    return {};
  }
},
// 🔍 Xem chi tiết yêu cầu doanh nghiệp
async getBusinessDetail(userId: number) {
  try {
    const res = await apiClient.get(`/admin/approvals/${userId}`);
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi xem chi tiết doanh nghiệp:", error);
    return { success: false, message: "Lỗi khi xem chi tiết doanh nghiệp!" };
  }
},


};
