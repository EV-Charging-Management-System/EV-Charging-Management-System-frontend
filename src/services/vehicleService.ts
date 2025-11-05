import apiClient from "../utils/api";

export const vehicleService = {
  async getVehicleByLicensePlate(licensePlate: string) {
    if (!licensePlate) throw new Error("License plate is required");

    // API trả về thông tin Vehicle + User + Company
    const res = await apiClient.get(
      `/vehicle/lookup/company-by-plate?plate=${encodeURIComponent(licensePlate)}`
    );
    const data = res.data?.data;

    if (!data) return null;

    return {
  vehicleId: data.vehicleId,
  licensePlate: data.licensePlate,
  companyId: data.companyId,
  companyName: data.companyName,
  userId: data.userId,
  userName: data.userName,
  battery: data.battery,  // ✅ số pin
};
  },

  async getVehicleByPlate(plate: string) {
    return this.getVehicleByLicensePlate(plate);
  },  
};
