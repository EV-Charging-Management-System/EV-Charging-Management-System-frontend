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

  // Fetch station list from backend
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
        setStations(
          (data || []).map((s: any, idx: number) => ({
            StationId: s.StationId ?? s.id ?? idx + 1,
            StationName: s.StationName ?? s.name ?? `Station ${idx + 1}`,
            Address: s.Address ?? s.address ?? "",
            StationStatus: (s.StationStatus ?? s.status ?? "INACTIVE").toUpperCase(),
            ChargingPointTotal: s.ChargingPointTotal ?? s.total ?? 0,
          }))
        );
      } catch (err: any) {
        console.error("Failed to load stations", err);
        setError(err?.message || "Cannot get station list");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [propStations]);

  // Open add station modal
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setNewStation({ StationName: "", Address: "", StationDescrip: "", StationStatus: "ACTIVE", ChargingPointTotal: 0 });
    setShowModal(false);
  };

  // Add new station
  const handleAddStation = async () => {
    if (!newStation.StationName || !newStation.Address || !newStation.StationDescrip) {
      toast.warn("Please fill in all information!");
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
        toast.success(res.message || "Successfully added new charging station!");
        closeModal();
        if (onAdd) {
          onAdd();
        }
      } else {
        toast.error(res.message || "Error creating charging station");
      }
    } catch (error) {
      console.error("Error creating station:", error);
      toast.error("Error creating charging station!");
    }
  };

  // Toggle maintenance/active status
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
        toast.success(`Station "${st.StationName}" has been reactivated!`);
      } else {
        toast.info(`Station "${st.StationName}" is now under maintenance.`);
      }
    }
  };

  return (
    <section className="data-section">
      <div className="data-section-header">
        <h2>⚡ Charging Station List</h2>
        <button className="btn-add" onClick={openModal}>
          + Add Charging Station
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Station Name</th>
            <th>Address</th>
            <th>Status</th>
            <th>Total Charging Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "18px" }}>
                Loading station list...
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
                No charging stations found
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
                        Delete
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
                        {s.StationStatus === "MAINTENANCE" ? "Reactivate" : "Maintenance"}
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
            <h3>➕ Add New Charging Station</h3>

            <label>Station Name</label>
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

            <label>Address</label>
            <input
              type="text"
              value={newStation.Address}
              onChange={(e) =>
                setNewStation({ ...newStation, Address: e.target.value })
              }
            />

            <label>Station Description</label>
            <input
              type="text"
              value={newStation.StationDescrip}
              onChange={(e) =>
                setNewStation({ ...newStation, StationDescrip: e.target.value })
              }
            />

            <label>Status</label>
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

            <label>Total Charging Points</label>
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
                Save
              </button>
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default StationTable;
