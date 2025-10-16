import React from "react";
import "./HomePage.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { FaLocationDot } from "react-icons/fa6";
import { MapPin, Clock, Zap, Star, Wallet, Shield } from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      alert("Đăng xuất thành công!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout thất bại!");
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
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

      {/* Menu */}
      <nav className="menu-bar">
        <ul className="menu-list">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/booking-online-station"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Booking Online Station
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/blog"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/payment"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Payment
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/premium"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Premium
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/business"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Business
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Body */}
      <main className="main-content">
        <div className="hero-text">
          <h1>
            Sạc Xe Điện <span className="highlight">Thông Minh</span><br />
            Nhanh Chóng & Tiện Lợi
          </h1>
          <p className="description">
            Hệ thống quản lý trạm sạc xe điện hiện đại với mạng lưới rộng khắp,<br />
            đặt lịch online và thanh toán linh hoạt
          </p>

          <div className="hero-buttons">
            {/* ✅ Thêm chức năng chuyển trang */}
            <button className="btn-find" onClick={() => navigate("/charging-schedule")}>
              <FaLocationDot className="icon" /> Xem Lịch Đặt
            </button>
            <button className="btn-premium" onClick={() => navigate("/premium")}>
              Gói Premium
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tính Năng Nổi Bật</h2>
          <div className="features-grid">
            <div className="card">
              <div className="card-icon"><MapPin /></div>
              <h3>Tìm Trạm Dễ Dàng</h3>
              <p>Bản đồ hiển thị tất cả trạm sạc gần bạn với thông tin công suất & tình trạng thực tế.</p>
            </div>

            <div className="card">
              <div className="card-icon"><Clock /></div>
              <h3>Đặt Lịch Online</h3>
              <p>Chọn trạm sạc, thời gian sạc dễ dàng – tránh chờ đợi.</p>
            </div>

            <div className="card">
              <div className="card-icon"><Zap /></div>
              <h3>Sạc Nhanh</h3>
              <p>Sạc siêu tốc từ 80kW – 150kW. An toàn & ổn định.</p>
            </div>

            <div className="card">
              <div className="card-icon"><Star /></div>
              <h3>Gói Premium</h3>
              <p>Ưu tiên đặt lịch + giảm giá 30% mỗi lần sạc.</p>
            </div>

            <div className="card">
              <div className="card-icon"><Wallet /></div>
              <h3>Ví Trả Sau</h3>
              <p>Sạc trước trả sau – thanh toán cuối tháng.</p>
            </div>

            <div className="card">
              <div className="card-icon"><Shield /></div>
              <h3>Bảo Mật Cao</h3>
              <p>Mã hóa dữ liệu – thanh toán an toàn tuyệt đối.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Sẵn Sàng Trải Nghiệm?</h2>
          <p>Đăng ký ngay để nhận ưu đãi sạc miễn phí lần đầu!</p>
          <a href="/register" className="btn-cta">Đăng Ký Miễn Phí</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default HomePage;
