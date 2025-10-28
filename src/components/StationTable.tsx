import React, { useState, useEffect } from "react";
import "../css/AdminDashboard.css";
import { toast } from "react-toastify";

interface Station {
  StationId: number;
  StationName: string;
  Address: string;
  StationStatus: string;
  ChargingPointTotal: number;
}

const StationTable: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newStation, setNewStation] = useState({
    StationName: "",
    Address: "",
    ChargingPointTotal: 0,
  });

  // 🧩 Mock dữ liệu ban đầu
  useEffect(() => {
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

  // 🆕 Mở modal thêm trạm
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setNewStation({ StationName: "", Address: "", ChargingPointTotal: 0 });
    setShowModal(false);
  };

  // ✅ Thêm trạm mới (giả lập)
  const handleAddStation = () => {
    if (!newStation.StationName || !newStation.Address) {
      toast.warn("⚠️ Vui lòng nhập đủ thông tin!");
      return;
    }

    const newItem: Station = {
      StationId: stations.length + 1,
      StationName: newStation.StationName,
      Address: newStation.Address,
      ChargingPointTotal: Number(newStation.ChargingPointTotal),
      StationStatus: "ACTIVE",
    };

    setStations([...stations, newItem]);
    toast.success("✅ Thêm trạm sạc thành công!");
    closeModal();
  };

  // 🔧 Đổi trạng thái bảo trì / kích hoạt
  const toggleStatus = (id: number) => {
    setStations((prev) =>
      prev.map((s) =>
        s.StationId === id
          ? {
              ...s,
              StationStatus:
                s.StationStatus === "MAINTENANCE" ? "ACTIVE" : "MAINTENANCE",
            }
          : s
      )
    );

    const st = stations.find((s) => s.StationId === id);
    if (st) {
      if (st.StationStatus === "MAINTENANCE") {
        toast.success(`🟢 Trạm "${st.StationName}" đã được kích hoạt lại!`);
      } else {
        toast.info(`🛠️ Trạm "${st.StationName}" đã chuyển sang bảo trì.`);
      }
    }
  };

  return (
    <section className="data-section">
      <div className="data-section-header">
        <h2>⚡ Danh sách trạm sạc</h2>
        <button className="btn-add" onClick={openModal}>
          + Thêm trạm sạc
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên trạm</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Tổng điểm sạc</th>
            <th>Thao tác</th>
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
                      ? "status-approved"
                      : s.StationStatus === "MAINTENANCE"
                      ? "status-pending"
                      : "status-rejected"
                  }`}
                >
                  {s.StationStatus}
                </span>
              </td>
              <td>{s.ChargingPointTotal}</td>
              <td>
                {s.StationStatus !== "INACTIVE" && (
                  <button
                    className={
                      s.StationStatus === "MAINTENANCE"
                        ? "btn-approve"
                        : "btn-reject"
                    }
                    onClick={() => toggleStatus(s.StationId)}
                  >
                    {s.StationStatus === "MAINTENANCE"
                      ? "Kích hoạt lại"
                      : "Bảo trì"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* === MODAL === */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>➕ Thêm trạm sạc mới</h3>

            <label>Tên trạm</label>
            <input
              type="text"
              value={newStation.StationName}
              onChange={(e) =>
                setNewStation({
                  ...newStation,
                  StationName: e.target.value,
                })
              }
            />

            <label>Địa chỉ</label>
            <input
              type="text"
              value={newStation.Address}
              onChange={(e) =>
                setNewStation({ ...newStation, Address: e.target.value })
              }
            />

            <label>Tổng điểm sạc</label>
            <input
              type="number"
              value={newStation.ChargingPointTotal}
              onChange={(e) =>
                setNewStation({
                  ...newStation,
                  ChargingPointTotal: Number(e.target.value),
                })
              }
            />

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleAddStation}>
                Lưu
              </button>
              <button className="btn-cancel" onClick={closeModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StationTable;
