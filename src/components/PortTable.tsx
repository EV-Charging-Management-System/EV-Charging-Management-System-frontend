import React, { useState } from "react";
import { Pencil, Trash2, Plus, X, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

interface Port {
  PortId: number;
  PointId: number;
  PortName: string;
  PortType: string;
  PortStatus: string;
  PortTypeOfKwh?: number;
  PortTypePrice?: number;
}

interface PortTableProps {
  ports: Port[];
  pointId: number;
  stationName?: string;
  onAdd: (port: { 
    PortName: string; 
    PortType: string; 
    PortStatus: string;
    PortTypeOfKwh: number;
    PortTypePrice: number;
  }) => Promise<void>;
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
  // Debug: Print structure of the first port to check fields
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
    portTypeOfKwh: 0,
    portTypePrice: 0,
  });

  // 🔄 Reset form
  const resetForm = () => {
    setFormData({
      portName: "",
      portType: "CCS",
      portStatus: "AVAILABLE",
      portTypeOfKwh: 0,
      portTypePrice: 0,
    });
    setEditingPort(null);
  };

  // ➕ Open add modal
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // ✏️ Open edit modal
  const handleEdit = (port: Port) => {
    setEditingPort(port);
    setFormData({
      portName: port.PortName,
      portType: port.PortType,
      portStatus: port.PortStatus,
      portTypeOfKwh: port.PortTypeOfKwh || 0,
      portTypePrice: port.PortTypePrice || 0,
    });
    setShowModal(true);
  };

  // 💾 Save Port
  const handleSave = async () => {
    if (!formData.portName.trim()) {
      toast.warning("⚠️ Please enter Port name!");
      return;
    }

    if (formData.portTypeOfKwh <= 0) {
      toast.warning("⚠️ Power (kW) must be greater than 0!");
      return;
    }

    if (formData.portTypePrice < 0) {
      toast.warning("⚠️ Price cannot be negative!");
      return;
    }

    if (editingPort) {
      // Update Port
      await onEdit({
        ...editingPort,
        PortName: formData.portName,
        PortType: formData.portType,
        PortStatus: formData.portStatus,
        PortTypeOfKwh: formData.portTypeOfKwh,
        PortTypePrice: formData.portTypePrice,
      });
    } else {
      // Add new Port - no need to pass PointId as it's in context
      await onAdd({
        PortName: formData.portName,
        PortType: formData.portType,
        PortStatus: formData.portStatus,
        PortTypeOfKwh: formData.portTypeOfKwh,
        PortTypePrice: formData.portTypePrice,
      });
    }

    setShowModal(false);
    resetForm();
  };

  // 🗑️ Delete Port
  const handleDelete = async (id: number) => {
    if (window.confirm("⚠️ Are you sure you want to delete this Port?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="table-container">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Points
        </button>
        <div className="page-title">
          <h2>🔌 Charging Ports Management</h2>
          {stationName && <p className="subtitle">Point ID: {pointId} - {stationName}</p>}
        </div>
      </div>

      <div className="table-actions">
        <div className="table-info">
          <span className="info-badge">Total: {ports.length} Ports</span>
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
          <Plus size={18} /> Add Port
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Point ID</th>
            <th>Port Name</th>
            <th>Connector Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!ports || ports.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ color: "#94a3b8", fontSize: "15px" }}>
                  No Ports in this Point
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
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(port.PortId)}
                      title="Delete"
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

      {/* ========== ADD/EDIT PORT MODAL ========== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPort ? "✏️ Edit Port" : "➕ Add New Port"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Port Name</label>
                <input
                  type="text"
                  value={formData.portName}
                  onChange={(e) =>
                    setFormData({ ...formData, portName: e.target.value })
                  }
                  placeholder="e.g. Port A1, Fast Charger 1"
                />
              </div>

              <div className="form-group">
                <label>Connector Type *</label>
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
                <label>Power (kW) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.portTypeOfKwh}
                  onChange={(e) =>
                    setFormData({ ...formData, portTypeOfKwh: Number(e.target.value) })
                  }
                  placeholder="e.g. 7, 22, 50"
                />
              </div>

              <div className="form-group">
                <label>Price (VND) *</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.portTypePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, portTypePrice: Number(e.target.value) })
                  }
                  placeholder="e.g. 5000, 8000"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.portStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, portStatus: e.target.value })
                  }
                >
                  <option value="AVAILABLE">AVAILABLE - Ready</option>
                  <option value="IN_USE">IN_USE - In Use</option>
                  <option value="FAULTY">FAULTY - Faulty</option>
          
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortTable;
