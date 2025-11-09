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
  Zap,
  Cable,
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
import PointTable from "../../components/PointTable";
import PortTable from "../../components/PortTable";
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

  // 🆕 State cho Point & Port management
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [selectedStationName, setSelectedStationName] = useState<string>("");
  const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
  const [points, setPoints] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);

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

  // 🗑️ Xóa trạm sạc
  const handleDeleteStation = async (id: number) => {
    try {
      const res = await adminService.deleteStation(id);
      if (res.success) {
        toast.success("🗑️ Xóa trạm sạc thành công!");
        await loadStations();
      } else {
        toast.error(res.message || "❌ Xóa trạm thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi xóa trạm:", error);
      toast.error("❌ Lỗi khi xóa trạm sạc!");
    }
  };

  // 📍 Load Points theo Station
  const loadPoints = async (stationId: number) => {
    try {
      const res = await adminService.getPointsByStation(stationId);
      setPoints(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("⚠️ Lỗi tải Points:", error);
      setPoints([]);
    }
  };

  // 🔌 Load Ports theo Point
  const loadPorts = async (pointId: number) => {
    try {
      const res = await adminService.getPortsByPoint(pointId);
      console.log("🔍 API Response for Ports:", res);
      console.log("🔍 Is Array?", Array.isArray(res));
      setPorts(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("⚠️ Lỗi tải Ports:", error);
      setPorts([]);
    }
  };

  // ➕ Thêm Point
  const handleAddPoint = async (point: Partial<any>) => {
    try {
      const res = await adminService.createPoint(
        point.StationId!,
        point.NumberOfPort!
      );
      if (res.success) {
        toast.success("✅ Thêm Point thành công!");
        if (selectedStationId) await loadPoints(selectedStationId);
      } else {
        toast.error(res.message || "❌ Thêm Point thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi thêm Point:", error);
      toast.error("❌ Lỗi khi thêm Point!");
    }
  };

  // ✏️ Cập nhật Point
  const handleEditPoint = async (point: any) => {
    try {
      const res = await adminService.updatePoint(
        point.PointId,
        point.NumberOfPort,
        point.ChargingPointStatus
      );
      if (res.success) {
        toast.success("✏️ Cập nhật Point thành công!");
        if (selectedStationId) await loadPoints(selectedStationId);
      } else {
        toast.error(res.message || "❌ Cập nhật Point thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật Point:", error);
      toast.error("❌ Lỗi khi cập nhật Point!");
    }
  };

  // 🗑️ Xóa Point
  const handleDeletePoint = async (id: number) => {
    try {
      const res = await adminService.deletePoint(id);
      if (res.success) {
        toast.success("🗑️ Xóa Point thành công!");
        if (selectedStationId) await loadPoints(selectedStationId);
      } else {
        toast.error(res.message || "❌ Xóa Point thất bại! Có thể còn Port đang hoạt động.");
      }
    } catch (error) {
      console.error("❌ Lỗi xóa Point:", error);
      toast.error("❌ Lỗi khi xóa Point!");
    }
  };

  // ➕ Thêm Port
  const handleAddPort = async (port: Partial<any>) => {
    try {
      const res = await adminService.createPort(
        port.PointId!,
        port.PortName!,
        port.PortType!,
        port.PortStatus!
      );
      if (res.success) {
        toast.success("✅ Thêm Port thành công!");
        if (selectedPointId) await loadPorts(selectedPointId);
      } else {
        toast.error(res.message || "❌ Thêm Port thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi thêm Port:", error);
      toast.error("❌ Lỗi khi thêm Port!");
    }
  };

  // ✏️ Cập nhật Port
  const handleEditPort = async (port: any) => {
    try {
      const res = await adminService.updatePort(
        port.PortId,
        port.PortName,
        port.PortType,
        port.PortStatus
      );
      if (res.success) {
        toast.success("✏️ Cập nhật Port thành công!");
        if (selectedPointId) await loadPorts(selectedPointId);
      } else {
        toast.error(res.message || "❌ Cập nhật Port thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật Port:", error);
      toast.error("❌ Lỗi khi cập nhật Port!");
    }
  };

  // 🗑️ Xóa Port
  const handleDeletePort = async (id: number) => {
    try {
      const res = await adminService.deletePort(id);
      if (res.success) {
        toast.success("🗑️ Xóa Port thành công!");
        if (selectedPointId) await loadPorts(selectedPointId);
      } else {
        toast.error(res.message || "❌ Xóa Port thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi xóa Port:", error);
      toast.error("❌ Lỗi khi xóa Port!");
    }
  };

  // 🎯 Xem Points của Station
  const handleViewPoints = (stationId: number) => {
    const station = stations.find(s => s.StationId === stationId);
    setSelectedStationId(stationId);
    setSelectedStationName(station?.StationName || `Trạm ${stationId}`);
    setSelectedPointId(null);
    setActiveTab("points");
    loadPoints(stationId);
  };

  // 🎯 Xem Ports của Point
  const handleViewPorts = (pointId: number) => {
    setSelectedPointId(pointId);
    setActiveTab("ports");
    loadPorts(pointId);
  };

  // 🔙 Quay lại từ Points về Stations
  const handleBackToStations = () => {
    setSelectedStationId(null);
    setSelectedStationName("");
    setSelectedPointId(null);
    setPoints([]);
    setActiveTab("stations");
  };

  // 🔙 Quay lại từ Ports về Points
  const handleBackToPoints = () => {
    setSelectedPointId(null);
    setPorts([]);
    setActiveTab("points");
    if (selectedStationId) {
      loadPoints(selectedStationId);
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
            className={activeTab === "points" ? "active" : ""}
            onClick={() => {
              if (!selectedStationId) {
                toast.warning("⚠️ Vui lòng chọn trạm sạc trước!");
                setActiveTab("stations");
              } else {
                setActiveTab("points");
              }
            }}
          >
            <Zap size={18} /> Charging Points
          </li>
          <li
            className={activeTab === "ports" ? "active" : ""}
            onClick={() => {
              if (!selectedPointId) {
                toast.warning("⚠️ Vui lòng chọn Point trước!");
                if (selectedStationId) {
                  setActiveTab("points");
                } else {
                  setActiveTab("stations");
                }
              } else {
                setActiveTab("ports");
              }
            }}
          >
            <Cable size={18} /> Charging Ports
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
            onEdit={(s: any) => toast.info(`✏️ Sửa trạm ${s.StationId}`)}
            onDelete={handleDeleteStation}
            onViewPoints={handleViewPoints}
          />
        )}

        {/* ===== POINTS ===== */}
        {activeTab === "points" && selectedStationId && (
          <PointTable
            points={points}
            stationId={selectedStationId}
            stationName={selectedStationName}
            onAdd={handleAddPoint}
            onEdit={handleEditPoint}
            onDelete={handleDeletePoint}
            onViewPorts={handleViewPorts}
            onBack={handleBackToStations}
          />
        )}

        {/* ===== PORTS ===== */}
        {activeTab === "ports" && selectedPointId && (
          <PortTable
            ports={ports}
            pointId={selectedPointId}
            stationName={selectedStationName}
            onAdd={handleAddPort}
            onEdit={handleEditPort}
            onDelete={handleDeletePort}
            onBack={handleBackToPoints}
          />
        )}

        {/* ===== BOOKINGS ===== */}
        {activeTab === "bookings" && (
          <BookingTable
            bookings={bookings}
            onCancel={(id: any) => toast.info(`🚫 Hủy lịch ${id}`)}
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
