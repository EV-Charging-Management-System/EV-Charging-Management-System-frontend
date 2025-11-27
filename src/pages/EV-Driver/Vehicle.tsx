import React, { useEffect, useState } from "react";
import { vehicleService } from "../../services/vehicleService";
import { vehicleSchema } from "../../utils/validationSchemas";
import { toast } from "react-toastify";
import Header from "../layouts/header";
import MenuBar from "../layouts/menu-bar";
import Footer from "../layouts/footer";
import "../../css/Vehicle.css";

const Vehicle: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [battery, setBattery] = useState<number | "">("");
  const [errors, setErrors] = useState<any>({});

  // 🔹 Load vehicle list
  const fetchVehicles = async () => {
    try {
      const res = await vehicleService.getVehicles();
      if (res.success) setVehicles(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Unable to load vehicle list!");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 Add a new vehicle
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      vehicleName,
      vehicleType,
      licensePlate: licensePlate.toUpperCase(),
      battery: battery === "" ? null : Number(battery),
    };

    // Validate using Yup schema
    try {
      await vehicleSchema.validate(payload, { abortEarly: false });
    } catch (err: any) {
      const validationErrors: any = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return;
    }

    console.log("[Vehicle] Payload:", payload);

    const res = await vehicleService.addVehicle(payload);
    console.log("[Vehicle] Response:", res);

    if (res.success) {
      toast.success("✅ Vehicle registered successfully!");
      setVehicleName("");
      setVehicleType("");
      setLicensePlate("");
      setBattery("");
      setErrors({});
      await fetchVehicles();
    } else {
      toast.error(res.message || "Failed to register vehicle!");
    }
  };

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <div className="page-body">
        <h2 className="page-title">🚗 My Vehicles</h2>

        {/* Add vehicle form */}
        <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
          <div className="form-row">
            <div>
              <input
                type="text"
                name="vehicleName"
                placeholder="Vehicle name (e.g., VinFast VF5)"
                className="form-input"
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
              />
              {errors.vehicleName && (
                <div className="error-text">{errors.vehicleName}</div>
              )}
            </div>

            <div>
              <input
                type="text"
                name="vehicleType"
                placeholder="Type (e.g., Car, Motorbike, Truck)"
                className="form-input"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              />
              {errors.vehicleType && (
                <div className="error-text">{errors.vehicleType}</div>
              )}
            </div>

            <div>
              <input
                type="text"
                name="licensePlate"
                placeholder="License plate (e.g., 51H-123.45)"
                className="form-input"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
              />
              {errors.licensePlate && (
                <div className="error-text">{errors.licensePlate}</div>
              )}
            </div>

            <div>
              <input
                type="number"
                name="battery"
                placeholder="Battery capacity (kWh)"
                className="form-input"
                min="0"
                step="0.1"
                value={battery}
                onChange={(e) =>
                  setBattery(e.target.value ? parseFloat(e.target.value) : "")
                }
              />
              {errors.battery && (
                <div className="error-text">{errors.battery}</div>
              )}
            </div>
          </div>

          <button type="submit" className="btn-premium">
            ➕ Register Vehicle
          </button>
        </form>

        {/* Vehicle list */}
        {vehicles.length === 0 ? (
          <p className="empty-text">You have not registered any vehicles.</p>
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
              {vehicles.map((v) => (
                <tr key={v.VehicleId || v.vehicleId}>
                  <td>{v.VehicleName || v.vehicleName}</td>
                  <td>{v.LicensePlate || v.licensePlate}</td>
                  <td>{v.VehicleType || v.vehicleType}</td>
                  <td>{v.Battery || v.battery || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Vehicle;
