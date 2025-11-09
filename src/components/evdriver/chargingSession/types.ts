/**
 * Types và interfaces cho ChargingSession
 */

export interface Booking {
  id?: number
  stationName: string
  address?: string
  port?: string
  power?: string
  code?: string
  portId?: number
}

export interface SessionState {
  battery: number
  time: number
  cost: number
  isCharging: boolean
  finished: boolean
  penaltyMinutes: number
  startTimestamp: string | null
  sessionId: number | null
}
