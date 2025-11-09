import { apiClient } from "../utils/api";

export const vehicleService = {
  async getVehicles() {
    try {
      const res = await apiClient.get("/vehicle");
      return res.data;
    } catch (err: any) {
      console.error("[vehicleService] ❌ getVehicles:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Không thể tải danh sách xe.",
      };
    }
  },

  async addVehicle(payload: {
    vehicleName: string;
    vehicleType: string;
    licensePlate: string;
    battery?: number | null;
  }) {
    try {
      const res = await apiClient.post("/vehicle", payload);
      return res.data;
    } catch (err: any) {
      console.error("[vehicleService] ❌ addVehicle:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Không thể đăng ký xe.",
      };
    }
  },
};
