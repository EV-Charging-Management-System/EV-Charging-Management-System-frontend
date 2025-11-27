import { apiClient } from "../utils/api";

/* ============================================================
 * 🔌 Charging Session Service - Quản lý phiên sạc
 * ============================================================
 */

export interface StartSessionPayload {
  bookingId: number;
  stationId: number;
  vehicleId: number;
  pointId: number;
  portId: number;
  batteryPercentage: number;
}

export interface StartSessionResponse {
  success: boolean;
  message?: string;
  data?: {
    sessionId: number;
    checkinTime: string;
    chargingStatus: string;
  };
}

export interface EndSessionResponse {
  success: boolean;
  message?: string;
  data?: {
    checkoutTime: string;
  };
}

const chargingSessionService = {
  /**
   * ✅ Bắt đầu phiên sạc
   * POST /api/charging-session/start
   */
  async startSession(payload: StartSessionPayload): Promise<StartSessionResponse> {
    try {
      console.log("[chargingSessionService] POST /charging-session/start payload:", payload);
      const res = await apiClient.post<StartSessionResponse>("/charging-session/start", payload);
      
      console.log("[chargingSessionService] Start session response:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("[chargingSessionService] startSession failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || "Cannot start charging session!");
    }
  },

  /**
   * ✅ Kết thúc phiên sạc
   * PATCH /api/charging-session/:id/end
   */
  async endSession(sessionId: number): Promise<EndSessionResponse> {
    try {
      console.log("[chargingSessionService] PATCH /charging-session/end, sessionId:", sessionId);
      const res = await apiClient.patch<EndSessionResponse>(`/charging-session/${sessionId}/end`);
      
      console.log("[chargingSessionService] End session response:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("[chargingSessionService] endSession failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || "Cannot end charging session!");
    }
  },

  /**
   * ✅ Tạo hóa đơn sau khi kết thúc phiên sạc
   * POST /api/charging-session/:id/invoice
   * Backend tự tính sessionPrice và penaltyFee dựa trên thời gian start -> end
   */
  async createInvoice(sessionId: number): Promise<any> {
    try {
      console.log("[chargingSessionService] POST /charging-session/invoice, sessionId:", sessionId);
      const res = await apiClient.post(`/charging-session/${sessionId}/invoice`);
      
      console.log("[chargingSessionService] Create invoice response:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("[chargingSessionService] createInvoice failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || "Cannot create invoice!");
    }
  },

  /**
   * ✅ Áp dụng phí phạt khi sạc 100% nhưng chưa dừng
   * PATCH /api/charging-session/:id/penalty
   * Phí phạt: penaltyFee = thời gian quá 100% (phút) * 5000đ
   */
  async applyPenalty(sessionId: number, penaltyFee: number): Promise<any> {
    try {
      console.log("[chargingSessionService] PATCH /charging-session/penalty, sessionId:", sessionId, "penaltyFee:", penaltyFee);
      const res = await apiClient.patch(`/charging-session/${sessionId}/penalty`, {
        penaltyFee
      });
      
      console.log("[chargingSessionService] Apply penalty response:", res.data);
      return res.data;
    } catch (error: any) {
      console.error("[chargingSessionService] applyPenalty failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(error?.response?.data?.message || "Cannot apply penalty fee!");
    }
  }
};

export default chargingSessionService;