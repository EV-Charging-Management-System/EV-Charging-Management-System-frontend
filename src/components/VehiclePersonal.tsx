import React, { useEffect, useState } from "react";
import { vehicleService } from "../../services/vehicleService";
import { toast } from "react-toastify";
import "../../css/VehicleManager.css";

const VehiclePersonal: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [battery, setBattery] = useState<number | "">("");

  // 🔹 Load user's vehicles
  const fetchVehicles = async () => {
    try {
      const res = await vehicleService.getVehicles();
      if (res.success) setVehicles(res.data || []);
      else toast.error("Unable to load vehicle list!");
    } catch {
      toast.error("Error loading vehicles!");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 Add personal vehicle
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleName || !vehicleType || !licensePlate) {
      toast.warn("⚠️ Please fill in all required fields!");
      return;
    }

    // ⚡ Battery check for CAR only
    if (vehicleType === "Car") {
      if (battery === "" || Number(battery) < 20) {
        toast.error("⚠️ Battery capacity for cars must be at least 20 kWh!");
        return;
      }
    }

    try {
      const payload = {
        vehicleName,
        vehicleType,
        licensePlate,
        battery: battery === "" ? null : Number(battery),
      };

      const res = await vehicleService.addVehicle(payload);

      if (res.success) {
        toast.success("✅ Vehicle registered successfully!");
        setVehicleName("");
        setVehicleType("");
        setLicensePlate("");
        setBattery("");
        fetchVehicles();
      } else {
        toast.error(res.message || "Unable to register vehicle!");
      }
    } catch (err) {
      toast.error("System error!");
    }
  };

  return (
    <div className="vehicle-manager fade-in">
      <h2 className="section-title">🚗 My Vehicles</h2>

      <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
        <input
          type="text"
          placeholder="Vehicle name (e.g., VinFast VF5)"
          value={vehicleName}
          onChange={(e) => setVehicleName(e.target.value)}
        />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">-- Select vehicle type --</option>
          <option value="Car">Car</option>
          <option value="Bike">Motorbike</option>
          <option value="Truck">Truck</option>
        </select>

        <input
          type="text"
          placeholder="License plate (e.g., 51H-123.45)"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Battery capacity (kWh)"
          min={vehicleType === "Car" ? 20 : 0}
          value={battery}
          onChange={(e) =>
            setBattery(e.target.value ? parseFloat(e.target.value) : "")
          }
        />

        <button type="submit" className="btn-premium">
          ➕ Register Vehicle
        </button>
      </form>

      {vehicles.length === 0 ? (
        <p className="empty-text">You haven't registered any vehicles yet.</p>
      ) : (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Vehicle Name</th>
              <th>License Plate</th>
              <th>Type</th>
              <th>Battery Capacity</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => {
              const type = (v.VehicleType || v.vehicleType || "").toLowerCase();
              const rawBattery = Number(v.Battery ?? v.battery);

              // 🚗 If car → battery min = 20
              const displayBattery =
                type === "car"
                  ? Math.max(20, rawBattery || 20)
                  : rawBattery || "N/A";

              return (
                <tr key={v.VehicleId || v.vehicleId}>
                  <td>{v.VehicleName || v.vehicleName}</td>
                  <td>{v.LicensePlate || v.licensePlate}</td>
                  <td>{v.VehicleType || v.vehicleType}</td>
                  <td>{displayBattery}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VehiclePersonal;
