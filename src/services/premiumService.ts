import { apiClient } from "../utils/api";

export const premiumService = {
  /**
   * 💳 1️⃣ Create Premium subscription & get VNPay payment URL
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

      // 🧩 Check if backend returns error "already has ACTIVE package"
      if (res?.data?.success === false) {
        return {
          success: false,
          message: res?.data?.message || "Cannot create new Premium package.",
        };
      }

      if (vnpUrl && vnpUrl.startsWith("http")) {
        return {
          success: true,
          vnpUrl,
          txnRef: data?.TxnRef || "",
          message: res?.data?.message || "Payment URL created successfully.",
        };
      }

      return {
        success: false,
        message:
          res?.data?.message ||
          "Payment URL not received from server.",
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
          "Cannot create Premium package (Server or connection error).",
      };
    }
  },

  /**
   * 👤 2️⃣ Get current Premium membership information
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
        message: "Cannot get current member information.",
        data: null,
      };
    }
  },

  /**
   * 🌟 3️⃣ Check membership status (Premium or not)
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
