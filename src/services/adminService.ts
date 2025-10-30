import { apiClient } from "../utils/api";

export const adminService = {
  // 👤 Lấy danh sách người dùng
  async getAllUsers() {
    try {
      const res = await apiClient.get("/users");
      console.log("📦 Response getAllUsers:", res.data);

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;

      console.warn("⚠️ Dữ liệu trả về không đúng định dạng:", res.data);
      return [];
    } catch (error) {
      console.warn("⚠️ Không thể lấy danh sách người dùng:", error);
      return [];
    }
  },

  // 📊 ✅ Thêm hàm này để Dashboard hoạt động
  async getDashboardStats() {
    try {
      const res = await apiClient.get("/admin/dashboard");
      console.log("📊 Dashboard Stats:", res.data);
      // Trả về dữ liệu chuẩn
      return res.data?.data || res.data || {};
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu dashboard:", error);
      return { users: 0, stations: 0, staff: 0, bookings: 0, revenue: 0 };
    }
  },

  // 🗑️ Xóa người dùng
  async deleteUser(userId: number) {
    try {
      const res = await apiClient.delete(`/users/${userId}`);
      console.log("📦 Response deleteUser:", res.data);

      if (res.data?.success || res.status === 200)
        return { success: true, message: res.data?.message || "Xóa tài khoản thành công!" };

      return { success: false, message: res.data?.message || "Xóa tài khoản thất bại!" };
    } catch (error) {
      console.error("❌ Lỗi khi xoá user:", error);
      return { success: false, message: "Lỗi khi xoá user!" };
    }
  },

  // ✏️ Cập nhật thông tin người dùng
  async updateUser(userId: number, data: any) {
    try {
      const res = await apiClient.put(`/users/${userId}`, data);
      console.log("📦 Response updateUser:", res.data);

      if (res.data?.success || res.status === 200)
        return { success: true, message: res.data?.message || "Cập nhật người dùng thành công!" };

      return { success: false, message: res.data?.message || "Cập nhật thất bại!" };
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật user:", error);
      return { success: false, message: "Lỗi khi cập nhật user!" };
    }
  },

  // ⚡ Lấy danh sách trạm sạc
  async getAllStations() {
    try {
      const res = await apiClient.get("/station/getAllSations");
      console.log("📦 Response getAllStations:", res.data);

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;
      return [];
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách trạm sạc:", error);
      return [];
    }
  },

  // 💳 Lấy danh sách thanh toán
  async getAllPayments() {
    try {
      const res = await apiClient.get("/payment/getInvoices");
      console.log("📦 Response getAllPayments:", res.data);

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;
      return [];
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách thanh toán:", error);
      return [];
    }
  },

  // 📅 Lấy danh sách đặt lịch
  async getAllBookings() {
    try {
      const res = await apiClient.get("/admin/bookings");
      console.log("📦 Response getAllBookings:", res.data);

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;
      return [];
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách đặt lịch:", error);
      return [];
    }
  },

  // 🏢 Lấy danh sách tài khoản doanh nghiệp chờ duyệt
  async getBusinessAccounts() {
    try {
      const res = await apiClient.get("/admin/approvals");
      console.log("📦 Response getBusinessAccounts:", res.data);

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;
      return [];
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách doanh nghiệp:", error);
      return [];
    }
  },

  // ✅ Duyệt tài khoản doanh nghiệp
  async approveBusinessAccount(id: number) {
    try {
      const res = await apiClient.patch(`/admin/approvals/${id}/approve`);
      console.log("📦 Response approveBusinessAccount:", res.data);

      if (res.data?.success || res.status === 200)
        return { success: true, message: res.data?.message || "Duyệt doanh nghiệp thành công!" };

      return { success: false, message: res.data?.message || "Duyệt doanh nghiệp thất bại!" };
    } catch (error) {
      console.error("❌ Lỗi duyệt doanh nghiệp:", error);
      return { success: false, message: "Lỗi khi duyệt doanh nghiệp!" };
    }
  },

  // ❌ Từ chối tài khoản doanh nghiệp
  async rejectBusinessAccount(id: number) {
    try {
      const res = await apiClient.patch(`/admin/approvals/${id}/reject`);
      console.log("📦 Response rejectBusinessAccount:", res.data);

      if (res.data?.success || res.status === 200)
        return { success: true, message: res.data?.message || "Từ chối doanh nghiệp thành công!" };

      return { success: false, message: res.data?.message || "Từ chối doanh nghiệp thất bại!" };
    } catch (error) {
      console.error("❌ Lỗi từ chối doanh nghiệp:", error);
      return { success: false, message: "Lỗi khi từ chối doanh nghiệp!" };
    }
  },

  // 👥 Lấy danh sách staff
  async getAllStaff() {
    try {
      const res = await apiClient.get("/admin/getAllStaff");
      console.log("📦 Response getAllStaff:", res.data);

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;
      return [];
    } catch (error) {
      console.warn("⚠️ Không thể lấy danh sách staff:", error);
      return [];
    }
  },

  // ➕ Tạo staff mới (chuẩn BE: Email, PasswordHash, FullName)
  async createStaff(email: string, password: string, fullName: string) {
    try {
      const payload = {
        Email: email,
        PasswordHash: password,
        FullName: fullName,
      };

      const res = await apiClient.post("/admin/createstaff", payload);
      console.log("📦 Response createStaff:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo staff:", error);
      return { success: false, message: "Lỗi khi tạo tài khoản staff!" };
    }
  },
};
