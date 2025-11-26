import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";
import { toast } from "react-toastify";

const VehicleManager: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [licensePlate, setLicensePlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  // 🔹 Load vehicle list
  const fetchVehicles = async () => {
    try {
      const res = await businessService.getVehicles();
      setVehicles(res?.data || []);
    } catch (err) {
      toast.error("Unable to load vehicle list!");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 Add vehicle
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!licensePlate.trim() || !brand.trim() || !model.trim()) {
      toast.warn("⚠️ Please fill in all vehicle information!");
      return;
    }

    try {
      const payload = {
        vehicleName: `${brand} ${model}`,
        vehicleType: "Car",
        licensePlate: licensePlate.trim(),
      };

      const res = await businessService.addVehicle(payload);

      if (res?.message?.toLowerCase()?.includes("success")) {
        toast.success("✅ Vehicle added successfully!");
        setLicensePlate("");
        setBrand("");
        setModel("");
        fetchVehicles();
      } else {
        toast.error(res?.message || "Unable to add vehicle!");
      }
    } catch (err) {
      toast.error("Error adding vehicle!");
    }
  };

  // 🔹 Delete vehicle
  const handleDeleteVehicle = async (plate: string) => {
    if (!window.confirm(`Are you sure you want to delete vehicle ${plate}?`))
      return;

    try {
      const res = await businessService.deleteVehicleByPlate(plate);
      if (res?.message?.toLowerCase()?.includes("success")) {
        toast.info(`🗑️ Vehicle ${plate} has been deleted.`);
        fetchVehicles();
      } else {
        toast.error(res?.message || "Unable to delete vehicle.");
      }
    } catch {
      toast.error("Error deleting vehicle!");
    }
  };

  return (
    <div className="vehicle-manager fade-in">
      <h2 className="section-title">🚗 Business Vehicle Management</h2>

      {/* Vehicle Form – 2-column layout */}
      <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
        <div className="vehicle-row">
          <input
            type="text"
            className="vehicle-input"
            placeholder="License Plate (e.g., 51A-123.45)"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />

          <input
            type="text"
            className="vehicle-input"
            placeholder="Brand (e.g., VinFast, Toyota, Tesla)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className="vehicle-row">
          <input
            type="text"
            className="vehicle-input"
            placeholder="Model (e.g., VF8, Vios, Model 3)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          {/* Blank slot for alignment */}
          <div style={{ flex: 1 }}></div>
        </div>

        <button type="submit" className="btn-premium">
          ➕ Add Vehicle
        </button>
      </form>

      {/* VEHICLE LIST */}
      {vehicles.length === 0 ? (
        <p className="empty-text">No vehicles registered yet.</p>
      ) : (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>License Plate</th>
              <th>Vehicle Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => {
              const rawName = v.VehicleName || v.vehicleName || "";

              const cleanName = rawName
                .replace(/^car\s+/i, "")
                .replace(/^bike\s+/i, "")
                .replace(/^truck\s+/i, "");

              return (
                <tr key={v.VehicleId || v.vehicleId}>
                  <td>{v.LicensePlate || v.licensePlate}</td>
                  <td>{cleanName}</td>
                  <td>{v.VehicleType || v.vehicleType}</td>

                  <td>
                    <button
                      className="btn-delete"
                      onClick={() =>
                        handleDeleteVehicle(v.LicensePlate || v.licensePlate)
                      }
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VehicleManager;
