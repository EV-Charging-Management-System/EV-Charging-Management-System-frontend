import apiClient from "../utils/api";

export const vehicleService = {
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
