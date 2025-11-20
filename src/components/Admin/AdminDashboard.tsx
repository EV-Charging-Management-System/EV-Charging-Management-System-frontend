import React, { useEffect, useState } from "react";
import "../../css/AdminDashboard.css";

import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { adminService } from "../../services/adminService";
import { ToastContainer, toast } from "react-toastify";
// ⚡⚡⚡ THÊM IMPORT NÀY
import DiscountSection from "./Discount/DiscountSection";

import ProfileAdmin from "../../pages/Admin/ProfileAdmin";


// Sidebar
import AdminSidebar from "./Sidebar/AdminSidebar";

// Dashboard
import DashboardOverview from "./Dashboard/DashboardOverview";

// Modules
import UsersSection from "./Users/UsersSection";
import StaffSection from "./Staff/StaffSection";
import BusinessAccountTable from "../../components/BusinessAccountTable";
import StationTable from "../../components/StationTable";
import PointTable from "../../components/PointTable";
import PortTable from "../../components/PortTable";
import BookingTable from "../../components/BookingTable";
import PaymentTable from "../../components/PaymentTable";




const AdminDashboard: React.FC = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>({});

  // Staff
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  // Points & Ports
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [selectedStationName, setSelectedStationName] = useState("");
  const [selectedPointId, setSelectedPointId] = useState<number | null>(null);

  const [points, setPoints] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);

  // INIT LOAD
  useEffect(() => {
    Promise.all([loadStats(), loadUsers(), loadStations()]);
  }, []);

  // LOADERS
  const loadStats = async () => {
    try { setStats(await adminService.getDashboardStats()); }
    catch { toast.error("Không thể tải dashboard"); }
  };

  const loadUsers = async () => {
    setUsers(await adminService.getAllUsers());
  };

  const loadStations = async () => {
    setStations(await adminService.getAllStations());
  };

  const loadStaff = async () => {
    setLoadingStaff(true);
    const res = await adminService.getAllStaff();
    setStaffList(res);
    setLoadingStaff(false);
  };

  const loadRevenue = async () => {
    const res = await adminService.getRevenueReport?.();
    setRevenueData(res?.data || res || {});
  };

  // LOAD WHEN TAB CHANGE
  useEffect(() => {
    if (activeTab === "staff") loadStaff();
    if (activeTab === "revenue") loadRevenue();
  }, [activeTab]);

  // LOGOUT
  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">

      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedStationId={selectedStationId}
        selectedPointId={selectedPointId}
        onLogout={handleLogout}
      />

      <main className="admin-content">
        <header className="admin-header">
          <div>
            <h1>📊 Bảng điều khiển quản trị viên</h1>
            <p>Optimizing your journey, powering your life</p>
          </div>
          <ProfileAdmin />
        </header>
        {activeTab === "discount" && <DiscountSection />}

        {activeTab === "dashboard" && <DashboardOverview stats={stats} />}

        {activeTab === "users" && (
          <UsersSection
            users={users}
            onAdd={() => { }}
            onEdit={() => { }}
            onDelete={() => { }}
          />
        )}

        {activeTab === "staff" && (
          <StaffSection
            staffList={staffList}
            loading={loadingStaff}
            refresh={loadStaff}
          />
        )}

        {activeTab === "business" && <BusinessAccountTable />}

        {activeTab === "stations" && (
          <StationTable
            stations={stations}
            onViewPoints={(id: number) => {
              setSelectedStationId(id);
              setActiveTab("points");
            }}
          />
        )}

        {activeTab === "points" && selectedStationId && (
          <PointTable
            points={points}
            stationId={selectedStationId}
            stationName={selectedStationName}
            onBack={() => {
              setActiveTab("stations");
              setSelectedStationId(null);
            }}
          />
        )}

        {activeTab === "ports" && selectedPointId && (
          <PortTable
            ports={ports}
            pointId={selectedPointId}
            stationName={selectedStationName}
            onBack={() => {
              setActiveTab("points");
              setSelectedPointId(null);
            }}
          />
        )}

        {activeTab === "bookings" && (
          <BookingTable bookings={bookings} />
        )}

        {activeTab === "payments" && <PaymentTable />}
      </main>

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default AdminDashboard;

