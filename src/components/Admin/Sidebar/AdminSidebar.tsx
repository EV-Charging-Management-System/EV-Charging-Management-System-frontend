import {
  Users, BatteryCharging, CalendarCheck2, CreditCard,
  DollarSign, LayoutDashboard, LogOut, Building2,
  UserPlus, BarChart3, Zap, Cable, Percent
} from "lucide-react";
import { toast } from "react-toastify";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedStationId: number | null;
  selectedPointId: number | null;
  onLogout: () => void;
}

const AdminSidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  selectedStationId,
  selectedPointId,
  onLogout,
}) => {
  return (
    <aside className="admin-sidebar">
      <h2 className="admin-logo">⚡ EV ADMIN</h2>

      <ul className="sidebar-menu">

        <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
          <LayoutDashboard size={18} /> Tổng quan
        </li>

        <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
          <Users size={18} /> Quản lý tài khoản
        </li>

        <li className={activeTab === "staff" ? "active" : ""} onClick={() => setActiveTab("staff")}>
          <UserPlus size={18} /> Nhân viên
        </li>

        <li className={activeTab === "business" ? "active" : ""} onClick={() => setActiveTab("business")}>
          <Building2 size={18} /> Tài khoản DN
        </li>

        <li className={activeTab === "stations" ? "active" : ""} onClick={() => setActiveTab("stations")}>
          <BatteryCharging size={18} /> Trạm sạc
        </li>

        <li
          className={activeTab === "points" ? "active" : ""}
          onClick={() => {
            if (!selectedStationId) return toast.warning("⚠️ Chọn trạm trước!");
            setActiveTab("points");
          }}
        >
          <Zap size={18} /> Charging Points
        </li>

        <li
          className={activeTab === "ports" ? "active" : ""}
          onClick={() => {
            if (!selectedPointId) return toast.warning("⚠️ Chọn point trước!");
            setActiveTab("ports");
          }}
        >
          <Cable size={18} /> Charging Ports
        </li>

        <li className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>
          <CalendarCheck2 size={18} /> Đặt lịch
        </li>

        <li className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}>
          <CreditCard size={18} /> Hóa đơn
        </li>

        <li className={activeTab === "revenue" ? "active" : ""} onClick={() => setActiveTab("revenue")}>
          <BarChart3 size={18} /> Doanh thu
        </li>

        {/* 🌟 THÊM TAB GIẢM GIÁ Ở ĐÂY */}
        <li className={activeTab === "discount" ? "active" : ""} onClick={() => setActiveTab("discount")}>
          <Percent size={18} /> Giảm giá
        </li>

      </ul>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={18} /> Đăng xuất
      </button>
    </aside>
  );
};

export default AdminSidebar;
