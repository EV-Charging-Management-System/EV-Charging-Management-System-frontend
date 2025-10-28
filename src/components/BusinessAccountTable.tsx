import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AdminDashboard.css"; // để giữ style đồng nhất EV Admin

const BusinessAccountTable: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    try {
      await adminService.approveBusinessAccount(id);
      updateStatus(id, "APPROVED");
      toast.success("✅ Duyệt tài khoản thành công!");
    } catch {
      toast.error("❌ Lỗi khi duyệt tài khoản!");
    }
  };

  // 🔹 Từ chối tài khoản
  const handleReject = async (id: number) => {
    try {
      await adminService.rejectBusinessAccount(id);
      updateStatus(id, "REJECTED");
      toast.warn("⚠️ Đã từ chối tài khoản!");
    } catch {
      toast.error("❌ Lỗi khi từ chối tài khoản!");
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
          {accounts.map((acc) => (
            <tr key={acc.UserId}>
              <td>{acc.UserId}</td>
              <td>{acc.UserName}</td>
              <td>{acc.Mail}</td>
              <td>
                <span
                  className={`status-badge ${
                    acc.AccountStatus === "APPROVED"
                      ? "status-approved"
                      : acc.AccountStatus === "PENDING"
                      ? "status-pending"
                      : "status-rejected"
                  }`}
                >
                  {acc.AccountStatus}
                </span>
              </td>
              <td>
                {acc.AccountStatus === "PENDING" ? (
                  <div className="action-buttons">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(acc.UserId)}
                    >
                      Duyệt
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(acc.UserId)}
                    >
                      Từ chối
                    </button>
                  </div>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

// ✅ Quan trọng: Export default để import trong AdminDashboard.tsx
export default BusinessAccountTable;
