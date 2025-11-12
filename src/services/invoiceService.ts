import apiClient from "../utils/api";

const API_BASE = "http://localhost:5000";

export const invoiceService = {
  // 🧾 Lấy invoice theo sessionId (POST)
  async getInvoiceBySessionId(sessionId: number) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/api/charging-session/${sessionId}/invoice`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await res.text();
        console.error("❌ Response is not JSON:", textResponse.substring(0, 200));
        throw new Error("API endpoint không tồn tại hoặc trả về HTML thay vì JSON");
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to fetch invoice (Status: ${res.status})`);
      return data.data || data;
    } catch (error: any) {
      console.error("❌ Error fetching invoice:", error);
      throw error;
    }
  },

  // 📦 Lấy tất cả invoices của user
  async getUserInvoices(userId: number) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/api/invoice/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch invoices");
      return data.data || data;
    } catch (error) {
      console.error("❌ Error fetching user invoices:", error);
      throw error;
    }
  },

  // 📊 Lấy tất cả invoices (staff/admin)
  async getAllInvoices() {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/api/invoice/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch invoices");
      return data.data || data;
    } catch (error) {
      console.error("❌ Error fetching all invoices:", error);
      throw error;
    }
  },

  // 🧾 Tạo invoice thủ công
  async createInvoice(invoiceData: { sessionId: number; userId: number; amount: number }) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE}/api/invoice/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(invoiceData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create invoice");
      return data.data || data;
    } catch (error) {
      console.error("❌ Error creating invoice:", error);
      throw error;
    }
  },

  // 👨‍🔧 Tạo invoice cho staff (xe có tài khoản)
  async createInvoiceForStaff(sessionId: number, userId: number) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      console.log(`🧾 Creating invoice for staff - sessionId: ${sessionId}, userId: ${userId}`);

      const res = await fetch(`${API_BASE}/api/charging-session/${sessionId}/invoice-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
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

  // 💰 Thanh toán tiền mặt cho khách vãng lai (guest)
  async payCash(sessionId: number) {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not authenticated");

      console.log(`💵 Paying cash for guest - sessionId: ${sessionId}`);

      const res = await fetch(`${API_BASE}/api/charging-session/${sessionId}/invoice-staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({}) // Guest không có userId
      });

      const data = await res.json();
      console.log(`📊 Guest invoice API response:`, data);

      if (!res.ok) throw new Error(data.message || "Failed to create guest invoice");

      console.log("✅ Guest invoice created successfully:", data);
      return data.data || data;
    } catch (error: any) {
      console.error("❌ Error paying cash for guest:", error);
      throw error;
    }
  }
  // 🧾 Lấy hóa đơn theo sessionId (cho staff/guest)
async getInvoiceForStaff(sessionId: number) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${API_BASE}/api/charging-session/${sessionId}/invoice-staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}) // Guest không cần userId
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch invoice");
    return data.data || data;
  } catch (error) {
    console.error("❌ Error fetching invoice for staff:", error);
    throw error;
  }
}

};

export default invoiceService;
