import apiClient from '../utils/api'

export interface ChargingPoint {
  PointId: number;
  StationId: number;
  NumberOfPort: number;
  ChargingPointStatus: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  PortType?: string;
  Name?: string; 
  Power?: string; 
}

class ChargingPointService {
  async getByStationId(stationId: number): Promise<ChargingPoint[]> {
    try {
      const res = await apiClient.get(`/station/getPoint`, {
        params: { stationId }
      })

      return res.data?.data || []
    } catch (error) {
      console.error("⚠️ Error fetching charging points:", error)
      throw error
    }
  }
}

export default new ChargingPointService()
