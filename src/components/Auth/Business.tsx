import React from "react";
import "./Business.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { useNavigate } from "react-router-dom";

const Business: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <header className="header">
        <div className="header-left">
          <span className="slogan">Optimising your journey, Powering your life</span>
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

      <nav className="menu-bar">
        <ul className="menu-list">
          <li onClick={() => navigate("/")}>About</li>
          <li onClick={() => navigate("/booking-online-station")}>Booking Online Station</li>
          <li onClick={() => navigate("/blog")}>Blog</li>
          <li onClick={() => navigate("/payment")}>Payment</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li onClick={() => navigate("/membership")}>Membership</li>
          <li className="menu-active">Business</li>
        </ul>
      </nav>

      <main className="page-body">
        <h1 className="page-title">Hợp Tác Kinh Doanh</h1>
        <p className="page-description">
          Mở rộng hệ thống trạm sạc của bạn cùng chúng tôi – giải pháp năng lượng xanh cho tương lai.
        </p>
      </main>

      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default Business;
