import apiClient from "../utils/api";

export interface ChargingPort {
  PortId: number;
  PointId: number;
  PortType: string;
  PortTypeOfKwh: number;
  PortTypePrice: number;
}

export interface ChargingPoint {
  PointId: number;
  StationId: number;
  NumberOfPort: number;
  ChargingPointStatus: "AVAILABLE" | "BUSY" | "OFFLINE";
}

class ChargingPointService {
  async getByStationId(stationId: number): Promise<ChargingPoint[]> {
    const res = await apiClient.get("/station/getPoint", {
      params: { stationId }
    });
    return res.data?.data ?? [];
  }

  async getPortsByPoint(pointId: number): Promise<ChargingPort[]> {
    const res = await apiClient.get("/station/getPort", {  // Sửa URL ở đây
      params: { pointId }
    });
    return res.data?.data ?? [];
  }
}

export default new ChargingPointService();
