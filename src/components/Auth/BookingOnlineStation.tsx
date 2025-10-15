import React, { useState } from "react";
import "./BookingOnlineStation.css";
import { FaPhoneAlt, FaMapMarkerAlt, FaBolt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { useNavigate } from "react-router-dom";

const BookingOnlineStation: React.FC = () => {
  const navigate = useNavigate();
  const [activeStation, setActiveStation] = useState<number | null>(null);

  const stations = [
    {
      id: 1,
      name: "Trạm Sạc Trung Tâm Quận 1",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      empty: 3,
      total: 6,
      color: "orange",
    },
    {
      id: 2,
      name: "Trạm Sạc Phú Mỹ Hưng",
      address: "456 Nguyễn Văn Linh, Quận 7, TP.HCM",
      empty: 5,
      total: 6,
      color: "green",
    },
    {
      id: 3,
      name: "Trạm Sạc Thủ Đức",
      address: "789 Võ Văn Ngân, TP. Thủ Đức, TP.HCM",
      empty: 4,
      total: 6,
      color: "gray",
    },
  ];

  return (
    <div className="booking-container">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="header-left">
          <span className="slogan">Optimising your journey, Powering your life</span>
        </div>
        <div className="header-center">
          <FaPhoneAlt className="phone-icon" />
          <span className="hotline-text">Hotline: 0112 334 567</span>
        </div>
        <div className="header-right" style={{ display: "flex", gap: "16px" }}>
          <Notification />
          <ProfileUser />
        </div>
      </header>

      {/* ===== MENU ===== */}
      <nav className="menu-bar">
        <ul className="menu-list">
          <li onClick={() => navigate("/")}>About</li>
          <li className="menu-active">Booking Online Station</li>
          <li onClick={() => navigate("/blog")}>Blog</li>
          <li onClick={() => navigate("/payment")}>Payment</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li onClick={() => navigate("/membership")}>Membership</li>
        </ul>
      </nav>

      {/* ===== BODY ===== */}
      <main className="booking-body">
        <h1 className="booking-title">Booking Online Station</h1>
        <p className="booking-subtitle">Chọn trạm sạc gần bạn và đặt lịch ngay</p>

        <div className="station-layout">
          {/* ==== MAP ==== */}
          <div className="map-section">
            <div className="map-placeholder">
              {stations.map((station) => (
                <FaMapMarkerAlt
                  key={station.id}
                  className={`map-marker ${station.color} ${
                    activeStation === station.id ? "marker-active" : ""
                  }`}
                  onClick={() => setActiveStation(station.id)}
                />
              ))}
              <p className="map-label">Bản đồ mô phỏng vị trí các trạm sạc</p>
            </div>
          </div>

          {/* ==== STATION LIST ==== */}
          <div className="station-list-section">
            <h2 className="station-header">Trạm Sạc Gần Bạn</h2>

            {/* Nút Xem Lịch Đặt */}
            <button
              className="location-btn"
              onClick={() => navigate("/charging-schedule")}
            >
              📍 Xem Lịch Đặt
            </button>

            {stations.map((s) => (
              <div
                key={s.id}
                className={`station-card ${
                  activeStation === s.id ? "station-card-active" : ""
                }`}
                onMouseEnter={() => setActiveStation(s.id)}
                onMouseLeave={() => setActiveStation(null)}
              >
                <div className="station-info">
                  <h3>{s.name}</h3>
                  <p className="address">📍 {s.address}</p>
                  <div className="status-bar">
                    <span>🟢 Trống</span>
                    <span>🔴 Đã đặt</span>
                    <span>🟡 Bảo trì</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${(s.empty / s.total) * 100}%`,
                        backgroundColor: "#ff7a00",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="station-footer">
                  <span className="empty-count">{s.empty}/{s.total} trống</span>
                  <button
                    className="detail-btn"
                    onClick={() => navigate(`/booking-detail/${s.id}`)}
                  >
                    Xem Chi Tiết & Đặt Lịch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default BookingOnlineStation;
