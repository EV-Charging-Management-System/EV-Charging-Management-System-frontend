import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/AdminDashboard.css";
import ProfileAdmin from "./ProfileAdmin";
import {
  Users,
  BatteryCharging,
  CreditCard,
  CalendarCheck2,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { authService } from "../../services/authService";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    users: 0,
    stations: 0,
    bookings: 0,
    payments: 0,
  });
  const navigate = useNavigate();

  // ✅ Giả lập API gọi dữ liệu dashboard
  useEffect(() => {
    setTimeout(() => {
      setStats({
        users: 123,
        stations: 45,
        bookings: 67,
        payments: 200,
      });
    }, 800);
  }, []);

  // ✅ Xử lý đăng xuất
  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* ===== SIDEBAR ===== */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>⚡ EV ADMIN</h2>
        </div>

        <nav className="sidebar-menu">
          <ul>
            <li
              className={activeTab === "dashboard" ? "active" : ""}
              onClick={() => setActiveTab("dashboard")}
            >
              <LayoutDashboard size={18} /> Tổng quan
            </li>
            <li
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              <Users size={18} /> Quản lý tài khoản
            </li>
            <li
              className={activeTab === "stations" ? "active" : ""}
              onClick={() => setActiveTab("stations")}
            >
              <BatteryCharging size={18} /> Trạm sạc
            </li>
            <li
              className={activeTab === "bookings" ? "active" : ""}
              onClick={() => setActiveTab("bookings")}
            >
              <CalendarCheck2 size={18} /> Đặt lịch
            </li>
            <li
              className={activeTab === "payments" ? "active" : ""}
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard size={18} /> Thanh toán
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="admin-content">
        {/* ==== HEADER ==== */}
        <header className="admin-header">
          <div className="header-left">
            <h1>📊 Bảng điều khiển quản trị viên</h1>
            <p>Optimising your journey, Powering your life</p>
          </div>
          <ProfileAdmin />
        </header>

        {/* ==== DASHBOARD ==== */}
        {activeTab === "dashboard" && (
          <section className="dashboard-section">
            <h2>Tổng quan hệ thống</h2>
            <div className="dashboard-cards">
              <div className="card">
                <Users size={36} />
                <h3>{stats.users}</h3>
                <p>Người dùng</p>
              </div>
              <div className="card">
                <BatteryCharging size={36} />
                <h3>{stats.stations}</h3>
                <p>Trạm sạc</p>
              </div>
              <div className="card">
                <CalendarCheck2 size={36} />
                <h3>{stats.bookings}</h3>
                <p>Lịch đặt</p>
              </div>
              <div className="card">
                <CreditCard size={36} />
                <h3>{stats.payments}</h3>
                <p>Giao dịch</p>
              </div>
            </div>
          </section>
        )}

        {/* ==== CÁC TAB KHÁC ==== */}
        {activeTab === "users" && (
          <section className="dashboard-section">
            <h2>👤 Quản lý tài khoản</h2>
            <p>Trang quản lý người dùng sẽ được thêm ở đây.</p>
          </section>
        )}

        {activeTab === "stations" && (
          <section className="dashboard-section">
            <h2>⚡ Danh sách trạm sạc</h2>
            <p>Trang quản lý trạm sạc đang được phát triển.</p>
          </section>
        )}

        {activeTab === "bookings" && (
          <section className="dashboard-section">
            <h2>📅 Quản lý lịch đặt</h2>
            <p>Trang lịch đặt đang được phát triển.</p>
          </section>
        )}

        {activeTab === "payments" && (
          <section className="dashboard-section">
            <h2>💳 Quản lý thanh toán</h2>
            <p>Trang thống kê thanh toán đang được phát triển.</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
