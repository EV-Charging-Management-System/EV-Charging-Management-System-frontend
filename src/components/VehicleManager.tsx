import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";
import { toast } from "react-toastify";

const VehicleManager: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [licensePlate, setLicensePlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  // 🔹 Load danh sách xe
  const fetchVehicles = async () => {
    try {
      const res = await businessService.getVehicles();
      setVehicles(res?.data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách xe!");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 Thêm xe
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!licensePlate.trim() || !brand.trim() || !model.trim()) {
      toast.warn("⚠️ Vui lòng nhập đầy đủ thông tin xe!");
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
        toast.success("✅ Thêm xe thành công!");
        setLicensePlate("");
        setBrand("");
        setModel("");
        fetchVehicles();
      } else {
        toast.error(res?.message || "Không thể thêm xe!");
      }
    } catch (err) {
      toast.error("Lỗi khi thêm xe!");
    }
  };

  // 🔹 Xóa xe
  const handleDeleteVehicle = async (plate: string) => {
    if (!window.confirm(`Bạn có chắc muốn xoá xe ${plate}?`)) return;

    try {
      const res = await businessService.deleteVehicleByPlate(plate);
      if (res?.message?.toLowerCase()?.includes("success")) {
        toast.info(`🗑️ Xe ${plate} đã được xoá.`);
        fetchVehicles();
      } else {
        toast.error(res?.message || "Không thể xoá xe.");
      }
    } catch {
      toast.error("Lỗi xoá xe!");
    }
  };

  return (
    <div className="vehicle-manager fade-in">
      <h2 className="section-title">🚗 Quản Lý Xe Doanh Nghiệp</h2>

      {/* Form thêm xe – layout 2 cột giống EVDriver */}
      <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
        <div className="vehicle-row">
          <input
            type="text"
            className="vehicle-input"
            placeholder="Biển số xe (VD: 51A-123.45)"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />

          <input
            type="text"
            className="vehicle-input"
            placeholder="Loại Xe (VD: VinFast, Toyota, Tesla)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div className="vehicle-row">
          <input
            type="text"
            className="vehicle-input"
            placeholder="Tên xe (VD: VF8, Vios, Model 3)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />

          {/* Slot trống để cân 2 cột */}
          <div style={{ flex: 1 }}></div>
        </div>

        <button type="submit" className="btn-premium">
          ➕ Thêm Xe
        </button>
      </form>

      {/* DANH SÁCH XE */}
      {vehicles.length === 0 ? (
        <p className="empty-text">Chưa có xe nào được đăng ký.</p>
      ) : (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Biển Số</th>
              <th>Tên Xe</th>
              <th>Loại Xe</th>
              <th>Thao Tác</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => {
              const rawName = v.VehicleName || v.vehicleName || "";

              // ❗ XÓA “car ” | “bike ” | “truck ”
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
                      🗑️ Xoá
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
