import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";

interface Props {
  companyId: number;
}

const SessionHistory: React.FC<Props> = ({ companyId }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!companyId) return;
      try {
        const res = await businessService.getCompanySessions(companyId);
        if (res.success) setSessions(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi tải lịch sử sạc:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [companyId]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  if (!sessions.length)
    return <p>⚠️ Chưa có lịch sử sạc nào cho công ty này.</p>;

  return (
    <table className="session-table">
      <thead>
        <tr>
          <th>Mã phiên</th>
          <th>Xe</th>
          <th>Thời gian bắt đầu</th>
          <th>Thời gian kết thúc</th>
          <th>Năng lượng (kWh)</th>
          <th>Tổng tiền (VNĐ)</th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((s, i) => (
          <tr key={i}>
            <td>{s.SessionId}</td>
            <td>{s.LicensePlate || "N/A"}</td>
            <td>{new Date(s.StartTime).toLocaleString()}</td>
            <td>{new Date(s.EndTime).toLocaleString()}</td>
            <td>{s.EnergyUsed}</td>
            <td>{s.TotalCost?.toLocaleString("vi-VN")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SessionHistory;
