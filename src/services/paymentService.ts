import { apiClient } from "../utils/api";

/* ============================================================
 * 🧩 Invoice data type definition
 * ============================================================
 */

export interface Invoice {
  InvoiceId: number;
  UserId: number;
  CompanyId: number | null;
  SessionId: number;
  MonthYear: number | null;
  TotalAmount: number;
  PaidStatus: string;
  CreatedAt: string | null;
}

export interface PayInvoiceResponse {
  success: boolean;
  message: string;
  data?: {
    url?: string;
    txnRef?: string;
  };
}

export interface CreateInvoicePayload {
  invoiceId: number;
  orderInfo: string;
}

export interface CreateInvoiceResponse {
  success: boolean;
  message: string;
  data?: {
    url: string;
    txnRef: string;
    amount: number;
  };
}

/* ============================================================
 * 🚀 paymentService — Invoice Payment API Management
 * ============================================================
 */

const paymentService = {
  /**
   * ✅ Get invoice list of logged-in user
   * GET /api/payment/invoices
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await apiClient.get("/payment/invoices");
      console.log("[paymentService] getInvoices:", res.data);
      
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      
      return res.data?.data || [];
    } catch (error: any) {
      console.error("[paymentService] getInvoices error:", error);
      throw new Error("Cannot load invoice list.");
    }
  },

  /**
   * ✅ Pay Invoice
   * PATCH /api/payment/:invoiceId/pay
   * Body: {} (no parameters needed)
   */
  async payInvoice(
    invoiceId: number
  ): Promise<PayInvoiceResponse> {
    try {
      console.log("[paymentService] PATCH /payment/:id/pay");
      const res = await apiClient.patch<PayInvoiceResponse>(
        `/payment/${invoiceId}/pay`,
        {}
      );

      console.log("[paymentService] /payment/:id/pay response:", res.data);

      return res.data;
    } catch (error: any) {
      console.error("[paymentService] payInvoice failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(
        error?.response?.data?.message || "Cannot pay invoice!"
      );
    }
  },

  /**
   * ✅ Tạo URL thanh toán VNPay cho Invoice
   * POST /api/vnpay/create-invoice
   * Body: { invoiceId: number, orderInfo: string }
   */
  async createVnpayInvoice(
    payload: CreateInvoicePayload
  ): Promise<CreateInvoiceResponse> {
    try {
      console.log("[paymentService] POST /vnpay/create-invoice payload:", payload);
      const res = await apiClient.post<CreateInvoiceResponse>(
        "/vnpay/create-invoice",
        payload
      );

      console.log("[paymentService] /vnpay/create-invoice response:", res.data);

      return res.data;
    } catch (error: any) {
      console.error("[paymentService] createVnpayInvoice failed:", error);
      if (error.response) {
        console.error("➡ Status:", error.response.status);
        console.error("➡ Data:", error.response.data);
      }
      throw new Error(
        error?.response?.data?.message || "Cannot create VNPay payment!"
      );
    }
  },
};

export default paymentService;
