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

export interface CreateBookingResponse {
  success: boolean;
  data?: {
    url?: string;
    txnRef?: string;
    paymentId?: number;
  };
  message?: string;
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
   * ✅ Gửi yêu cầu đặt lịch sạc & tạo thanh toán VNPay
   * FE sẽ redirect sang URL backend trả về
   */
  async createBooking(payload: BookingPayload): Promise<CreateBookingResponse> {
    try {
      console.log("[bookingService] POST /booking payload:", payload);
      const res = await apiClient.post<CreateBookingResponse>("/booking", payload);

      console.log("[bookingService] /booking response:", res.data);

      // Kiểm tra backend trả về đúng cấu trúc hay chưa
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Tạo booking thất bại.");
      }

      return res.data;
    } catch (error: any) {
      console.error("[bookingService] createBooking failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || "Không thể tạo booking, vui lòng thử lại!");
    }
  },
  async getBookingByTxn(txnRef: string) {
    try {
      const res = await apiClient.get(`/booking/txn/${txnRef}`);
      console.log("[bookingService] getBookingByTxn:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("[bookingService] getBookingByTxn failed:", error);
      throw new Error("Không thể lấy thông tin giao dịch");
    }
  },

};

export default bookingService;
