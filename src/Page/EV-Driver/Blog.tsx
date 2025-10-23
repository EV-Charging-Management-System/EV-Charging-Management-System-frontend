import React from "react";
import "./Blog.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { useNavigate } from "react-router-dom";

const Blog: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      {/* ===== HEADER ===== */}
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

      {/* ===== MENU ===== */}
      <nav className="menu-bar">
        <ul className="menu-list">
          <li onClick={() => navigate("/")}>About</li>
          <li onClick={() => navigate("/booking-online-station")}>Booking Online Station</li>
          <li className="menu-active">Blog</li>
          <li onClick={() => navigate("/payment")}>Payment</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li onClick={() => navigate("/premium")}>Premium</li>
          <li onClick={() => navigate("/business")}>Business</li>
        </ul>
      </nav>

      {/* ===== BODY ===== */}
      <main className="page-body">
        <h1 className="page-title">Tin Tức & Blog Nổi Bật</h1>
        <p className="page-description">
          Cập nhật những thông tin mới nhất về trạm sạc, công nghệ năng lượng xanh và xu hướng ô tô điện.
        </p>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default Blog;
