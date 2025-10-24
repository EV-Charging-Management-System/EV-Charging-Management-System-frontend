import React, { useState } from "react";
import "../../css/ChargingSchedule.css";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBolt,
  FaClock,
  FaHashtag,
} from "react-icons/fa";
import Notification from "../../Customhooks/Notification";
import ProfileUser from "../../Customhooks/ProfileUser";
import { useNavigate } from "react-router-dom";

const ChargingSchedule: React.FC = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([
    {
      id: 1,
      stationName: "Trạm Sạc Trung Tâm Quận 1",
      address: "123 Nguyễn Huệ, Quận 1",
      port: "M",
      power: "80kW",
      date: "20/01/2025",
      time: "14:00",
      code: "ABC123",
      status: "Đã xác nhận",
    },
    {
      id: 2,
      stationName: "Trạm Sạc Phú Mỹ Hưng",
      address: "456 Nguyễn Văn Linh, Quận 7",
      port: "D",
      power: "150kW",
      date: "22/01/2025",
      time: "10:30",
      code: "XYZ789",
      status: "Đã xác nhận",
    },
  ]);

  // Hủy lịch
  const handleCancel = (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn hủy lịch này?");
    if (confirmDelete) {
      setBookings(bookings.filter((item) => item.id !== id));
    }
  };

  // Bắt đầu sạc
  const handleStartCharging = (booking: any) => {
    navigate("/charging-session", { state: { booking } });
  };

  return (
    <div className="schedule-container">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="header-left">
          <span className="slogan">Optimising your journey, Powering your life</span>
        </div>
        <div className="header-center">
          <FaBolt className="bolt-icon" />
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
          <li onClick={() => navigate("/booking-online-station")}>Booking Online Station</li>
          <li className="menu-active">Charging Schedule</li>
          <li onClick={() => navigate("/blog")}>Blog</li>
          <li onClick={() => navigate("/payment")}>Payment</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li onClick={() => navigate("/premium")}>Premium</li>
        </ul>
      </nav>

      {/* ===== BODY ===== */}
      <main className="schedule-body">
        <div className="schedule-header">
          <div>
            <h1 className="title">Lịch Đặt Sạc</h1>
            <p className="subtitle">Quản lý các lịch đặt sạc của bạn</p>
          </div>
          <button
            className="new-booking-btn"
            onClick={() => navigate("/booking-online-station")}
          >
            <FaCalendarAlt style={{ marginRight: "6px" }} />
            Đặt Lịch Mới
          </button>
        </div>

        <h2 className="section-title">Lịch Sắp Tới</h2>

        {bookings.length === 0 ? (
          <p className="empty-message">Hiện chưa có lịch sạc nào.</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} className="schedule-card">
              <div className="schedule-left">
                <h3>{b.stationName}</h3>
                <p className="address">
                  <FaMapMarkerAlt /> {b.address}
                </p>
                <div className="port-info">
                  <FaBolt /> <span>Cổng sạc</span>
                  <strong>
                    {b.port} - {b.power}
                  </strong>
                </div>
              </div>

              <div className="schedule-right">
                <div className="info-group">
                  <FaCalendarAlt /> <span>Ngày</span>
                  <strong>{b.date}</strong>
                </div>
                <div className="info-group">
                  <FaClock /> <span>Giờ</span>
                  <strong>{b.time}</strong>
                </div>
                <div className="info-group">
                  <FaHashtag /> <span>Mã sạc</span>
                  <strong className="code">#{b.code}</strong>
                </div>
              </div>

              <div className="status-btn">
                <span className="confirm">{b.status}</span>
                <div className="btn-group">
                  <button
                    className="start-btn"
                    onClick={() => handleStartCharging(b)}
                  >
                    Bắt Đầu Sạc
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(b.id)}
                  >
                    Hủy Lịch
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default ChargingSchedule;
