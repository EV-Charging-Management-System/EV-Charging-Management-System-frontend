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
          <LayoutDashboard size={18} /> Overview
        </li>

        <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}> 
          <Users size={18} /> Account Management
        </li>

        <li className={activeTab === "staff" ? "active" : ""} onClick={() => setActiveTab("staff")}> 
          <UserPlus size={18} /> Staff
        </li>

        <li className={activeTab === "business" ? "active" : ""} onClick={() => setActiveTab("business")}> 
          <Building2 size={18} /> Business Accounts
        </li>

        <li className={activeTab === "stations" ? "active" : ""} onClick={() => setActiveTab("stations")}> 
          <BatteryCharging size={18} /> Charging Stations
        </li>

        <li
          className={activeTab === "points" ? "active" : ""}
          onClick={() => {
            if (!selectedStationId) return toast.warning("⚠️ Please select a station first!");
            setActiveTab("points");
          }}
        >
          <Zap size={18} /> Charging Points
        </li>

        <li
          className={activeTab === "ports" ? "active" : ""}
          onClick={() => {
            if (!selectedPointId) return toast.warning("⚠️ Please select a point first!");
            setActiveTab("ports");
          }}
        >
          <Cable size={18} /> Charging Ports
        </li>

        <li className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}> 
          <CalendarCheck2 size={18} /> Bookings
        </li>

        <li className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}> 
          <CreditCard size={18} /> Payments
        </li>

        <li className={activeTab === "revenue" ? "active" : ""} onClick={() => setActiveTab("revenue")}> 
          <BarChart3 size={18} /> Revenue
        </li>

        {/* 🌟 THÊM TAB GIẢM GIÁ Ở ĐÂY */}
        <li className={activeTab === "discount" ? "active" : ""} onClick={() => setActiveTab("discount")}> 
          <Percent size={18} /> Discount
        </li>

      </ul>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
