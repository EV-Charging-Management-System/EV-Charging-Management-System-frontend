/**
 * Types và interfaces cho ChargingSchedule
 */

export interface RawBooking {
  BookingId: number
  StationName?: string
  StartTime: string
  VehicleName?: string
  LicensePlate?: string
  DepositAmount?: number
  QR?: string
  Status: string
}

export interface FormattedBooking {
  id: number
  stationName: string
  startTime: string
  vehicle: string
  deposit: string
  qr: string
  status: string
}
