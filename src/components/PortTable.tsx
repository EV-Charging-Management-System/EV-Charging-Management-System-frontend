import React, { useState } from "react";
import { Pencil, Trash2, Plus, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

interface Port {
  PortId: number;
  PointId: number;
  PortName: string;
  PortType: string;
  PortStatus: string;
}

interface PortTableProps {
  ports: Port[];
  pointId: number;
  stationName?: string;
  onAdd: (port: Partial<Port>) => Promise<void>;
  onEdit: (port: Port) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onBack: () => void;
}

const PortTable: React.FC<PortTableProps> = ({
  ports,
  pointId,
  stationName,
  onAdd,
  onEdit,
  onDelete,
  onBack,
}) => {
  // Debug: In ra structure của port đầu tiên để xem các trường
  if (ports && ports.length > 0) {
    console.log("🔍 Port structure:", ports[0]);
    console.log("🔍 Port keys:", Object.keys(ports[0]));
  }
  
  const [showModal, setShowModal] = useState(false);
  const [editingPort, setEditingPort] = useState<Port | null>(null);
  const [formData, setFormData] = useState({
    portName: "",
    portType: "CCS",
    portStatus: "AVAILABLE",
  });

  // 🔄 Reset form
  const resetForm = () => {
    setFormData({
      portName: "",
      portType: "CCS",
      portStatus: "AVAILABLE",
    });
    setEditingPort(null);
  };

  // ➕ Mở modal thêm mới
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // ✏️ Mở modal chỉnh sửa
  const handleEdit = (port: Port) => {
    setEditingPort(port);
    setFormData({
      portName: port.PortName,
      portType: port.PortType,
      portStatus: port.PortStatus,
    });
    setShowModal(true);
  };

  // 💾 Lưu Port
  const handleSave = async () => {
    if (!formData.portName.trim()) {
      toast.warning("⚠️ Vui lòng nhập tên Port!");
      return;
    }

    if (editingPort) {
      // Cập nhật Port
      await onEdit({
        ...editingPort,
        PortName: formData.portName,
        PortType: formData.portType,
        PortStatus: formData.portStatus,
      });
    } else {
      // Thêm mới Port
      await onAdd({
        PointId: pointId,
        PortName: formData.portName,
        PortType: formData.portType,
        PortStatus: formData.portStatus,
      });
    }

    setShowModal(false);
    resetForm();
  };

  // 🗑️ Xóa Port
  const handleDelete = async (id: number) => {
    if (window.confirm("⚠️ Bạn có chắc muốn xóa Port này?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="table-container">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Quay lại Points
        </button>
        <div className="page-title">
          <h2>🔌 Quản lý Charging Ports</h2>
          {stationName && <p className="subtitle">Point ID: {pointId} - {stationName}</p>}
        </div>
      </div>

      <div className="table-actions">
        <div className="table-info">
          <span className="info-badge">Tổng: {ports.length} Ports</span>
          <span className="info-badge success">
            Available: {ports.filter(p => p.PortStatus === "AVAILABLE").length}
          </span>
          <span className="info-badge warning">
            In Use: {ports.filter(p => p.PortStatus === "IN_USE").length}
          </span>
          <span className="info-badge danger">
            Maintenance: {ports.filter(p => p.PortStatus === "MAINTENANCE").length}
          </span>
        </div>
        <button className="btn-add" onClick={handleAdd}>
          <Plus size={18} /> Thêm Port
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Point ID</th>
            <th>Tên Port</th>
            <th>Loại Connector</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {!ports || ports.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ color: "#94a3b8", fontSize: "15px" }}>
                  Không có Port nào trong Point này
                </p>
              </td>
            </tr>
          ) : (
            ports.map((port) => (
              <tr key={port.PortId}>
                <td>
                  <span style={{ fontWeight: 600, color: "#60a5fa" }}>
                    #{port.PortId}
                  </span>
                </td>
                <td>{port.PointId}</td>
                <td>
                  <span style={{ fontWeight: 500 }}>
                    {port.PortName || `Port ${port.PortType} #${port.PortId}`}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span className="badge-type">{port.PortType}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${port.PortStatus.toLowerCase().replace("_", "")}`}>
                    {port.PortStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(port)}
                      title="Sửa"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(port.PortId)}
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

      {/* ========== MODAL THÊM/SỬA PORT ========== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPort ? "✏️ Sửa Port" : "➕ Thêm Port Mới"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Tên Port</label>
                <input
                  type="text"
                  value={formData.portName}
                  onChange={(e) =>
                    setFormData({ ...formData, portName: e.target.value })
                  }
                  placeholder="Ví dụ: Port A1, Fast Charger 1"
                />
              </div>

              <div className="form-group">
                <label>Loại Connector *</label>
                <select
                  value={formData.portType}
                  onChange={(e) =>
                    setFormData({ ...formData, portType: e.target.value })
                  }
                >
                  <option value="CCS">CCS</option>
                  <option value="CHAdeMO">CHAdeMO</option>
                  <option value="Type 2 (Mennekes)">Type 2 (Mennekes)</option>
                  <option value="Type 1 (J1772)">Type 1 (J1772)</option>
                  <option value="J1772">J1772</option>
                  <option value="GB/T">GB/T</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formData.portStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, portStatus: e.target.value })
                  }
                >
                  <option value="AVAILABLE">AVAILABLE - Sẵn sàng</option>
                  <option value="IN_USE">IN_USE - Đang sử dụng</option>
                  <option value="FAULTY">FAULTY - Hỏng</option>
          
                </select>
              </div>
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

export default PortTable;
