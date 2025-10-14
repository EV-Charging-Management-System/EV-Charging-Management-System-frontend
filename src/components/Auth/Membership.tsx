import React from "react";
import "./Membership.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { useNavigate } from "react-router-dom";

const Membership: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="member-container">
      {/* ===== HEADER ===== */}
      <header className="header">
        <div className="header-left">
          <span className="slogan">
            Optimising your journey, Powering your life
          </span>
        </div>

        <div className="header-center">
          <FaPhoneAlt className="phone-icon" />
          <span className="hotline-text">Hotline: 0112334567</span>
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
          <li onClick={() => navigate("/blog")}>Blog</li>
          <li onClick={() => navigate("/payment")}>Payment</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li className="menu-active">Membership</li>
          <li onClick={() => navigate("/business")}>Business</li>
        </ul>
      </nav>

      {/* ===== BODY ===== */}
      <main className="member-body">
        <h1 className="member-title">
          Quyền Lợi Tối Ưu - Tiến Hành <br /> Nâng Cấp Hội Viên - Mua Ngay
        </h1>

        <div className="member-cards">
          {/* Gói 1 tháng */}
          <div className="member-card">
            <h3>Gói 1 Tháng</h3>
            <p>100.000 VND</p>
            <button
              className="buy-btn"
              onClick={() => navigate("/membership/1month")}
            >
              Mua Ngay
            </button>
          </div>

          {/* Gói 6 tháng */}
          <div className="member-card">
            <h3>Gói 6 Tháng</h3>
            <p>200.000 VND</p>
            <button
              className="buy-btn"
              onClick={() => navigate("/membership/6month")}
            >
              Mua Ngay
            </button>
          </div>

          {/* Gói 1 năm */}
          <div className="member-card">
            <h3>Gói 1 Năm</h3>
            <p>500.000 VND</p>
            <button
              className="buy-btn"
              onClick={() => navigate("/membership/1year")}
            >
              Mua Ngay
            </button>
          </div>
        </div>

        <p className="note">
          *Các điều khoản và nội dung chi tiết. Vui lòng xem thêm thông tin.
        </p>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default Membership;
