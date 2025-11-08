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
    <div className="session-history">
      <h3>Lịch sử sạc của công ty #{companyId}</h3>
      <table className="session-table">
        <thead>
          <tr>
            <th>Mã phiên</th>
            <th>Xe (VehicleId)</th>
            <th>Thời gian bắt đầu</th>
            <th>Thời gian kết thúc</th>
            <th>Thời lượng (giờ)</th>
            <th>Trạng thái</th>
            <th>Tổng tiền (VNĐ)</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, i) => (
            <tr key={i}>
              <td>{s.SessionId}</td>
              <td>{s.VehicleId}</td>
              <td>{s.CheckinTime ? new Date(s.CheckinTime).toLocaleString() : "—"}</td>
              <td>{s.CheckoutTime ? new Date(s.CheckoutTime).toLocaleString() : "—"}</td>
              <td>{s.TotalTime}</td>
              <td>{s.ChargingStatus}</td>
              <td>{s.SessionPrice?.toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionHistory;
