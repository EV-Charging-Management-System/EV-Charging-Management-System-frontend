import React, { useEffect, useState } from "react";
import "../../css/AdminDashboard.css";
import {
  Users,
  BatteryCharging,
  CalendarCheck2,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Building2,
  UserPlus,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { adminService } from "../../services/adminService";
import ProfileAdmin from "./ProfileAdmin";
import UserTable from "../../components/UserTable";
import StationTable from "../../components/StationTable";
import BookingTable from "../../components/BookingTable";
import PaymentTable from "../../components/PaymentTable";
import BusinessAccountTable from "../../components/BusinessAccountTable";
import StaffTable from "../../components/StaffTable";
import CreateStaff from "../../components/CreateStaff";
import RevenueChart from "../../components/RevenueChart";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStaff: 0,
    totalBusiness: 0,
    totalStations: 0,
    totalSessions: 0,
    totalRevenue: 0,
  });

  const [revenueData, setRevenueData] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  const navigate = useNavigate();

  // 🚀 Load dữ liệu ban đầu
  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([loadDashboardData(), loadUsers(), loadStations()]);
      } catch {
        toast.error("⚠️ Không thể tải dữ liệu tổng quan!");
      }
    };
    init();
  }, []);

  // 📊 Lấy thống kê Dashboard
  const loadDashboardData = async () => {
    try {
      const res = await adminService.getDashboardStats();
      if (res && typeof res === "object") {
        setStats(res);
      } else {
        toast.error("⚠️ Không thể tải thống kê dashboard!");
      }
    } catch (error) {
      console.error("❌ Lỗi tải dashboard:", error);
      toast.error("❌ Không thể tải dữ liệu tổng quan!");
    }
  };

  // 👥 Lấy danh sách người dùng
  const loadUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      if (Array.isArray(res)) setUsers(res);
    } catch (error) {
      console.error("⚠️ Không thể tải danh sách người dùng:", error);
    }
  };

  // ⚡ Lấy danh sách trạm
  const loadStations = async () => {
    try {
      const res = await adminService.getAllStations();
      if (Array.isArray(res)) setStations(res);
    } catch (error) {
      console.error("⚠️ Không thể tải danh sách trạm:", error);
    }
  };

  // 👨‍💼 Lấy danh sách staff
  const loadStaff = async () => {
    setLoadingStaff(true);
    try {
      const res = await adminService.getAllStaff();
      if (Array.isArray(res)) setStaffList(res);
    } catch (error) {
      console.error("⚠️ Không thể tải danh sách staff:", error);
    } finally {
      setLoadingStaff(false);
    }
  };

  // 💰 Lấy báo cáo doanh thu
  const loadRevenueReport = async () => {
    try {
      const res = await adminService.getRevenueReport?.();
      if (res?.success && res.data) setRevenueData(res.data);
      else if (res.TotalRevenue !== undefined) setRevenueData(res);
    } catch (error) {
      console.error("❌ Lỗi tải báo cáo doanh thu:", error);
    }
  };

  // 🎯 Khi chọn tab tương ứng
  useEffect(() => {
    if (activeTab === "revenue") loadRevenueReport();
    if (activeTab === "staff") loadStaff();
  }, [activeTab]);

  // 🚪 Đăng xuất
  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  // 🟢 Thêm user
  const handleAddUser = async (user: Partial<any>) => {
    try {
      const res = await adminService.createStaff(
        user.Mail || "",
        "123456", // mật khẩu mặc định
        user.UserName || ""
      );
      if (res.success) {
        toast.success("✅ Thêm tài khoản thành công!");
        await loadUsers();
      } else {
        toast.error(res.message || "❌ Thêm thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi thêm user:", error);
      toast.error("❌ Lỗi khi thêm tài khoản!");
    }
  };

  // ✏️ Cập nhật user
  const handleEditUser = async (user: any) => {
    try {
      const res = await adminService.updateUser(user.UserId, user);
      if (res.success) {
        toast.success("✏️ Cập nhật thành công!");
        await loadUsers();
      } else {
        toast.error(res.message || "❌ Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật user:", error);
      toast.error("❌ Lỗi khi cập nhật tài khoản!");
    }
  };

  // 🗑️ Xóa user
  const handleDeleteUser = async (id: number) => {
    try {
      const res = await adminService.deleteUser(id);
      if (res.success) {
        toast.success("🗑️ Xóa tài khoản thành công!");
        await loadUsers();
      } else {
        toast.error(res.message || "❌ Xóa thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi xóa user:", error);
      toast.error("❌ Lỗi khi xóa tài khoản!");
    }
  };

  return (
    <div className="admin-dashboard">
      {/* ========== SIDEBAR ========== */}
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
            className={activeTab === "staff" ? "active" : ""}
            onClick={() => setActiveTab("staff")}
          >
            <UserPlus size={18} /> Nhân viên (Staff)
          </li>
          <li
            className={activeTab === "business" ? "active" : ""}
            onClick={() => setActiveTab("business")}
          >
            <Building2 size={18} /> Tài khoản DN
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
          <li
            className={activeTab === "revenue" ? "active" : ""}
            onClick={() => setActiveTab("revenue")}
          >
            <BarChart3 size={18} /> Doanh thu
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Đăng xuất
        </button>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="admin-content">
        <header className="admin-header">
          <div>
            <h1>📊 Bảng điều khiển quản trị viên</h1>
            <p>Optimising your journey, Powering your life</p>
          </div>
          <ProfileAdmin />
        </header>

        {/* ===== DASHBOARD ===== */}
        {activeTab === "dashboard" && (
          <section className="dashboard-section">
            <h2>Tổng quan hệ thống</h2>
            <div className="dashboard-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card">
                <Users size={32} />
                <h3>{stats.totalUsers}</h3>
                <p>Người dùng</p>
              </div>
              <div className="card">
                <UserPlus size={32} />
                <h3>{stats.totalStaff}</h3>
                <p>Nhân viên (Staff)</p>
              </div>
              <div className="card">
                <Building2 size={32} />
                <h3>{stats.totalBusiness}</h3>
                <p>Tài khoản DN</p>
              </div>
              <div className="card">
                <BatteryCharging size={32} />
                <h3>{stats.totalStations}</h3>
                <p>Trạm sạc</p>
              </div>
              <div className="card">
                <CalendarCheck2 size={32} />
                <h3>{stats.totalSessions}</h3>
                <p>Lịch đặt</p>
              </div>
              <div className="card highlight">
                <DollarSign size={32} />
                <h3>
                  {stats.totalRevenue
                    ? stats.totalRevenue.toLocaleString("vi-VN") + " ₫"
                    : "0 ₫"}
                </h3>
                <p>Doanh thu</p>
              </div>
            </div>
          </section>
        )}

        {/* ===== USERS ===== */}
        {activeTab === "users" && (
          <UserTable
            users={users}
            onAdd={handleAddUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        )}

        {/* ===== STAFF ===== */}
        {activeTab === "staff" && (
          <div className="staff-section">
            <CreateStaff onCreated={loadStaff} />
            <StaffTable staffList={staffList} loading={loadingStaff} />
          </div>
        )}

        {/* ===== BUSINESS ===== */}
        {activeTab === "business" && <BusinessAccountTable />}

        {/* ===== STATIONS ===== */}
        {activeTab === "stations" && (
          <StationTable
            stations={stations}
            onAdd={() => toast.info("🚧 Chức năng thêm trạm đang phát triển")}
            onEdit={(s) => toast.info(`✏️ Sửa trạm ${s.StationId}`)}
            onDelete={(id) => toast.info(`🗑️ Xóa trạm ${id}`)}
          />
        )}

        {/* ===== BOOKINGS ===== */}
        {activeTab === "bookings" && (
          <BookingTable
            bookings={bookings}
            onCancel={(id) => toast.info(`🚫 Hủy lịch ${id}`)}
          />
        )}

        {/* ===== PAYMENTS ===== */}
        {activeTab === "payments" && <PaymentTable />}

        {/* ===== REVENUE ===== */}
        {activeTab === "revenue" && (
          <section className="revenue-section">
            <h2>💰 Báo cáo doanh thu</h2>
            <div className="card large">
              <p>
                <strong>Tổng doanh thu:</strong>{" "}
                {revenueData?.TotalRevenue
                  ? revenueData.TotalRevenue.toLocaleString("vi-VN") + " ₫"
                  : "0 ₫"}
              </p>
              <p>
                <strong>Số giao dịch:</strong>{" "}
                {revenueData?.TransactionCount || 0}
              </p>
              <p>
                <strong>Trung bình mỗi giao dịch:</strong>{" "}
                {revenueData?.AvgTransaction
                  ? revenueData.AvgTransaction.toLocaleString("vi-VN") + " ₫"
                  : "0 ₫"}
              </p>
            </div>
            <div className="card chart-container">
              <RevenueChart />
            </div>
          </section>
        )}
      </main>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default AdminDashboard;
