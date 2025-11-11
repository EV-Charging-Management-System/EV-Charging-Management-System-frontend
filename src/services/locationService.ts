import apiClient from '../utils/api'

export interface Station {
  StationId: number
  StationName: string
  Address: string
  StationStatus: string
  StationDescrip: string
  ChargingPointTotal: number
}
export interface StaffAddress {
  StationId: number
  address: string
  StationName: string
  status: string
   lat: number | null
  lng: number | null
}
export interface MappedStation {
  id: number
  name: string
  address: string
  fullAddress: string
  lat: number | null
  lng: number | null
  status: string
  ChargingPointTotal: number
}

class LocationService {
  async getAllStations(): Promise<MappedStation[]> {
    const res = await apiClient.get('/station/getAllStations')
    const apiData = res.data?.data || []

    return apiData.map((item: Station) => {
      const latMatch = item.Address.match(/lat:\s*([\d.]+)/)
      const lngMatch = item.Address.match(/lng:\s*([\d.]+)/)

      return {
        id: item.StationId,
        name: item.StationName,
        address: item.Address.split(';')[0]?.trim(),
        fullAddress: item.Address,
        lat: latMatch ? parseFloat(latMatch[1]) : null,
        lng: lngMatch ? parseFloat(lngMatch[1]) : null,
        status: item.StationStatus?.toLowerCase() || 'unknown',
        ChargingPointTotal: item.ChargingPointTotal
      }
    })
  }
  async getStaffAddress(): Promise<StaffAddress[]> {
    const res = await apiClient.get('/staff/address/stations');
   const apiData = res.data?.data || []

     return apiData.map((item: Station) => {
      const latMatch = item.Address.match(/lat:\s*([\d.]+)/)
      const lngMatch = item.Address.match(/lng:\s*([\d.]+)/)

      return {
        id: item.StationId,
        address: item.Address,
        StationName: item.StationName,
        status: item.StationStatus?.toLowerCase() || 'unknown',
        lat: latMatch ? parseFloat(latMatch[1]) : null,
        lng: lngMatch ? parseFloat(lngMatch[1]) : null
      }
    })
  }

  async getStationInfo(address: string): Promise<Station | null> {
    const decodedAddress = decodeURIComponent(address)

    try {
      const res = await apiClient.post('/station/getStationinfor', {
        StationAddress: decodedAddress
      })

      console.log("🔹 Station fetched from BE:", res.data?.data)
      return res.data?.data?.[0] || null
    } catch (err) {
      console.error("❌ Error fetching station info:", err)
      return null
    }
  }
}

export default new LocationService()
