/**
 * Types và interfaces cho BookingDetail
 */

export interface Point {
  PointId: number
  StationId: number
  ChargingPointStatus: string
  NumberOfPort?: number
}

export interface Port {
  PortId: number
  PointId: number
  PortType: string
  PortStatus: string
}

export interface BookingFormData {
  name: string
  userId: string
  email: string
  carBrand: string
  vehicleId: string
  time: string
}

export interface BookingPayload {
  stationId: number
  pointId: number
  portId: number
  vehicleId: number
  startTime: string
  depositAmount: number
  userId: number
  carBrand: string
}

export interface VnpayPayload {
  userId: number
  amount: number
}
