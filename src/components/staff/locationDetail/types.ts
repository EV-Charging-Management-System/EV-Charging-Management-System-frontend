export interface Station {
  StationId: number;
  StationName: string;
  Address: string;
  ChargingPointTotal: number;
}

export interface ChargingPoint {
  PointId: number;
  ChargingPointStatus?: string;
}

export interface ChargingPort {
  PortId: number;
  PortType: string;
  PortTypeOfKwh: number;
  PortTypePrice: number;
}

export interface Vehicle {
  userId?: number;
  licensePlate: string;
  companyName?: string;
  userName?: string;
  battery?: number;
}

export interface BookingFormData {
  licensePlate: string;
  displayName: string;
  battery: string;
  portId: string;
  portType: string;
  kwh: string;
  price: string;
  userId: string;
}
