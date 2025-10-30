import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AdminDashboard.css"; // style đồng nhất EV Admin

const BusinessAccountTable: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // 🔹 Lấy danh sách tài khoản doanh nghiệp
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await adminService.getBusinessAccounts();
        setAccounts(data);
      } catch (err) {
        console.error(err);
        toast.error("❌ Không thể tải danh sách doanh nghiệp!");
      } finally {
        setLoading(false);
      }
    };
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
      updateStatus(id, "APPROVED");
      toast.success(res.message || "✅ Duyệt tài khoản thành công!");
    } catch {
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
      updateStatus(id, "REJECTED");
      toast.warn(res.message || "⚠️ Đã từ chối tài khoản!");
    } catch {
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

  // 🔹 Render bảng dữ liệu
  return (
    <section className="admin-section">
      <h2>🏢 Danh sách tài khoản doanh nghiệp</h2>
      <p className="section-desc">
        Quản trị viên có thể duyệt hoặc từ chối các tài khoản doanh nghiệp đăng ký mới.
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên doanh nghiệp</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => {
            const status = acc.AccountStatus || "PENDING"; // ✅ fallback khi BE chưa có status
            return (
              <tr key={acc.UserId}>
                <td>{acc.UserId}</td>
                <td>{acc.UserName}</td>
                <td>{acc.Mail}</td>
                <td>
                  <span
                    className={`status-badge ${
                      status === "APPROVED"
                        ? "status-approved"
                        : status === "PENDING"
                        ? "status-pending"
                        : "status-rejected"
                    }`}
                  >
                    {status}
                  </span>
                </td>
                <td>
                  {status === "PENDING" ? (
                    <div className="action-buttons">
                      <button
                        className="btn-approve"
                        disabled={processingId === acc.UserId}
                        onClick={() => handleApprove(acc.UserId)}
                      >
                        {processingId === acc.UserId ? "Đang duyệt..." : "Duyệt"}
                      </button>
                      <button
                        className="btn-reject"
                        disabled={processingId === acc.UserId}
                        onClick={() => handleReject(acc.UserId)}
                      >
                        {processingId === acc.UserId ? "Đang từ chối..." : "Từ chối"}
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
