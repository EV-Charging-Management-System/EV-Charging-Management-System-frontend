import apiClient from "../utils/api";

const API_BASE = "http://localhost:5000";

export const invoiceService = {

  // Tạo invoice cho staff khi kết thúc sạc (luồng có account)
  async createInvoiceForStaff(sessionId: number, userId: number) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      console.log(`🧾 Creating invoice for staff - sessionId: ${sessionId}, userId: ${userId}`);

      const res = await fetch(`${API_BASE}/api/charging-session/${sessionId}/invoice-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      const data = await res.json();
      console.log(`📊 Invoice-staff API response:`, data);

      if (!res.ok) throw new Error(data.message || "Failed to create invoice for staff");

      console.log("✅ Invoice created successfully for staff:", data);
      return data.data || data;
    } catch (error: any) {
      console.error("❌ Error creating invoice for staff:", error);
      throw error;
    }
  },

  // ✅ Tạo/lấy invoice cho khách vãng lai (guest - không có account)
  // Sử dụng cho luồng: Staff kết thúc sạc → tạo invoice → chuyển sang trang thanh toán
  async getInvoiceBySessionId(sessionId: number) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      console.log(`🔍 Creating/fetching guest invoice for session: ${sessionId}`);
      console.log(`📍 API endpoint: ${API_BASE}/api/charging-session/${sessionId}/invoice`);

      const res = await fetch(`${API_BASE}/api/charging-session/${sessionId}/invoice`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });

      console.log(`📊 Guest invoice API response status: ${res.status}`);

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.error("❌ Response is not JSON:", textResponse.substring(0, 200));
        throw new Error("API endpoint không tồn tại hoặc trả về HTML thay vì JSON");
      }

      const data = await res.json();
      console.log("🧾 Guest invoice API response data:", data);

      if (!res.ok) {
        throw new Error(data.message || `Failed to create/fetch guest invoice (Status: ${res.status})`);
      }

      console.log("✅ Guest invoice created/fetched successfully:", data);
      return data.data || data;
    } catch (error: any) {
      console.error("❌ Error creating/fetching guest invoice:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },
};

export default invoiceService;
