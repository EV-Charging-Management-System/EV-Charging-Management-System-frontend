import apiClient from "../utils/api";

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

  async getVehicleByLicensePlate(licensePlate: string) {
    if (!licensePlate) throw new Error("License plate is required");

    try {
      // API trả về thông tin Vehicle + User + Company
      const res = await apiClient.get(
        `/vehicle/lookup/company-by-plate?plate=${encodeURIComponent(licensePlate)}`
      );
      const data = res.data?.data;

      if (!data) return null;

      return {
        vehicleId: data.vehicleId,
        licensePlate: data.licensePlate,
        userId: data.userId || null,
        companyId: data.companyId || null,
        companyName: data.companyName || null,
        userName: data.userName || null,
        battery: data.battery || null,
        subscription: data.subscription || null,
      };
    } catch (error) {
      console.error("❌ Error fetching vehicle:", error);
      throw error;
    }
  },

  async getVehicleByPlate(plate: string) {
    return this.getVehicleByLicensePlate(plate);
  },
};
