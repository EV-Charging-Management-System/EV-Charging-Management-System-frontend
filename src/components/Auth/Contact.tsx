import React from "react";
import "./Contact.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { useNavigate } from "react-router-dom";

const Contact: React.FC = () => {
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
          <li className="menu-active">Contact</li>
          <li onClick={() => navigate("/membership")}>Membership</li>
          <li onClick={() => navigate("/business")}>Business</li>
        </ul>
      </nav>

      <main className="page-body">
        <h1 className="page-title">Liên Hệ Với Chúng Tôi</h1>
        <p className="page-description">
          Hãy để lại phản hồi hoặc yêu cầu hỗ trợ, đội ngũ chăm sóc khách hàng luôn sẵn sàng phục vụ 24/7.
        </p>
      </main>

      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default Contact;
