import { apiClient } from "../utils/api";

export const businessService = {
  /**
   * 🟢 Gửi yêu cầu nâng cấp doanh nghiệp
   * Gọi API: POST /api/business/upgrade-request
   */
  async requestUpgrade(userId: number) {
    try {
      const res = await apiClient.post("/business/upgrade-request", { userId });
      console.log("[businessService] ✅ Response:", res.data);
      return res.data;
    } catch (err: any) {
      console.error("[businessService] ❌ Error:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Không thể gửi yêu cầu nâng cấp.",
      };
    }
  },

  /**
   * 🟡 (Tuỳ chọn) Lấy danh sách yêu cầu chờ duyệt (Admin)
   * Gọi API: GET /api/admin/approvals
   */
  async getPendingApprovals() {
    try {
      const res = await apiClient.get("/admin/approvals");
      return res.data?.data || [];
    } catch (err) {
      console.error("[businessService] ❌ Error fetching pending approvals:", err);
      return [];
    }
  },

  /**
   * 🟢 (Tuỳ chọn) Admin duyệt yêu cầu doanh nghiệp
   * Gọi API: PATCH /api/admin/approvals/:id/approve
   */
  async approveBusiness(userId: number) {
    try {
      const res = await apiClient.patch(`/admin/approvals/${userId}/approve`);
      return res.data;
    } catch (err: any) {
      console.error("[businessService] ❌ Error approving business:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Không thể duyệt yêu cầu.",
      };
    }
  },

  /**
   * 🔴 (Tuỳ chọn) Admin từ chối yêu cầu doanh nghiệp
   * Gọi API: PATCH /api/admin/approvals/:id/reject
   */
  async rejectBusiness(userId: number) {
    try {
      const res = await apiClient.patch(`/admin/approvals/${userId}/reject`);
      return res.data;
    } catch (err: any) {
      console.error("[businessService] ❌ Error rejecting business:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Không thể từ chối yêu cầu.",
      };
    }
  },
};
