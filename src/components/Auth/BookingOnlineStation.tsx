import React from "react";
import "./BookingOnlineStation.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { useNavigate } from "react-router-dom";

const BookingOnlineStation: React.FC = () => {
  const navigate = useNavigate();

  // Hàm xử lý khi click vào "Tìm vị trí của tôi"
  const handleFindLocation = () => {
    alert("📍 Đang lấy vị trí của bạn... (sẽ xử lý sau)");
  };

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
          <li onClick={() => navigate("/business")}>Business</li>
        </ul>
      </nav>

      {/* ===== BODY ===== */}
      <main className="booking-body">
        <h1 className="booking-title">
          Đặt chỗ trạm sạc nhanh chóng <br /> Tiết kiệm thời gian – Dễ dàng di chuyển
        </h1>

        <div className="booking-content">
          <p>
            Hệ thống cho phép bạn tìm, đặt và quản lý trạm sạc gần nhất.
            Chỉ cần vài cú nhấp chuột, bạn có thể đặt chỗ trước để đảm bảo trạm luôn sẵn sàng.
          </p>

          {/* ✅ Nút tìm vị trí */}
          <div className="select-station-box" onClick={handleFindLocation}>
            🔍 Tìm vị trí của tôi
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default BookingOnlineStation;
