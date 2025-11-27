import { apiClient } from "../utils/api";

/* ============================================================
 * 🧩 1️⃣ Data type definitions for booking
 * ============================================================
 */

export interface Station {
  StationId: number;
  StationName: string;
  Address: string;
  StationStatus: string;
  StationDescrip: string;
  ChargingPointTotal: number;
}

export interface Point {
  PointId: number;
  StationId: number;
  ChargingPointStatus: string;
  NumberOfPort: number;
}

export interface Port {
  PortId: number;
  PointId: number;
  PortType: string;
  PortStatus: string;
}

export interface BookingPayload {
  stationId: number;
  pointId: number;
  portId: number;
  vehicleId: number;
  startTime: string;
  depositAmount: number;
  orderInfo?: string;
  userId?: number | string;
  carBrand?: string;
  qr?: string; // ✅ Add qr field to save txnRef from VNPay
}

export interface VnpayPayload {
  userId: number | string;
  amount: number;
}

export interface CreateBookingResponse {
  success: boolean;
  message?: string;
  data?: {
    url?: string;
    txnRef?: string;
  };
  url?: string;
  txnRef?: string;
}

export interface VnpayResponse {
  success: boolean;
  message?: string;
  data?: {
    url?: string;
    txnRef?: string;
  };
  url?: string;
  txnRef?: string;
}

/* ============================================================
 * 🚀 2️⃣ bookingService — Manage all Booking & Payment APIs
 * ============================================================
 */

const bookingService = {
  /**
   * ✅ Get list of all charging stations
   */
  async getAllStations(): Promise<Station[]> {
    try {
      const res = await apiClient.get("/station/getAllStations");
      console.log("[bookingService] getAllStations:", res.data);
      return res.data?.data || [];
    } catch (error: any) {
      console.error("[bookingService] getAllStations error:", error);
      throw new Error("Cannot load charging station list.");
    }
  },

  /**
   * ✅ Get list of points by StationId
   */
  async getPoints(stationId: number): Promise<Point[]> {
    try {
      const res = await apiClient.get(`/station/getPoint?stationId=${stationId}`);
      console.log("[bookingService] getPoints:", res.data);
      return res.data?.data || [];
    } catch (error: any) {
      console.error("[bookingService] getPoints error:", error);
      throw new Error("Cannot load charging point list.");
    }
  },

  /**
   * ✅ Get list of ports by PointId
   */
  async getPorts(pointId: number): Promise<Port[]> {
    try {
      const res = await apiClient.get(`/station/getPort?pointId=${pointId}`);
      console.log("[bookingService] getPorts:", res.data);
      return res.data?.data || [];
    } catch (error: any) {
      console.error("[bookingService] getPorts error:", error);
      throw new Error("Cannot load charging port list.");
    }
  },

  /**
   * ✅ Get port details by PortId
   */
  async getPortById(portId: number): Promise<any> {
    try {
      const res = await apiClient.get(`/station/getPortById/${portId}`);
      console.log("[bookingService] getPortById:", res.data);
      return res.data?.data || res.data;
    } catch (error: any) {
      console.error("[bookingService] getPortById error:", error);
      throw new Error("Cannot load charging port information.");
    }
  },

  /**
   * ✅ Create VNPay payment
   * Send userId and amount to VNPay API to create payment URL
   * @returns {VnpayResponse} - Returns payment URL and txnRef
   */
  async createVnpay(payload: VnpayPayload): Promise<VnpayResponse> {
    try {
      console.log("[bookingService] POST /vnpay/create payload:", payload);
      const res = await apiClient.post<VnpayResponse>("/vnpay/create", payload);

      console.log("[bookingService] /vnpay/create response:", res.data);

      // ✅ Trích xuất txnRef từ response
      const txnRef = res.data?.data?.txnRef || res.data?.txnRef;
      console.log("[bookingService] txnRef extracted:", txnRef);

      return res.data;
    } catch (error: any) {
      console.error("[bookingService] createVnpay failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || "Cannot create VNPay payment!");
    }
  },

  /**
   * ✅ Create booking after successful payment
   * Send complete information about station, port, vehicle, time
   */
  async createBooking(payload: BookingPayload): Promise<any> {
    try {
      console.log("[bookingService] POST /booking payload:", payload);
      const res = await apiClient.post("/booking", payload);

      console.log("[bookingService] /booking response:", res.data);

      return res.data;
    } catch (error: any) {
      console.error("[bookingService] createBooking failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || "Cannot create booking!");
    }
  },

  // get all booking by user
  async getBookingByUser(userId: number | string): Promise<any> {
    try {
      const res = await apiClient.get("/booking/my");
      console.log("[bookingService] getBookingByUser:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("[bookingService] getBookingByUser error:", error);
      throw new Error("Cannot load user booking list.");
    }
  },

  /**
   * ✅ Lấy chi tiết booking theo ID
   * GET /api/booking/:id
   */
  async getBookingById(bookingId: number): Promise<any> {
    try {
      const res = await apiClient.get(`/booking/${bookingId}`);
      console.log("[bookingService] getBookingById:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("[bookingService] getBookingById error:", error);
      throw new Error("Cannot load booking information.");
    }
  },

};

export default bookingService;