import { apiClient } from "../utils/api";

export const businessService = {
  // =========================================================
  // 🏢 Tạo công ty
  // POST /api/business/create-company
  // =========================================================
  async createCompany(payload: {
    userId: number;
    companyName: string;
    address: string;
    mail: string;
    phone: string;
  }) {
    try {
      const res = await apiClient.post("/business/create-company", payload);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Cannot create company.",
      };
    }
  },

  // =========================================================
  // 🚗 Thêm xe doanh nghiệp
  // POST /api/business/vehicle
  // =========================================================
  async addVehicle(payload: {
    vehicleName: string;
    vehicleType: string;
    licensePlate: string;
  }) {
    try {
      const res = await apiClient.post("/business/vehicle", payload);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Cannot add vehicle.",
      };
    }
  },

  // =========================================================
  // ❌ Xóa xe doanh nghiệp
  // DELETE /api/business/vehicle/:licensePlate
  // =========================================================
  async deleteVehicleByPlate(plate: string) {
    try {
      const encoded = encodeURIComponent(plate.trim());
      const res = await apiClient.delete(`/business/vehicle/${encoded}`);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Cannot delete vehicle.",
      };
    }
  },

  // =========================================================
  // 🚘 Lấy danh sách xe
  // GET /api/business/vehicles
  // =========================================================
  async getVehicles() {
    try {
      const res = await apiClient.get("/business/vehicles");
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err.response?.data?.message || "Cannot load vehicle list.",
      };
    }
  },

  // =========================================================
  // 💳 Tổng quan thanh toán doanh nghiệp
  // GET /api/business/payments/summary
  // =========================================================
  async getPaymentsSummary() {
    try {
      const res = await apiClient.get("/business/payments/summary");
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        data: {},
        message:
          err.response?.data?.message || "Cannot load payment overview.",
      };
    }
  },

  // =========================================================
  // ⚡ Lịch sử sạc doanh nghiệp
  // GET /api/business/session/:companyId
  // =========================================================
  async getCompanySessions(companyId: number) {
    try {
      const res = await apiClient.get(`/business/session/${companyId}`);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err.response?.data?.message || "Cannot load charging history.",
      };
    }
  },

  // =========================================================
  // 📊 Thống kê doanh nghiệp
  // GET /api/business/overview/:companyId
  // =========================================================
  async getCompanyOverview(companyId: number) {
    try {
      const res = await apiClient.get(`/business/overview/${companyId}`);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        data: {},
        message: err.response?.data?.message || "Cannot load overview.",
      };
    }
  },

  // =========================================================
  // 🔍 Tra cứu công ty qua biển số
  // GET /api/vehicle/lookup/company-by-plate
  // =========================================================
  async lookupCompanyByPlate(licensePlate: string) {
    try {
      const res = await apiClient.get(`/vehicle/lookup/company-by-plate`, {
        params: { licensePlate },
      });
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Cannot lookup company!",
      };
    }
  },

  // =========================================================
  // 🧾 Lấy danh sách hóa đơn công ty
  // GET /api/business/invoices/:companyId
  // =========================================================
  async getCompanyInvoices(companyId: number) {
    try {
      const res = await apiClient.get(`/business/invoices/${companyId}`);
      return res.data;
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err.response?.data?.message || "Cannot load invoices.",
      };
    }
  },

  // =========================================================
  // 💳 Thanh toán 1 hóa đơn — VNPAY
  // POST /api/vnpay/create-invoice
  // =========================================================
  async paySingleInvoice(invoiceId: number) {
    try {
      const res = await apiClient.post(`/vnpay/create-invoice`, {
        invoiceId,
      });

      console.log("[businessService] paySingleInvoice:", res.data);
      return res.data; // { success, data: { url, txnRef } }
    } catch (err: any) {
      console.error("[businessService] ❌ paySingleInvoice:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Cannot create payment.",
      };
    }
  },
};
