import apiClient from "../utils/api";

const API_BASE = "http://localhost:5000";

export const invoiceService = {
  // ✅ Lấy invoice theo sessionId - API POST (không phải GET!)
  async getInvoiceBySessionId(sessionId: number) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      console.log(`🔍 Fetching invoice from: ${API_BASE}/api/charging-session/${sessionId}/invoice`);

      const res = await fetch(`${API_BASE}/api/charging-session/${sessionId}/invoice`, {
        method: "POST", // ✅ SỬA: POST thay vì GET
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });

      console.log(`📊 Invoice API response status: ${res.status}`);
      console.log(`📋 Invoice API response headers:`, res.headers.get('content-type'));

      // ⚠️ Kiểm tra xem response có phải JSON không
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.error("❌ Response is not JSON:", textResponse.substring(0, 200));
        throw new Error("API endpoint không tồn tại hoặc trả về HTML thay vì JSON");
      }

      const data = await res.json();
      console.log("🧾 Invoice API response data:", data);

      if (!res.ok) {
        throw new Error(data.message || `Failed to fetch invoice (Status: ${res.status})`);
      }

      console.log("✅ Invoice fetched successfully:", data);
      return data.data || data;
    } catch (error: any) {
      console.error("❌ Error fetching invoice:", error);
      console.error("❌ Error details:", {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  },

  // Lấy tất cả invoices của user
  async getUserInvoices(userId: number) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/api/invoice/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch invoices");

      return data.data || data;
    } catch (error) {
      console.error("❌ Error fetching user invoices:", error);
      throw error;
    }
  },

  // Lấy tất cả invoices (staff/admin)
  async getAllInvoices() {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/api/invoice/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch invoices");

      return data.data || data;
    } catch (error) {
      console.error("❌ Error fetching all invoices:", error);
      throw error;
    }
  },

  // Tạo invoice thủ công (nếu cần)
  async createInvoice(invoiceData: {
    sessionId: number;
    userId: number;
    amount: number;
  }) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/api/invoice/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create invoice");

      return data.data || data;
    } catch (error) {
      console.error("❌ Error creating invoice:", error);
      throw error;
    }
  },
};

export default invoiceService;
