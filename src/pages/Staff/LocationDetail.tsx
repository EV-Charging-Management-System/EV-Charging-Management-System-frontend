import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileStaff from "../../components/ProfileStaff";
import "../../css/LocationDetail.css";
import StaffSideBar from "../../pages/layouts/staffSidebar";

interface Charger {
  id: number;
  name: string;
  power: string;
  status: "available" | "booked" | "maintenance";
}

interface OfflineSession {
  id: number;
  stationName: string;
  chargerName: string;
  power: string;
  customer: string;
  phone: string;
  carBrand: string;
  status: string;
}

const LocationDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showContent, setShowContent] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [chargersData, setChargersData] = useState<Charger[]>([]);

  const stationId = Number(id);

  // =====================
  // DANH SÁCH TÊN TRẠM
  // =====================
  const stationNames: Record<number, string> = {
    1: "Trạm SCG Q1",
    2: "Trạm VinFast Q3",
    3: "Trạm EVN Q1",
    4: "Trạm Tesla Q1",
    5: "Trạm Shell Q1",
    6: "Trạm Total Q3",
    7: "Trạm Circle K Q1",
    8: "Trạm EVN Q3",
    9: "Trạm VinFast Q1",
    10: "Trạm Tesla Q3",
    11: "Trạm SCG Q3",
    12: "Trạm Shell Q3",
    13: "Trạm Circle K Q3",
    14: "Trạm EVN Q1",
    15: "Trạm VinFast Q1",
  };

  const stationName = stationNames[stationId] || "Trạm không xác định";

  // =====================
  // SINH TRẠNG THÁI NGẪU NHIÊN KHÔNG ĐỒNG NHẤT
  // =====================
  const getRandomStatus = (index: number, seed: number) => {
    const random = Math.abs(Math.sin(seed * (index + 2) * 3.14)) * 10;
    if (random < 3) return "available";
    if (random < 6.5) return "booked";
    return "maintenance";
  };

  useEffect(() => {
    const initial: Charger[] = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Cổng ${String.fromCharCode(65 + i)}`,
      power: `${80 + i * 10} kW`,
      status: getRandomStatus(i, stationId),
    }));
    setChargersData(initial);
  }, [stationId]);

  // =====================
  // FORM STATE
  // =====================
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    carBrand: "VinFast",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // =====================
  // XỬ LÝ SUBMIT FORM
  // =====================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharger) return;

    const newSession: OfflineSession = {
      id: Date.now(),
      stationName,
      chargerName: selectedCharger.name,
      power: selectedCharger.power,
      customer: formData.fullName,
      phone: formData.phone,
      carBrand: formData.carBrand,
      status: "pending",
    };

    const existing =
      JSON.parse(localStorage.getItem("offlineSessions") || "[]") || [];
    localStorage.setItem(
      "offlineSessions",
      JSON.stringify([...existing, newSession])
    );

    // Cập nhật trạng thái trụ sạc thành "booked" (màu đỏ)
    setChargersData((prev) =>
      prev.map((c) =>
        c.id === selectedCharger.id ? { ...c, status: "booked" } : c
      )
    );

    alert("✅ Phiên sạc offline đã được thêm vào Sessions!");

    // Reset form
    setSelectedCharger(null);
    setFormData({ fullName: "", phone: "", carBrand: "VinFast" });
  };

  // =====================
  // HIỆU ỨNG HIỆN TRANG
  // =====================
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // =====================
  // JSX GIAO DIỆN
  // =====================
  return (
    <div className="location-wrapper">
      <StaffSideBar />

      {/* ===== MAIN CONTENT ===== */}
      <div
        className={`location-main-wrapper ${
          showContent ? "fade-in" : "hidden"
        }`}
      >
        <main className="location-main">
          <header className="location-header">
            <h1>Location Detail</h1>
            <div className="location-header-actions">
              <ProfileStaff />
            </div>
          </header>

          <section className="detail-body">
            <h2 className="detail-title">{stationName}</h2>
            <p className="detail-sub">
              Chọn ô còn trống (màu trắng viền xanh) để tiến hành sạc
            </p>

            {/* ===== DANH SÁCH CỔNG SẠC ===== */}
            <div className="charger-grid">
              {chargersData.map((charger) => (
                <div
                  key={charger.id}
                  className={`charger-card ${charger.status}`}
                  onClick={() =>
                    charger.status === "available" &&
                    setSelectedCharger(charger)
                  }
                >
                  <h3>#{charger.id}</h3>
                  <p className="charger-name">{charger.name}</p>
                  <p className="charger-power">{charger.power}</p>
                  <p className="charger-status">
                    {charger.status === "available"
                      ? "Còn trống"
                      : charger.status === "booked"
                      ? "Đã đặt"
                      : "Bảo trì"}
                  </p>
                </div>
              ))}
            </div>

            {/* ===== CHÚ GIẢI ===== */}
            <div className="status-legend">
              <span className="legend available">Còn trống</span>
              <span className="legend booked">Đã đặt</span>
              <span className="legend maintenance">Bảo trì</span>
            </div>
          </section>
        </main>

        <footer className="footer">@SWP Staff Fall 2025</footer>
      </div>

      {/* ===== FORM POPUP ===== */}
      {selectedCharger && (
        <div className="form-overlay">
          <div className="form-popup">
            <h2>Thông tin khách hàng</h2>
            <form onSubmit={handleSubmit}>
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <label>Hãng xe</label>
              <select
                name="carBrand"
                value={formData.carBrand}
                onChange={handleChange}
              >
                <option value="VinFast">VinFast</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Tesla">Tesla</option>
              </select>

              <label>Cổng sạc</label>
              <input type="text" value={selectedCharger.name} disabled />

              <label>Công suất</label>
              <input type="text" value={selectedCharger.power} disabled />

              <div className="form-buttons">
                <button type="button" onClick={() => setSelectedCharger(null)}>
                  Hủy
                </button>
                <button type="submit">Tiếp tục</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDetail;
