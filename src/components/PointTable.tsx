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
  onAdd: (numberOfPort: number) => Promise<void>;
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

  // ➕ Open add modal
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // ✏️ Open edit modal
  const handleEdit = (point: Point) => {
    setEditingPoint(point);
    setFormData({
      numberOfPort: point.NumberOfPort,
      chargingPointStatus: point.ChargingPointStatus,
    });
    setShowModal(true);
  };

  // 💾 Save Point
  const handleSave = async () => {
    if (formData.numberOfPort <= 0) {
      toast.warning("⚠️ Number of ports must be greater than 0!");
      return;
    }

    if (editingPoint) {
      // Update Point
      await onEdit({
        ...editingPoint,
        NumberOfPort: formData.numberOfPort,
        ChargingPointStatus: formData.chargingPointStatus,
      });
    } else {
      // Add new Point
      await onAdd(formData.numberOfPort);
    }

    setShowModal(false);
    resetForm();
  };

  // 🗑️ Delete Point
  const handleDelete = async (id: number) => {
    if (window.confirm("⚠️ Are you sure you want to delete this Point? (You can only delete when there are no Ports left)")) {
      await onDelete(id);
    }
  };

  return (
    <div className="table-container">
      <div className="page-header">
        <button className="btn-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </button>
        <div className="page-title">
          <h2>📍 Charging Points Management</h2>
          {stationName && <p className="subtitle">Station: {stationName} (ID: {stationId})</p>}
        </div>
      </div>

      <div className="table-actions">
        <div className="table-info">
          <span className="info-badge">Total: {points.length} Points</span>
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
          <Plus size={18} /> Add Point
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Point ID</th>
            <th>Station ID</th>
            <th>Number of Ports</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {points.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ color: "#94a3b8", fontSize: "15px" }}>
                  There are no Charging Points in this station
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
                      title="View Ports"
                    >
                      📋
                    </button>
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(point)}
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(point.PointId)}
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

      {/* ========== ADD/EDIT POINT MODAL ========== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingPoint ? "✏️ Edit Point" : "➕ Add New Point"}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Number of Ports *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.numberOfPort}
                  onChange={(e) =>
                    setFormData({ ...formData, numberOfPort: Number(e.target.value) })
                  }
                  placeholder="Enter number of ports"
                />
              </div>

              {editingPoint && (
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.chargingPointStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, chargingPointStatus: e.target.value })
                    }
                  >
                    <option value="AVAILABLE">AVAILABLE - Ready</option>
                    <option value="BUSY">BUSY - In Use</option>
                    <option value="OFFLINE">OFFLINE - Offline</option>
                  </select>
                </div>
              )}
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

export default PointTable;
