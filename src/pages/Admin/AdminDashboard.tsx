import React, { useEffect, useState } from "react";
import "../../css/AdminDashboard.css";
import {
  Users,
  BatteryCharging,
  CalendarCheck2,
  CreditCard,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { adminService } from "../../services/adminService";
import ProfileAdmin from "./ProfileAdmin";
import UserTable from "../../components/UserTable";
import StationTable from "../../components/StationTable";
import BookingTable from "../../components/BookingTable";
import PaymentTable from "../../components/PaymentTable";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    stations: 0,
    bookings: 0,
    payments: 3, // mock số hóa đơn
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [u, s] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllStations(),
      ]);

      setUsers(u);
      setStations(s);
      setStats({
        users: u?.length || 0,
        stations: s?.length || 0,
        bookings: 12, // mock
        payments: 3,
      });
    } catch (err) {
      console.error("⚠️ Lỗi tải dữ liệu admin:", err);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">⚡ EV ADMIN</h2>
        <ul className="sidebar-menu">
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
            <CreditCard size={18} /> Hóa đơn
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Đăng xuất
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-content">
        <header className="admin-header">
          <div>
            <h1>📊 Bảng điều khiển quản trị viên</h1>
            <p>Optimising your journey, Powering your life</p>
          </div>
          <ProfileAdmin />
        </header>

        {/* Tổng quan */}
        {activeTab === "dashboard" && (
          <section className="dashboard-section">
            <h2>Tổng quan hệ thống</h2>
            <div className="dashboard-cards">
              <div className="card">
                <Users size={32} />
                <h3>{stats.users}</h3>
                <p>Người dùng</p>
              </div>
              <div className="card">
                <BatteryCharging size={32} />
                <h3>{stats.stations}</h3>
                <p>Trạm sạc</p>
              </div>
              <div className="card">
                <CalendarCheck2 size={32} />
                <h3>{stats.bookings}</h3>
                <p>Lịch đặt</p>
              </div>
              <div className="card">
                <CreditCard size={32} />
                <h3>{stats.payments}</h3>
                <p>Hóa đơn</p>
              </div>
            </div>
          </section>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <UserTable
            users={users}
            onAdd={() => alert("Thêm user")}
            onEdit={(u) => alert("Sửa user " + u.UserId)}
            onDelete={(id) => alert("Xóa user " + id)}
          />
        )}

        {/* Stations */}
        {activeTab === "stations" && (
          <StationTable
            stations={stations}
            onAdd={() => alert("Thêm trạm")}
            onEdit={(s) => alert("Sửa trạm " + s.StationId)}
            onDelete={(id) => alert("Xóa trạm " + id)}
          />
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <BookingTable
            bookings={bookings}
            onCancel={(id: string | number) => alert("Hủy lịch " + id)}
          />
        )}

        {/* Payments */}
        {activeTab === "payments" && <PaymentTable />}
      </main>
    </div>
  );
};

export default AdminDashboard;
