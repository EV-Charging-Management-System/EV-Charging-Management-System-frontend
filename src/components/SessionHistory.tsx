import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";

interface Props {
  companyId: number;
}

const SessionHistory: React.FC<Props> = ({ companyId }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchData = async () => {
      try {
        const res = await businessService.getCompanySessions(companyId);
        if (res?.success && Array.isArray(res.data)) {
          setSessions(res.data);
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error("❌ Lỗi tải lịch sử sạc:", err);
        setSessions([]);
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
      <h3>⚡ Lịch Sử Sạc Của Công Ty #{companyId}</h3>

      <table className="session-table">
        <thead>
          <tr>
            <th>Mã phiên</th>
            <th>Biển số</th>
            <th>Tên xe</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Thời lượng (phút)</th>
            <th>Trạng thái</th>
            <th>Tổng tiền (VNĐ)</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((s) => (
            <tr key={s.SessionId}>
              <td>{s.SessionId}</td>
              <td>{s.LicensePlate}</td>
              <td>{s.VehicleName}</td>
              <td>{new Date(s.CheckinTime).toLocaleString("vi-VN")}</td>
              <td>{new Date(s.CheckoutTime).toLocaleString("vi-VN")}</td>
              <td>{s.TotalTime}</td>
              <td>{s.ChargingStatus}</td>
              <td>{s.SessionPrice?.toLocaleString("vi-VN") ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionHistory;
