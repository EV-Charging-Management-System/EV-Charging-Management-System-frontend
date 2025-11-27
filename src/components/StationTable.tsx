import React, { useState, useEffect } from "react";
import "../css/AdminDashboard.css";
import { toast } from "react-toastify";
import { adminService } from "../services/adminService";
import { Eye } from "lucide-react";

interface Station {
  StationId: number;
  StationName: string;
  Address: string;
  StationStatus: string;
  ChargingPointTotal: number;
}

interface StationTableProps {
  stations?: Station[];
  onAdd?: () => void;
  onEdit?: (station: Station) => void;
  onDelete?: (id: number) => void;
  onViewPoints?: (stationId: number) => void;
}

const StationTable: React.FC<StationTableProps> = ({
  stations: propStations,
  onAdd,
  onEdit,
  onDelete,
  onViewPoints,
}) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStation, setNewStation] = useState({
    StationName: "",
    Address: "",
    StationDescrip: "",
    StationStatus: "ACTIVE",
    ChargingPointTotal: 0,
  });

  // Lấy danh sách trạm từ backend
  useEffect(() => {
    if (propStations) {
      setStations(propStations);
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminService.getAllStations();
        if (!mounted) return;
        // adminService returns array of stations or []
        setStations(
          (data || []).map((s: any, idx: number) => ({
            StationId: s.StationId ?? s.id ?? idx + 1,
            StationName: s.StationName ?? s.name ?? `Trạm ${idx + 1}`,
            Address: s.Address ?? s.address ?? "",
            StationStatus: (s.StationStatus ?? s.status ?? "INACTIVE").toUpperCase(),
            ChargingPointTotal: s.ChargingPointTotal ?? s.total ?? 0,
          }))
        );
      } catch (err: any) {
        console.error("Failed to load stations", err);
        setError(err?.message || "Không thể lấy danh sách trạm");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [propStations]);

  // 🆕 Mở modal thêm trạm
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setNewStation({ StationName: "", Address: "", StationDescrip: "", StationStatus: "ACTIVE", ChargingPointTotal: 0 });
    setShowModal(false);
  };

  // ✅ Thêm trạm mới
  const handleAddStation = async () => {
    if (!newStation.StationName || !newStation.Address || !newStation.StationDescrip) {
      toast.warn("⚠️ Vui lòng nhập đủ thông tin!");
      return;
    }

    try {
      const res = await adminService.createStation(
        newStation.StationName,
        newStation.Address,
        newStation.StationDescrip,
        newStation.StationStatus,
        Number(newStation.ChargingPointTotal)
      );

      if (res.success) {
        toast.success(res.message || "✅ Thêm trạm sạc thành công!");
        closeModal();
        // Gọi callback để refresh danh sách
        if (onAdd) {
          onAdd();
        }
      } else {
        toast.error(res.message || "Lỗi khi tạo trạm sạc");
      }
    } catch (error) {
      console.error("Error creating station:", error);
      toast.error("Lỗi khi tạo trạm sạc!");
    }
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
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "18px" }}>
                Đang tải danh sách trạm...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", color: "#f1c40f" }}>
                {error}
              </td>
            </tr>
          ) : stations.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "18px" }}>
                Không tìm thấy trạm sạc
              </td>
            </tr>
          ) : (
            stations.map((s) => (
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
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {onViewPoints && (
                      <button
                        className="btn-approve"
                        onClick={() => onViewPoints(s.StationId)}
                        style={{ display: "flex", alignItems: "center", gap: "4px" }}
                      >
                        <Eye size={16} /> Points
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn-reject"
                        onClick={() => onDelete(s.StationId)}
                      >
                        Xóa
                      </button>
                    )}
                    {s.StationStatus !== "INACTIVE" && (
                      <button
                        className={
                          s.StationStatus === "MAINTENANCE"
                            ? "btn-approve"
                            : "btn-reject"
                        }
                        onClick={() => toggleStatus(s.StationId)}
                      >
                        {s.StationStatus === "MAINTENANCE" ? "Kích hoạt lại" : "Bảo trì"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
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

            <label>Mô tả trạm</label>
            <input
              type="text"
              value={newStation.StationDescrip}
              onChange={(e) =>
                setNewStation({ ...newStation, StationDescrip: e.target.value })
              }
            />

            <label>Trạng thái</label>
            <select
              value={newStation.StationStatus}
              onChange={(e) =>
                setNewStation({ ...newStation, StationStatus: e.target.value })
              }
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>

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
