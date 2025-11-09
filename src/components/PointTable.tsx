import React, { useState } from "react";
import { Pencil, Trash2, Plus, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

interface Point {
  PointId: number;
  StationId: number;
  NumberOfPort: number;
  ChargingPointStatus: string;
}

interface PointTableProps {
  points: Point[];
  stationId: number;
  stationName?: string;
  onAdd: (point: Partial<Point>) => Promise<void>;
  onEdit: (point: Point) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onViewPorts: (pointId: number) => void;
  onBack: () => void;
}

const PointTable: React.FC<PointTableProps> = ({
  points,
  stationId,
  stationName,
  onAdd,
  onEdit,
  onDelete,
  onViewPorts,
  onBack,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);
  const [formData, setFormData] = useState({
    numberOfPort: 0,
    chargingPointStatus: "OFFLINE",
  });

  // 🔄 Reset form
  const resetForm = () => {
    setFormData({
      numberOfPort: 0,
      chargingPointStatus: "OFFLINE",
    });
    setEditingPoint(null);
  };

  // ➕ Mở modal thêm mới
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // ✏️ Mở modal chỉnh sửa
  const handleEdit = (point: Point) => {
    setEditingPoint(point);
    setFormData({
      numberOfPort: point.NumberOfPort,
      chargingPointStatus: point.ChargingPointStatus,
    });
    setShowModal(true);
  };

  // 💾 Lưu Point
  const handleSave = async () => {
    if (formData.numberOfPort <= 0) {
      toast.warning("⚠️ Số lượng port phải lớn hơn 0!");
      return;
    }

    if (editingPoint) {
      // Cập nhật Point
      await onEdit({
        ...editingPoint,
        NumberOfPort: formData.numberOfPort,
        ChargingPointStatus: formData.chargingPointStatus,
      });
    } else {
      // Thêm mới Point
      await onAdd({
        StationId: stationId,
        NumberOfPort: formData.numberOfPort,
      });
    }

    setShowModal(false);
    resetForm();
  };

  // 🗑️ Xóa Point
  const handleDelete = async (id: number) => {
    if (window.confirm("⚠️ Bạn có chắc muốn xóa Point này? (Chỉ xóa được khi không còn Port nào)")) {
      await onDelete(id);
    }
  };

  return (
    <div className="table-container">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Quay lại
        </button>
        <div className="page-title">
          <h2>📍 Quản lý Charging Points</h2>
          {stationName && <p className="subtitle">Trạm: {stationName} (ID: {stationId})</p>}
        </div>
      </div>

      <div className="table-actions">
        <div className="table-info">
          <span className="info-badge">Tổng: {points.length} Points</span>
          <span className="info-badge success">
            Available: {points.filter(p => p.ChargingPointStatus === "AVAILABLE").length}
          </span>
          <span className="info-badge warning">
            Busy: {points.filter(p => p.ChargingPointStatus === "BUSY").length}
          </span>
          <span className="info-badge danger">
            Offline: {points.filter(p => p.ChargingPointStatus === "OFFLINE").length}
          </span>
        </div>
        <button className="btn-add" onClick={handleAdd}>
          <Plus size={18} /> Thêm Point
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Point ID</th>
            <th>Station ID</th>
            <th>Số lượng Port</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {points.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ color: "#94a3b8", fontSize: "15px" }}>
                  Không có Charging Point nào trong trạm này
                </p>
              </td>
            </tr>
          ) : (
            points.map((point) => (
              <tr key={point.PointId}>
                <td>
                  <span style={{ fontWeight: 600, color: "#60a5fa" }}>
                    #{point.PointId}
                  </span>
                </td>
                <td>{point.StationId}</td>
                <td>
                  <span className="info-badge">{point.NumberOfPort} Port(s)</span>
                </td>
                <td>
                  <span className={`status-badge ${point.ChargingPointStatus.toLowerCase()}`}>
                    {point.ChargingPointStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-view"
                      onClick={() => onViewPorts(point.PointId)}
                      title="Xem Ports"
                    >
                      📋
                    </button>
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(point)}
                      title="Sửa"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(point.PointId)}
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ========== MODAL THÊM/SỬA POINT ========== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPoint ? "✏️ Sửa Point" : "➕ Thêm Point Mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Số lượng Port *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.numberOfPort}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfPort: Number(e.target.value) })
                  }
                  placeholder="Nhập số lượng port"
                />
              </div>

              {editingPoint && (
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    value={formData.chargingPointStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, chargingPointStatus: e.target.value })
                    }
                  >
                    <option value="AVAILABLE">AVAILABLE - Sẵn sàng</option>
                    <option value="BUSY">BUSY - Đang bận</option>
                    <option value="OFFLINE">OFFLINE - Không hoạt động</option>
                  </select>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Hủy
              </button>
              <button className="btn-save" onClick={handleSave}>
                💾 Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointTable;
