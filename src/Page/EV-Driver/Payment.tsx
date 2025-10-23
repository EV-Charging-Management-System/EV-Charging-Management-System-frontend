import React from "react";
import "./Payment.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { useNavigate } from "react-router-dom";

const Payment: React.FC = () => {
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
          <li className="menu-active">Payment</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li onClick={() => navigate("/premium")}>Premium</li>
          <li onClick={() => navigate("/business")}>Business</li>
        </ul>
      </nav>

      <main className="page-body">
        <h1 className="page-title">Phương Thức Thanh Toán</h1>
        <p className="page-description">
          Lựa chọn phương thức thanh toán tiện lợi và an toàn cho mỗi lần sạc của bạn.
        </p>
      </main>

      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default Payment;
