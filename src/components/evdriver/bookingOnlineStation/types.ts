/**
 * Types và interfaces cho BookingOnlineStation
 */

export interface StationData {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  empty: number
  total: number
  color: 'green' | 'orange' | 'gray'
  raw: any
}

export interface MapCenter {
  lat: number
  lng: number
}
