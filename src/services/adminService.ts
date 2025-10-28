import { apiClient } from "../utils/api";

export const adminService = {
  // 👤 Lấy danh sách người dùng
  async getAllUsers() {
    const res = await apiClient.get("/admin/users");
    return res.data.data;
  },

  // ⚡ Lấy danh sách trạm sạc
  async getAllStations() {
    try {
      const res = await apiClient.get("/station/getAllSations");
      return res.data.data;
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách trạm sạc:", error);
      return [];
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

  // 📅 Lấy danh sách đặt lịch (mock)
  async getAllBookings() {
    try {
      const res = await apiClient.get("/admin/bookings");
      return res.data.data;
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách đặt lịch:", error);
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

  // 🏢 QUẢN LÝ TÀI KHOẢN DOANH NGHIỆP
  async getBusinessAccounts() {
    // ⚙️ Dữ liệu giả (mock) để hiển thị nếu backend lỗi
    const fakeData = [
      {
        UserId: 201,
        UserName: "EV Corp HCM",
        Mail: "contact@evcorp.vn",
        AccountStatus: "PENDING",
      },
      {
        UserId: 202,
        UserName: "GreenCharge Co.",
        Mail: "green@charge.com",
        AccountStatus: "APPROVED",
      },
      {
        UserId: 203,
        UserName: "E-Power Ltd.",
        Mail: "epower@gmail.com",
        AccountStatus: "REJECTED",
      },
    ];

    try {
      const res = await apiClient.get("/admin/business-accounts");

      // ✅ Nếu API trả dữ liệu đúng, dùng dữ liệu thật
      if (res.data && res.data.data && res.data.data.length > 0) {
        return res.data.data;
      } else {
        console.warn("⚠️ API không trả dữ liệu hợp lệ, dùng fake data.");
        return fakeData;
      }
    } catch (error) {
      console.warn("⚠️ Không lấy được danh sách DN:", error);
      // ✅ Trả về dữ liệu giả để FE không trống
      return fakeData;
    }
  },

  // ✅ Duyệt tài khoản DN
  async approveBusinessAccount(id: number) {
    try {
      const res = await apiClient.put(`/admin/business-accounts/${id}/approve`);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi duyệt DN:", error);
      throw error;
    }
  },

  // ✅ Từ chối tài khoản DN
  async rejectBusinessAccount(id: number) {
    try {
      const res = await apiClient.put(`/admin/business-accounts/${id}/reject`);
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi từ chối DN:", error);
      throw error;
    }
  },
};
