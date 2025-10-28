import { apiClient } from "../utils/api";

export const bookingService = {
  // Lấy tất cả trạm sạc từ backend
  async getAllStations(): Promise<any[]> {
    try {
      const res = await apiClient.get("/station/getAllSations");
      // Backend returns { data: [...] }
      return res.data?.data || [];
    } catch (error) {
      console.warn("bookingService.getAllStations failed:", error);
      throw error;
    }
  }
  ,
  // Tạo booking — nếu backend không cung cấp thông tin cổng, sẽ thêm mock port vào payload
  async createBooking(bookingPayload: any): Promise<any> {
    try {
      const payload = { ...bookingPayload };

      // Ensure there's a port object in the payload. If not, create a mock port using stationId and portIndex or selectedStation
      if (!payload.port) {
        const portIndex = payload.portIndex || payload.selectedPortIndex || (payload.selectedStation || null);
        const stationId = payload.stationId || payload.station || null;
        payload.port = {
          id: portIndex ? Number(`${stationId || 0}${portIndex}`) : Date.now(),
          name: payload.portName || payload.portLabel || `Cổng ${portIndex || 1}`,
          power: payload.portPower || payload.power || 'Unknown',
          status: 'available',
        };
      }

      const res = await apiClient.post('/bookings', payload);
      return res.data;
    } catch (error) {
      console.error('bookingService.createBooking failed:', error);
      throw error;
    }
  }
};

export default bookingService;
