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
      const res = await apiClient.delete(`/business/vehicle/${licensePlate}`);
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
};
