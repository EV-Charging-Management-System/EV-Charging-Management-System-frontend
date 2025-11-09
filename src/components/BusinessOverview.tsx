import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";

interface Props {
  companyId: number;
}

const BusinessOverview: React.FC<Props> = ({ companyId }) => {
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      try {
        const res = await businessService.getCompanyOverview(companyId);
        if (res.success) setOverview(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải tổng quan doanh nghiệp:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  if (loading) return <p>Đang tải...</p>;
  if (!overview) return <p>Không có dữ liệu tổng quan.</p>;

  return (
    <div className="overview-container">
      <h3>📈 Báo Cáo Tổng Quan Doanh Nghiệp</h3>
      <div className="overview-grid">
        <div className="overview-card">
          <h4>Tổng phiên sạc</h4>
          <p>{overview.totalSessions}</p>
        </div>
        <div className="overview-card">
          <h4>Tổng doanh thu</h4>
          <p>{overview.totalRevenue?.toLocaleString("vi-VN")} ₫</p>
        </div>
        <div className="overview-card">
          <h4>Hoá đơn đã thanh toán</h4>
          <p>{overview.paidInvoices}</p>
        </div>
        <div className="overview-card">
          <h4>Hoá đơn chưa thanh toán</h4>
          <p>{overview.unpaidInvoices}</p>
        </div>
        <div className="overview-card">
          <h4>Gói đăng ký hoạt động</h4>
          <p>{overview.subscriptionCount}</p>
        </div>
      </div>

      <h4 style={{ marginTop: "25px", color: "#00ffa3" }}>🏆 Người dùng tích cực nhất</h4>
      <table className="session-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Số phiên sạc</th>
            <th>Tổng chi tiêu (VNĐ)</th>
          </tr>
        </thead>
        <tbody>
          {overview.topUsers?.map((u: any, i: number) => (
            <tr key={i}>
              <td>{u.userId}</td>
              <td>{u.name}</td>
              <td>{u.sessions}</td>
              <td>{u.totalSpent?.toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessOverview;
