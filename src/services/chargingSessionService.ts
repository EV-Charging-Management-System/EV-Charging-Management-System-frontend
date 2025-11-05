import apiClient from "../utils/api";

interface StartSessionPayload {
  stationId: number;
  pointId: number;
  portId: number;
  batteryPercentage: number;
}

interface StartSessionByStaffPayload extends StartSessionPayload {
  licensePlate: string;
}

export const chargingSessionService = {
  // === API dùng cho người dùng bình thường ===
  async startSession(payload: StartSessionPayload) {
    const response = await apiClient.post("/charging-session/start", payload);
    return response.data;
  },

  async getSessionDetails(sessionId: number) {
    const response = await apiClient.get(`/charging-session/${sessionId}`);
    return response.data;
  },

  async endSession(sessionId: number) {
    const response = await apiClient.post(`/charging-session/${sessionId}/end`);
    return response.data;
  },

  // === API dành cho STAFF ===
  async startSessionByStaff(payload: StartSessionByStaffPayload) {
    const response = await apiClient.post("/charging-session/staff/start", payload);
    return response.data;
  },

  async endSessionByStaff(sessionId: number) {
    const response = await apiClient.patch(`/charging-session/staff/${sessionId}/end`);
    return response.data;
  },
};
