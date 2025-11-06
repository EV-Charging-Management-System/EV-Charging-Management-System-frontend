import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";
import { toast } from "react-toastify";

const VehicleManager: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [licensePlate, setLicensePlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState(""); // Tên xe cụ thể (VD: VF8, Vios,...)

  // 🔹 Lấy danh sách xe
  const fetchVehicles = async () => {
    try {
      const res = await businessService.getVehicles();
      console.log("[VehicleManager] Danh sách xe:", res);
      setVehicles(res?.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách xe:", err);
      toast.error("Không thể tải danh sách xe!");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 Thêm xe mới
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensePlate.trim() || !brand.trim() || !model.trim()) {
      toast.warn("⚠️ Vui lòng nhập đầy đủ thông tin xe!");
      return;
    }

    try {
      const payload = {
        vehicleName: `${brand} ${model}`, // Ghép "hãng + tên xe"
        vehicleType: "Car",
        licensePlate: licensePlate.trim(),
      };

      console.log("[VehicleManager] Payload gửi lên:", payload);
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
      console.error("❌ Lỗi thêm xe:", err);
      toast.error("Đã xảy ra lỗi khi thêm xe!");
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
    } catch (err) {
      console.error("❌ Lỗi khi xoá xe:", err);
      toast.error("Không thể xoá xe!");
    }
  };

  return (
    <div className="vehicle-manager fade-in">
      <h2 className="section-title">🚗 Quản Lý Xe Doanh Nghiệp</h2>

      {/* Form thêm xe */}
      <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
        <input
          type="text"
          placeholder="Biển số xe (VD: 51A-123.45)"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />

        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">Chọn hãng xe</option>
          <option value="Toyota">Toyota</option>
          <option value="VinFast">VinFast</option>
          <option value="Hyundai">Hyundai</option>
          <option value="Tesla">Tesla</option>
        </select>

        <input
          type="text"
          placeholder="Tên xe (VD: Vios, VF8, Model 3...)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <button type="submit" className="btn-premium">
          ➕ Thêm Xe
        </button>
      </form>

      {/* Danh sách xe */}
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
            {vehicles.map((v) => (
              <tr key={v.VehicleId || v.vehicleId}>
                <td>{v.LicensePlate || v.licensePlate}</td>
                <td>{v.VehicleName || v.vehicleName}</td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VehicleManager;
