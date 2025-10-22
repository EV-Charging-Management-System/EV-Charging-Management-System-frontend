import React from "react";
import "./Premium.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { useNavigate } from "react-router-dom";

const Premium: React.FC = () => {
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
          <li onClick={() => navigate("/booking-online-station")}>
            Booking Online Station
          </li>
          <li onClick={() => navigate("/blog")}>Blog</li>
          <li onClick={() => navigate("/payment")}>Payment</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li className="menu-active">Premium</li>
          <li onClick={() => navigate("/business")}>Business</li>
        </ul>
      </nav>

      {/* ===== BODY ===== */}
      <main className="member-body">
        <h1 className="member-title">
          Trải Nghiệm Đặc Quyền - Nâng Tầm Hội Viên <br /> Chọn Gói Phù Hợp Cho
          Bạn
        </h1>

        <div className="member-cards">
          {/* Gói Premium */}
          <div className="member-card">
            <h3>Gói Premium</h3>
            <p className="price">299.000 VND / tháng</p>
            <ul className="benefits">
              <li>⚡ Truy cập không giới hạn vào toàn bộ hệ thống trạm sạc</li>
              <li>⭐ Hỗ trợ ưu tiên 24/7 và hotline riêng cho hội viên</li>
              <li>🚗 Nhận thông báo sớm về trạm sạc trống và khuyến mãi</li>
              <li>🎁 Ưu đãi đặc biệt từ các đối tác độc quyền</li>
              <li>💡 Tự động lưu lịch sử giao dịch và vị trí trạm yêu thích</li>
            </ul>
            <button
              className="buy-btn"
              onClick={() => navigate("/Premium/plan-premium")}
            >
              Mua Ngay
            </button>
          </div>

          {/* Gói Business */}
          <div className="member-card">
            <h3>Tài Khoản Doanh Nghiệp</h3>
            <p className="price">Liên hệ để được tư vấn</p>
            <ul className="benefits">
              <li>🏢 Quản lý nhiều phương tiện và tài khoản nhân viên</li>
              <li>📊 Theo dõi hiệu suất sử dụng sạc chi tiết theo thời gian thực</li>
              <li>🧾 Báo cáo tổng hợp doanh thu và giao dịch định kỳ</li>
              <li>
                💰 Toàn bộ khoản thanh toán của khách hàng được tổng kết và
                chuyển về doanh nghiệp vào cuối chu kỳ thanh toán
              </li>
              <li>🔒 Ưu tiên hỗ trợ kỹ thuật và bảo mật nâng cao</li>
            </ul>
            <button
              className="buy-btn"
              onClick={() => navigate("/Premium/plan-business")}
            >
              Nâng Cấp Ngay
            </button>
          </div>
        </div>

        <p className="note">
          *Chi tiết quyền lợi và điều khoản sử dụng được cập nhật trong mục
          thông tin chi tiết của từng gói.
        </p>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default Premium;
