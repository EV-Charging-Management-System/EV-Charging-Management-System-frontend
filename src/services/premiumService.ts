import { apiClient } from "../utils/api";

export const premiumService = {
  /**
   * 💳 1️⃣ Tạo đăng ký gói Premium & nhận URL thanh toán VNPay
   * Endpoint: POST /api/subscriptions
   */
  async createSubscription(payload: {
    PackageId: number;
    StartDate: string;
    DurationMonth: string;
  }) {
    try {
      console.log("[premiumService] ➜ Sending payload:", payload);

      const res = await apiClient.post("/subscriptions", {
        PackageId: payload.PackageId,
        StartDate: payload.StartDate,
        DurationMonth: payload.DurationMonth,
      });

      console.log("[premiumService] 🔁 Response:", res.data);

      const data = res?.data?.data || {};
      const vnpUrl = data?.vnpUrl || res?.data?.vnpUrl || res?.vnpUrl || "";

      // 🧩 Kiểm tra backend trả lỗi "đã có gói ACTIVE"
      if (res?.data?.success === false) {
        return {
          success: false,
          message: res?.data?.message || "Không thể tạo gói Premium mới.",
        };
      }

      if (vnpUrl && vnpUrl.startsWith("http")) {
        return {
          success: true,
          vnpUrl,
          txnRef: data?.TxnRef || "",
          message: res?.data?.message || "Tạo URL thanh toán thành công.",
        };
      }

      return {
        success: false,
        message:
          res?.data?.message ||
          "Không nhận được đường dẫn thanh toán từ máy chủ.",
      };
    } catch (error: any) {
      console.error(
        "[premiumService] ❌ Error creating subscription:",
        error?.response?.data || error.message
      );

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
        success: res.data.success ?? true,
        message: res.data.message,
        data: res.data.data || null,
      };
    } catch (error: any) {
      console.error(
        "[premiumService] ❌ getCurrentSubscription error:",
        error?.response?.data || error.message
      );
      return {
        success: false,
        message: "Không thể lấy thông tin hội viên hiện tại.",
        data: null,
      };
    }
  },

  /**
   * 🌟 3️⃣ Kiểm tra trạng thái hội viên (Premium hay không)
   */
  async checkPremiumStatus() {
    try {
      const res = await apiClient.get("/subscriptions/current");
      const sub = res.data?.data;
      const isPremium = !!(sub && sub.SubStatus === "ACTIVE");

      console.log(
        "[premiumService] 🔎 Premium status:",
        isPremium ? "ACTIVE" : "NOT ACTIVE"
      );

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
