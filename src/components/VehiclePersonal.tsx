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

  // 🔹 Lấy danh sách xe của cá nhân
  const fetchVehicles = async () => {
    try {
      const res = await vehicleService.getVehicles();
      if (res.success) setVehicles(res.data || []);
      else toast.error("Không thể tải danh sách xe!");
    } catch {
      toast.error("Lỗi khi tải danh sách xe!");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 Đăng ký xe cá nhân
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleName || !vehicleType || !licensePlate) {
      toast.warn("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // ⚡ Chỉ kiểm tra ô tô (CAR)
    if (vehicleType === "Car") {
      if (battery === "" || Number(battery) < 20) {
        toast.error("⚠️ Dung lượng pin cho Ô TÔ phải từ 20 kWh trở lên!");
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
        toast.success("✅ Đăng ký xe thành công!");
        setVehicleName("");
        setVehicleType("");
        setLicensePlate("");
        setBattery("");
        fetchVehicles();
      } else {
        toast.error(res.message || "Không thể đăng ký xe!");
      }
    } catch (err) {
      toast.error("Lỗi hệ thống!");
    }
  };

  return (
    <div className="vehicle-manager fade-in">
      <h2 className="section-title">🚗 Xe Của Tôi</h2>

      <form className="add-vehicle-form" onSubmit={handleAddVehicle}>
        <input
          type="text"
          placeholder="Tên xe (VD: VinFast VF5)"
          value={vehicleName}
          onChange={(e) => setVehicleName(e.target.value)}
        />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">-- Chọn loại xe --</option>
          <option value="Car">Ô tô</option>
          <option value="Bike">Xe máy</option>
          <option value="Truck">Xe tải</option>
        </select>

        <input
          type="text"
          placeholder="Biển số xe (VD: 51H-123.45)"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />

        <input
          type="number"
          placeholder="Dung lượng pin (kWh)"
          min={vehicleType === "Car" ? 20 : 0}
          value={battery}
          onChange={(e) =>
            setBattery(e.target.value ? parseFloat(e.target.value) : "")
          }
        />

        <button type="submit" className="btn-premium">
          ➕ Đăng ký xe
        </button>
      </form>

      {vehicles.length === 0 ? (
        <p className="empty-text">Bạn chưa đăng ký xe nào.</p>
      ) : (
        <table className="vehicle-table">
          <thead>
            <tr>
              <th>Tên Xe</th>
              <th>Biển Số</th>
              <th>Loại</th>
              <th>Dung Lượng Pin</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.map((v) => {
              const type = (v.VehicleType || v.vehicleType || "").toLowerCase();
              const rawBattery = Number(v.Battery ?? v.battery); // ép về số

              // 🚗 Nếu là ô tô → ép tối thiểu 20
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
