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

  // 🔹 Lấy danh sách xe
  const fetchVehicles = async () => {
    try {
      const res = await vehicleService.getVehicles();
      if (res.success) setVehicles(res.data);
      else toast.error(res.message);
    } catch {
      toast.error("Không thể tải danh sách xe!");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 Thêm xe mới
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

    console.log("[Vehicle] Payload gửi:", payload);

    const res = await vehicleService.addVehicle(payload);
    console.log("[Vehicle] Response:", res);

    if (res.success) {
      toast.success("✅ Đăng ký xe thành công!");
      setVehicleName("");
      setVehicleType("");
      setLicensePlate("");
      setBattery("");
      setErrors({});
      await fetchVehicles();
    } else {
      toast.error(res.message || "Không thể đăng ký xe!");
    }
  };

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <div className="page-body">
        <h2 className="page-title">🚗 Xe Của Tôi</h2>

        {/* Form thêm xe */}
        <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
          <div className="form-row">
            <div>
              <input
                type="text"
                name="vehicleName"
                placeholder="Tên xe (VD: VinFast VF5)"
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
                placeholder="Loại xe (VD: Ô tô, Xe máy, Xe tải)"
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
                placeholder="Biển số xe (VD: 51H-123.45)"
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
                placeholder="Dung lượng pin (kWh)"
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
            ➕ Đăng ký xe
          </button>
        </form>

        {/* Danh sách xe */}
        {vehicles.length === 0 ? (
          <p className="empty-text">Bạn chưa đăng ký xe nào.</p>
        ) : (
          <table className="vehicle-table">
            <thead>
              <tr>
                <th>Tên Xe</th>
                <th>Biển Số</th>
                <th>Loại Xe</th>
                <th>Dung Lượng Pin</th>
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
