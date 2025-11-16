export interface Session {
  SessionId: number;
  UserId?: number | null;
  LicensePlate?: string | null;
  VehicleId?: number | null;
  companyName?: string;
  Battery?: number;
  PortId?: number;
  PointId?: number;
  StationId?: number;
  PortType?: string;
  ChargingStatus?: string;
  StationName?: string;
  chargerName?: string;
  power?: string;
  Status?: "waiting" | "charging" | "done";
  address?: string;
  date?: string;
  time?: string;
  portPrice?: number;
  userType?: "guest" | "staff";
  inputBattery?: number;
  batteryPercentage?: number;
}

export interface ChargingPort {
  PortId: number;
  PortType: string;
  PortTypeOfKwh: number;
  PortTypePrice: number;
}
