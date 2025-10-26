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

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    users: 0,
    stations: 0,
    bookings: 0,
    payments: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [u, s, p] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllStations(),
        adminService.getAllPayments(),
      ]);

      setUsers(u);
      setStations(s);
      setPayments(p);
      setStats({
        users: u?.length || 0,
        stations: s?.length || 0,
        bookings: 15, // tạm giả lập vì BE chưa có API bookings
        payments: p?.length || 0,
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
          <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <LayoutDashboard size={18} /> Tổng quan
          </li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <Users size={18} /> Quản lý tài khoản
          </li>
          <li className={activeTab === "stations" ? "active" : ""} onClick={() => setActiveTab("stations")}>
            <BatteryCharging size={18} /> Trạm sạc
          </li>
          <li className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>
            <CalendarCheck2 size={18} /> Đặt lịch
          </li>
          <li className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}>
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

        {/* DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <section className="dashboard-section">
            <h2>Tổng quan hệ thống</h2>
            <div className="dashboard-cards">
              <div className="card"><Users size={32} /><h3>{stats.users}</h3><p>Người dùng</p></div>
              <div className="card"><BatteryCharging size={32} /><h3>{stats.stations}</h3><p>Trạm sạc</p></div>
              <div className="card"><CalendarCheck2 size={32} /><h3>{stats.bookings}</h3><p>Lịch đặt</p></div>
              <div className="card"><CreditCard size={32} /><h3>{stats.payments}</h3><p>Giao dịch</p></div>
            </div>
          </section>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <section className="data-section">
            <h2>👤 Danh sách tài khoản</h2>
            <table>
              <thead>
                <tr><th>ID</th><th>Email</th><th>Tên</th><th>Vai trò</th><th>Công ty</th></tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td>{u.UserId}</td>
                    <td>{u.Mail}</td>
                    <td>{u.UserName}</td>
                    <td>{u.RoleName}</td>
                    <td>{u.CompanyId || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* STATIONS */}
        {activeTab === "stations" && (
          <section className="data-section">
            <h2>⚡ Danh sách trạm sạc</h2>
            <table>
              <thead>
                <tr><th>ID</th><th>Tên trạm</th><th>Địa chỉ</th><th>Trạng thái</th><th>Tổng điểm sạc</th></tr>
              </thead>
              <tbody>
                {stations.map((s, i) => (
                  <tr key={i}>
                    <td>{s.StationId}</td>
                    <td>{s.StationName}</td>
                    <td>{s.Address}</td>
                    <td>{s.StationStatus}</td>
                    <td>{s.ChargingPointTotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* BOOKINGS */}
        {activeTab === "bookings" && (
          <section className="data-section">
            <h2>📅 Danh sách đặt lịch</h2>
            <p>Chức năng đang được cập nhật từ backend...</p>
          </section>
        )}

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <section className="data-section">
            <h2>💳 Danh sách hóa đơn</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Booking</th><th>Số tiền (VNĐ)</th><th>Phương thức</th><th>Trạng thái</th><th>Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={i}>
                    <td>{p.PaymentId}</td>
                    <td>{p.BookingId}</td>
                    <td>{p.Amount}</td>
                    <td>{p.Method}</td>
                    <td>{p.Status}</td>
                    <td>{new Date(p.CreatedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
