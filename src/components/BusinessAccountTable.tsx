import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AdminDashboard.css"; // dùng style chung

const BusinessAccountTable: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // 🔹 Lấy danh sách tài khoản doanh nghiệp chờ duyệt
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBusinessAccounts();
      if (Array.isArray(res?.data)) setAccounts(res.data);
      else if (Array.isArray(res)) setAccounts(res);
      else setAccounts([]);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách doanh nghiệp:", err);
      toast.error("Không thể tải danh sách doanh nghiệp!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // 🔹 Cập nhật trạng thái trong FE
  const updateStatus = (id: number, status: string) =>
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.UserId === id ? { ...acc, AccountStatus: status } : acc
      )
    );

  // 🔹 Duyệt tài khoản
  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await adminService.approveBusinessAccount(id);
      if (res.success) {
        updateStatus(id, "APPROVED");
        toast.success(res.message || "✅ Đã duyệt tài khoản doanh nghiệp!");
        await fetchAccounts();
      } else {
        toast.error(res.message || "❌ Duyệt thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi duyệt tài khoản!");
    } finally {
      setProcessingId(null);
    }
  };

  // 🔹 Từ chối tài khoản
  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await adminService.rejectBusinessAccount(id);
      if (res.success) {
        updateStatus(id, "REJECTED");
        toast.info(res.message || "🚫 Đã từ chối yêu cầu!");
        await fetchAccounts();
      } else {
        toast.error(res.message || "❌ Từ chối thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi từ chối tài khoản!");
    } finally {
      setProcessingId(null);
    }
  };

  // 🔹 Hiển thị loading spinner
  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải danh sách doanh nghiệp...</p>
      </div>
    );

  // 🔹 Nếu không có dữ liệu
  if (!accounts.length)
    return (
      <div className="empty-container">
        <p>Không có tài khoản doanh nghiệp nào đang chờ duyệt.</p>
      </div>
    );

  // 🔹 Render bảng
  return (
    <section className="admin-section">
      <h2>🏢 Danh sách tài khoản doanh nghiệp</h2>
      <p className="section-desc">
        Quản trị viên có thể duyệt hoặc từ chối yêu cầu nâng cấp doanh nghiệp.
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => {
            const status = acc.AccountStatus || acc.RoleName || "PENDING";
            return (
              <tr key={acc.UserId}>
                <td>{acc.UserId}</td>
                <td>{acc.UserName}</td>
                <td>{acc.Mail}</td>
                <td>
                  <span
                    className={`status-badge ${
                      status === "BUSINESS" || status === "APPROVED"
                        ? "status-approved"
                        : status === "PENDING_BUSINESS" || status === "PENDING"
                        ? "status-pending"
                        : "status-rejected"
                    }`}
                  >
                    {status === "BUSINESS" ? "APPROVED" : status}
                  </span>
                </td>
                <td>
                  {status === "PENDING_BUSINESS" || status === "PENDING" ? (
                    <div className="action-buttons">
                      <button
                        className="btn-approve"
                        disabled={processingId === acc.UserId}
                        onClick={() => handleApprove(acc.UserId)}
                      >
                        {processingId === acc.UserId
                          ? "Đang duyệt..."
                          : "Duyệt"}
                      </button>
                      <button
                        className="btn-reject"
                        disabled={processingId === acc.UserId}
                        onClick={() => handleReject(acc.UserId)}
                      >
                        {processingId === acc.UserId
                          ? "Đang từ chối..."
                          : "Từ chối"}
                      </button>
                    </div>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default BusinessAccountTable;
