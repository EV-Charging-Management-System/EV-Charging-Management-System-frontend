import { apiClient } from "../utils/api";

export const businessService = {
  /**
   * 🏢 Tạo công ty mới
   * Gọi API: POST /api/business/create-company
   */
  async createCompany(payload: {
    userId: number;
    companyName: string;
    address: string;
    mail: string; // ✅ đổi từ companyMail -> mail để khớp BE
    phone: string;
  }) {
    try {
      const res = await apiClient.post("/business/create-company", payload);
      console.log("[businessService] ✅ createCompany:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[businessService] ❌ Error createCompany:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Không thể tạo công ty.",
      };
    }
  },

  /**
   * 🚗 Thêm xe mới cho doanh nghiệp
   * Gọi API: POST /api/business/vehicle
   */
  async addVehicle(payload: {
    vehicleName: string;
    vehicleType: string;
    licensePlate: string;
  }) {
    try {
      const res = await apiClient.post("/business/vehicle", payload);
      console.log("[businessService] ✅ addVehicle:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[businessService] ❌ Error addVehicle:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Không thể thêm xe mới.",
      };
    }
  },

  /**
   * ❌ Xóa xe theo biển số
   * Gọi API: DELETE /api/business/vehicle/:licensePlate
   */
  async deleteVehicleByPlate(licensePlate: string) {
    try {
      // ✅ Encode để tránh lỗi khi biển số có dấu gạch hoặc ký tự đặc biệt
      const encodedPlate = encodeURIComponent(licensePlate.trim());
      const res = await apiClient.delete(`/business/vehicle/${encodedPlate}`);
      console.log("[businessService] 🗑️ deleteVehicleByPlate:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[businessService] ❌ Error deleteVehicleByPlate:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Không thể xoá xe.",
      };
    }
  },

  /**
   * 🚘 Lấy danh sách xe doanh nghiệp
   * Gọi API: GET /api/business/vehicles
   */
  async getVehicles() {
    try {
      const res = await apiClient.get("/business/vehicles");
      console.log("[businessService] ✅ getVehicles:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[businessService] ❌ Error getVehicles:", err);
      return {
        success: false,
        data: [],
        message: err.response?.data?.message || "Không thể tải danh sách xe.",
      };
    }
  },

  /**
   * 💳 Lấy tổng quan thanh toán doanh nghiệp
   * Gọi API: GET /api/business/payments/summary
   */
  async getPaymentsSummary() {
    try {
      const res = await apiClient.get("/business/payments/summary");
      console.log("[businessService] ✅ getPaymentsSummary:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[businessService] ❌ Error getPaymentsSummary:", err);
      return {
        success: false,
        data: {},
        message:
          err.response?.data?.message || "Không thể tải tổng quan thanh toán.",
      };
    }
  },
  /**
 * ⚡ Lấy lịch sử sạc của doanh nghiệp
 * Gọi API: GET /api/business/session/:companyId
 */
async getCompanySessions(companyId: number) {
  try {
    const res = await apiClient.get(`/business/session/${companyId}`);
    console.log("[businessService] ✅ getCompanySessions:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("[businessService] ❌ Error getCompanySessions:", err);
    return {
      success: false,
      data: [],
      message: err.response?.data?.message || "Không thể tải lịch sử sạc.",
    };
  }
},
/**
 * 📊 Lấy tổng quan doanh nghiệp
 * Gọi API: GET /api/business/overview/:companyId
 */
async getCompanyOverview(companyId: number) {
  try {
    const res = await apiClient.get(`/business/overview/${companyId}`);
    console.log("[businessService] ✅ getCompanyOverview:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("[businessService] ❌ Error getCompanyOverview:", err);
    return {
      success: false,
      data: {},
      message: err.response?.data?.message || "Không thể tải tổng quan doanh nghiệp.",
    };
  }
},


};
