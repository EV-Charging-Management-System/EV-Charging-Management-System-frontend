import React, { useState, useEffect } from "react";
import "../css/AdminDashboard.css";

interface Station {
  StationId: number;
  StationName: string;
  Address: string;
  StationStatus: string;
  ChargingPointTotal: number;
}

const StationTable: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    // 🎯 Dữ liệu mẫu
    const mockStations: Station[] = [
      {
        StationId: 1,
        StationName: "Trạm Sạc Trung Tâm",
        Address: "123 Đường Lê Lợi, TP.HCM",
        StationStatus: "ACTIVE",
        ChargingPointTotal: 8,
      },
      {
        StationId: 2,
        StationName: "Trạm Sạc Bình Dương",
        Address: "45 Nguyễn Huệ, Bình Dương",
        StationStatus: "MAINTENANCE",
        ChargingPointTotal: 6,
      },
      {
        StationId: 3,
        StationName: "Trạm Sạc Hà Nội",
        Address: "12 Cầu Giấy, Hà Nội",
        StationStatus: "INACTIVE",
        ChargingPointTotal: 10,
      },
    ];
    setStations(mockStations);
  }, []);

  return (
    <section className="data-section">
      <div className="data-section-header">
        <h2>⚡ Danh sách trạm sạc</h2>
        <button className="btn-add">+ Thêm trạm sạc</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên trạm</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Tổng điểm sạc</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((s) => (
            <tr key={s.StationId}>
              <td>{s.StationId}</td>
              <td>{s.StationName}</td>
              <td>{s.Address}</td>
              <td>
                <span
                  className={`status-badge ${
                    s.StationStatus === "ACTIVE"
                      ? "active"
                      : s.StationStatus === "MAINTENANCE"
                      ? "warn"
                      : "inactive"
                  }`}
                >
                  {s.StationStatus}
                </span>
              </td>
              <td>{s.ChargingPointTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default StationTable;
