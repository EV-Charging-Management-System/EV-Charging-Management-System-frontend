import type { StationAddress } from "utils/types";
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
  async getAllStations(): Promise<StationAddress[]> {
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

  // 🏢 Lấy danh sách doanh nghiệp chờ duyệt
  async getBusinessAccounts() {
    try {
      const res = await apiClient.get("/admin/approvals");
      return Array.isArray(res.data?.data) ? res.data.data : res.data || [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy danh sách doanh nghiệp:", error);
      return [];
    }
  },

  // ✅ Duyệt DN
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

  // ❌ Từ chối DN
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

  // ➕ Tạo staff
  async createStaff(email: string, password: string, fullName: string, address: string) {
    try {
      const payload = { Email: email, PasswordHash: password, FullName: fullName, Address: address };
      const res = await apiClient.post("/admin/createstaff", payload);
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Tạo tài khoản staff thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi tạo staff:", error);
      return { success: false, message: "Lỗi khi tạo staff!" };
    }
  },

  // 📊 Dashboard
  async getDashboardStats() {
    try {
      const res = await apiClient.get("/admin/dashboard");
      return res.data?.data || res.data || {};
    } catch (error) {
      console.error("⚠️ Lỗi lấy dashboard:", error);
      return {};
    }
  },

  // Chi tiết doanh nghiệp
  async getBusinessDetail(userId: number) {
    try {
      const res = await apiClient.get(`/admin/approvals/${userId}`);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi xem chi tiết DN:", error);
      return { success: false, message: "Lỗi khi xem chi tiết!" };
    }
  },

  // 🗑️ Xóa trạm sạc
  async deleteStation(stationId: number) {
    try {
      const res = await apiClient.patch("/admin/deleteStation", { stationId });
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Xóa trạm thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi xóa trạm:", error);
      return { success: false, message: "Lỗi khi xóa trạm!" };
    }
  },

  // ➕ Tạo Point
  async createPoint(stationId: number, numberOfPort: number) {
    try {
      const payload = { stationId, numberOfPort };
      const res = await apiClient.post("/admin/createPoint", payload);
      return {
        success: res.data?.success ?? res.status === 201,
        message: res.data?.message || "Tạo Point thành công!",
        data: res.data?.data,
      };
    } catch (error) {
      console.error("❌ Lỗi tạo Point:", error);
      return { success: false, message: "Lỗi khi tạo Point!" };
    }
  },

  // ✏️ Cập nhật Point
  async updatePoint(pointId: number, numberOfPort: number, chargingPointStatus: string) {
    try {
      const payload = { pointId, numberOfPort, chargingPointStatus };
      const res = await apiClient.put("/admin/updatePoint", payload);
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Cập nhật Point thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi cập nhật Point:", error);
      return { success: false, message: "Lỗi khi cập nhật Point!" };
    }
  },

  // 🗑️ Xóa Point
  async deletePoint(pointId: number) {
    try {
      const res = await apiClient.delete("/admin/deletePoint", { data: { pointId } });
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Xóa Point thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi xóa Point:", error);
      return { success: false, message: "Lỗi khi xóa Point!" };
    }
  },

  // ➕ Tạo Port
  async createPort(pointId: number, portName: string, portType: string, portStatus: string) {
    try {
      const payload = { pointId, portName, portType, portStatus };
      const res = await apiClient.post("/admin/createPort", payload);
      return {
        success: res.data?.success ?? res.status === 201,
        message: res.data?.message || "Tạo Port thành công!",
        data: res.data?.data,
      };
    } catch (error) {
      console.error("❌ Lỗi tạo Port:", error);
      return { success: false, message: "Lỗi khi tạo Port!" };
    }
  },

  // ✏️ Cập nhật Port
  async updatePort(portId: number, portName: string, portType: string, portStatus: string) {
    try {
      const payload = { portId, portName, portType, portStatus };
      const res = await apiClient.put("/admin/updatePort", payload);
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Cập nhật Port thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi cập nhật Port:", error);
      return { success: false, message: "Lỗi khi cập nhật Port!" };
    }
  },

  // 🗑️ Xóa Port
  async deletePort(portId: number) {
    try {
      const res = await apiClient.delete("/admin/deletePort", { data: { portId } });
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Xóa Port thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi xóa Port:", error);
      return { success: false, message: "Lỗi khi xóa Port!" };
    }
  },

  // 📋 Points theo Station
  async getPointsByStation(stationId: number) {
    try {
      const res = await apiClient.get(`/station/getPoint?stationId=${stationId}`);
      return Array.isArray(res.data?.data) ? res.data.data : res.data || [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy Points:", error);
      return [];
    }
  },

  // 📋 Ports theo Point
  async getPortsByPoint(pointId: number) {
    try {
      const res = await apiClient.get(`/station/getPort?pointId=${pointId}`);
      return Array.isArray(res.data?.data) ? res.data.data : res.data || [];
    } catch (error) {
      console.error("⚠️ Lỗi lấy Ports:", error);
      return [];
    }
  },

  // 📊 Báo cáo doanh thu
  async getRevenueReport() {
    try {
      const res = await apiClient.get("/admin/revenue");
      return res.data;
    } catch (error) {
      console.error("⚠️ Lỗi lấy báo cáo:", error);
      return {};
    }
  },

  // ✏️ Cập nhật User
  async updateUser(userId: number, userData: any) {
    try {
      const payload = { userId, ...userData };
      const res = await apiClient.put(`/admin/update-user`, payload);
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Cập nhật user thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi cập nhật user:", error);
      return { success: false, message: "Lỗi khi cập nhật user!" };
    }
  },

  // 🗑️ Xóa User
  async deleteUser(userId: number) {
    try {
      const res = await apiClient.delete(`/admin/delete-users/${userId}`);
      return {
        success: res.data?.success ?? res.status === 200,
        message: res.data?.message || "Xóa người dùng thành công!",
      };
    } catch (error) {
      console.error("❌ Lỗi xóa user:", error);
      return { success: false, message: "Lỗi khi xóa user!" };
    }
  },

 // 🎁 --- DISCOUNT CONFIG ---

async getDiscount() {
  try {
    const res = await apiClient.get("/discount");
    if (res.data?.success) {
      return res.data.data;
    }
    return {};
  } catch (error: any) {
    console.error("⚠️ Lỗi lấy discount FE:", error.response?.data || error);
    return {}; // không throw để FE không crash
  }
},

async getPremiumDiscount() {
  try {
    const res = await apiClient.get("/discount/premium");
    if (res.data?.success) {
      return res.data.data;
    }
    return {};
  } catch (error: any) {
    console.error("⚠️ Lỗi lấy premium discount:", error.response?.data || error);
    return {};
  }
},

async updatePremiumDiscount(payload: { percent: number }) {
  try {
    const res = await apiClient.patch("/discount/premium", payload);
    return res.data; 
  } catch (error: any) {
    console.error("❌ Lỗi cập nhật premium discount:", error.response?.data || error);
    return { success: false, message: "Update failed" };
  }
},
// 📦 Lấy tất cả packages
async getAllPackages() {
  try {
    const res = await apiClient.get("/packages");
    return res.data?.data || [];
  } catch (error) {
    console.error("⚠️ Lỗi lấy packages:", error);
    return [];
  }
}


};