import { apiClient } from "../utils/api";

/* ============================================================
 * 🧩 1️⃣ Định nghĩa kiểu dữ liệu dùng trong booking
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

/* ============================================================
 * 🚀 2️⃣ bookingService — Quản lý toàn bộ API Đặt Lịch & Thanh Toán
 * ============================================================
 */

const bookingService = {
  /**
   * ✅ Lấy danh sách tất cả trạm sạc
   */
  async getAllStations(): Promise<Station[]> {
    try {
      const res = await apiClient.get("/station/getAllStations");
      console.log("[bookingService] getAllStations:", res.data);
      return res.data?.data || [];
    } catch (error: any) {
      console.error("[bookingService] getAllStations error:", error);
      throw new Error("Không thể tải danh sách trạm sạc.");
    }
  },

  /**
   * ✅ Lấy danh sách điểm (Point) theo StationId
   */
  async getPoints(stationId: number): Promise<Point[]> {
    try {
      const res = await apiClient.get(`/station/getPoint?stationId=${stationId}`);
      console.log("[bookingService] getPoints:", res.data);
      return res.data?.data || [];
    } catch (error: any) {
      console.error("[bookingService] getPoints error:", error);
      throw new Error("Không thể tải danh sách điểm sạc.");
    }
  },

  /**
   * ✅ Lấy danh sách cổng (Port) theo PointId
   */
  async getPorts(pointId: number): Promise<Port[]> {
    try {
      const res = await apiClient.get(`/station/getPort?pointId=${pointId}`);
      console.log("[bookingService] getPorts:", res.data);
      return res.data?.data || [];
    } catch (error: any) {
      console.error("[bookingService] getPorts error:", error);
      throw new Error("Không thể tải danh sách cổng sạc.");
    }
  },

  /**
   * ✅ Tạo thanh toán VNPay
   * Gửi userId và amount đến API VNPay để tạo URL thanh toán
   */
  async createVnpay(payload: VnpayPayload): Promise<CreateBookingResponse> {
    try {
      console.log("[bookingService] POST /vnpay/create payload:", payload);
      const res = await apiClient.post<CreateBookingResponse>("/vnpay/create", payload);

      console.log("[bookingService] /vnpay/create response:", res.data);

      return res.data;
    } catch (error: any) {
      console.error("[bookingService] createVnpay failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || "Không thể tạo thanh toán VNPay!");
    }
  },

  /**
   * ✅ Tạo booking sau khi thanh toán thành công
   * Gửi thông tin đầy đủ về trạm, cổng, xe, thời gian
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
      throw new Error(error?.response?.data?.message || "Không thể tạo booking!");
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
      throw new Error("Không thể tải danh sách booking của người dùng.");
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
      throw new Error("Không thể tải thông tin booking.");
    }
  },

};

export default bookingService;
