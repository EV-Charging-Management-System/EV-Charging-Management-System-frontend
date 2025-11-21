export interface InvoiceData {
  invoiceId?: number;
  sessionId: number;
  sessionPrice?: number;
  penaltyFee?: number;
  totalAmount?: number;
  cost: number;
  customer?: string;
  startTime?: string;
  endTime?: string;
  stationName?: string;
  chargerName?: string;
  power?: string;
  batteryStart?: number;
  batteryEnd?: number;
  paid?: boolean;
  PaidStatus?: string;
  createdAt?: string;
}
