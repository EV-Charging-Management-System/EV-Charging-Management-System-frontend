import { apiClient } from "../utils/api";

export const premiumService = {
  /**
   * 💳 1️⃣ Tạo đăng ký gói Premium & nhận URL thanh toán VNPay
   * Endpoint: POST /api/vnpay/create
   */
  async createSubscription(payload: {
    PackageId: number;
    StartDate: string;
    DurationMonth: string;
  }) {
    try {
      console.log("[premiumService] ➜ Sending payload:", payload);

      const res = await apiClient.post("/vnpay/create", {
        subscriptionId: payload.PackageId,
        amount: 299000, // 💰 giá gói Premium
        orderInfo: "Thanh toán gói Premium",
      });

      console.log("[premiumService] 🔁 Response:", res.data);

      if (res.data?.success) {
        const data = res.data?.data || {};
        return {
          success: true,
          vnpUrl: data.vnpUrl || res.data.vnpUrl || "",
          txnRef: data.txnRef || "",
          message: res.data.message || "Tạo URL thanh toán thành công.",
        };
      }

      return {
        success: false,
        message: res.data?.message || "Không nhận được phản hồi hợp lệ từ server.",
      };
    } catch (error: any) {
      console.error("[premiumService] ❌ Error creating subscription:", error?.response?.data || error.message);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Không thể tạo gói Premium (Lỗi máy chủ hoặc kết nối).",
      };
    }
  },

  /**
   * 👤 2️⃣ Lấy thông tin hội viên Premium hiện tại
   * Endpoint: GET /api/subscriptions/current
   */
  async getCurrentSubscription() {
    try {
      const res = await apiClient.get("/subscriptions/current");
      console.log("[premiumService] ✅ Current subscription:", res.data);

      return {
        success: res.data.success,
        message: res.data.message,
        data: res.data.data || null,
      };
    } catch (error: any) {
      console.error("[premiumService] ❌ getCurrentSubscription error:", error?.response?.data || error.message);
      return {
        success: false,
        message: "Không thể lấy thông tin hội viên hiện tại.",
        data: null,
      };
    }
  },

  /**
   * 🌟 3️⃣ Kiểm tra trạng thái hội viên (Premium hay không)
   * Giúp FE ẩn/hiện nút hoặc alert.
   */
  async checkPremiumStatus() {
    try {
      const res = await apiClient.get("/subscriptions/current");
      const sub = res.data?.data;
      const isPremium = !!(sub && sub.Status === "ACTIVE");

      console.log("[premiumService] 🔎 Premium status:", isPremium ? "ACTIVE" : "NOT ACTIVE");

      return {
        isPremium,
        expireDate: sub?.ExpireDate || null,
        packageId: sub?.PackageId || null,
      };
    } catch (error) {
      console.warn("[premiumService] ⚠️ checkPremiumStatus error:", error);
      return { isPremium: false };
    }
  },
};
