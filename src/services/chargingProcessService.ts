// src/services/chargingService.ts
import apiClient from "../utils/api"; // nếu bạn đã có apiClient, hoặc thay bằng fetch nếu chưa có

const API_BASE = "http://localhost:5000";

export const chargingService = {
  // Lấy danh sách cổng
  async getPorts(pointId: number, token: string) {
    const res = await fetch(`${API_BASE}/api/station/getPort?pointId=${pointId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Lỗi khi tải cổng sạc");
    const json = await res.json();
    return json.data || [];
  },

  // Lấy session của nhân viên
  async getStaffSessions(stationId: number, token: string) {
    const res = await fetch(`${API_BASE}/api/staff/station/${stationId}/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Lỗi khi tải session nhân viên");
    const json = await res.json();
    return json.data || [];
  },

  // Lấy session của khách
  async getGuestSessions(stationId: number, token: string) {
    const res = await fetch(`${API_BASE}/api/charging-session/guest?stationId=${stationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Lỗi khi tải session khách");
    const json = await res.json();
    return json.data || [];
  },

  // Lấy toàn bộ trạm (để lấy địa chỉ)
  async getStations(token: string) {
    const res = await fetch(`${API_BASE}/api/station/getAllStations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Lỗi khi tải danh sách trạm");
    const json = await res.json();
    return json.data || [];
  },

  // Lưu % pin khi bắt đầu sạc
  async setBatteryPercentage(sessionId: number, batteryPercentage: number, token: string) {
    const res = await fetch(`${API_BASE}/api/charging-session/setBatteryPercentage`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: sessionId,
        batteryPercentage,
      }),
    });
    if (!res.ok) throw new Error("Lỗi khi cập nhật pin");
    return await res.json();
  },

  // Kết thúc sạc
  async endChargingSession(sessionId: number, userType: string, token: string) {
    const url =
      userType === "guest"
        ? `${API_BASE}/api/charging-session/guest/${sessionId}/end`
        : `${API_BASE}/api/charging-session/staff/${sessionId}/end`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

export default chargingService;
