import React, { useEffect, useState } from "react";
import "../../css/AdminDashboard.css";
import { useNavigate } from "react-router-dom";

import { authService } from "../../services/authService";
import { adminService } from "../../services/adminService";
import { ToastContainer, toast } from "react-toastify";

import AdminSidebar from "./Sidebar/AdminSidebar";
import DashboardOverview from "./Dashboard/DashboardOverview";

import UsersSection from "./Users/UsersSection";
import StaffSection from "./Staff/StaffSection";
import BusinessAccountTable from "../../components/BusinessAccountTable";

import StationSection from "./Stations/StationSection";
import PointsSection from "./Stations/PointsSection";
import PortsSection from "./Stations/PortsSection";

import BookingTable from "../../components/BookingTable";
import PaymentTable from "../../components/PaymentTable";

import ProfileAdmin from "../../pages/Admin/ProfileAdmin";
import DiscountSection from "./Discount/DiscountSection";


const AdminDashboard: React.FC = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");

  const [stats, setStats] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [points, setPoints] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any>({});

  const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
  const [selectedStationName, setSelectedStationName] = useState<string>("");

  const [selectedPointId, setSelectedPointId] = useState<number | null>(null);

  const [staffList, setStaffList] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);


  // LOADERS ===============================
  const loadStats = async () => {
    try {
      setStats(await adminService.getDashboardStats());
    } catch {
      toast.error("Failed to load dashboard");
    }
  };

  const loadUsers = async () => {
    setUsers(await adminService.getAllUsers());
  };

  const loadStations = async () => {
    setStations(await adminService.getAllStations());
  };

  const loadPoints = async (stationId: number) => {
    const res = await adminService.getPointsByStation(stationId);
    setPoints(res || []);
  };

  const loadPorts = async (pointId: number) => {
    const res = await adminService.getPortsByPoint(pointId);
    setPorts(res || []);
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


  // INIT ===============================
  useEffect(() => {
    Promise.all([loadStats(), loadUsers(), loadStations()]);
  }, []);

  useEffect(() => {
    if (activeTab === "staff") loadStaff();
    if (activeTab === "revenue") loadRevenue();
  }, [activeTab]);


  // LOGOUT ===============================
  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };


  // =====================================================
  //                   RENDER
  // =====================================================

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
            <h1>📊 Admin Dashboard</h1>
            <p>Optimizing your journey, powering your life</p>
          </div>
          <ProfileAdmin />
        </header>

        {activeTab === "discount" && <DiscountSection />}
        {activeTab === "dashboard" && <DashboardOverview stats={stats} />}

        {activeTab === "users" && (
          <UsersSection
            users={users}

            onAdd={async (newUser) => {
              try {
                const res = await adminService.createStaff(
                  newUser.Mail,
                  "123456",
                  newUser.UserName,
                  "No address"
                );

                res.success ? toast.success(res.message) : toast.error(res.message);
                await loadUsers();
              } catch {
                toast.error("Error adding account!");
              }
            }}

            onEdit={async (updatedUser) => {
              try {
                const res = await adminService.updateUser(updatedUser.UserId, updatedUser);

                res.success ? toast.success(res.message) : toast.error(res.message);
                await loadUsers();
              } catch {
                toast.error("Error updating account!");
              }
            }}

            onDelete={async (userId) => {
              try {
                const res = await adminService.deleteUser(userId);

                res.success ? toast.success(res.message) : toast.error(res.message);
                await loadUsers();
              } catch {
                toast.error("Error deleting account!");
              }
            }}
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


        {/* ======================================================
            ⭐ STATIONS → POINTS → PORTS (Flow chuẩn)
        ======================================================= */}

        {activeTab === "stations" && (
          <StationSection
            stations={stations}
            onCreate={async () => {
              await loadStations();
            }}
            onDelete={async (id: number) => {
              try {
                const res = await adminService.deleteStation(id);
                res.success ? toast.success("Delete successful") : toast.error(res.message);
                loadStations();
              } catch {
                toast.error("Error deleting station");
              }
            }}
            onViewPoints={(stationId: number, name: string) => {
              setSelectedStationId(stationId);
              setSelectedStationName(name);
              loadPoints(stationId);
              setActiveTab("points");
            }}
          />
        )}

        {activeTab === "points" && selectedStationId && (
          <PointsSection
            points={points}
            stationId={selectedStationId}
            stationName={selectedStationName}

            onAdd={async (numPorts: number) => {
              try {
                if (numPorts <= 0) {
                  toast.warning("Number of ports must be greater than 0!");
                  return;
                }
                const res = await adminService.createPoint(selectedStationId, numPorts);
                if (res.success) {
                  toast.success("Point created successfully");
                  loadPoints(selectedStationId);
                } else {
                  toast.error(res.message);
                }
              } catch {
                toast.error("Error creating Point");
              }
            }}

            onEdit={async (point) => {
              try {
                const res = await adminService.updatePoint(
                  point.PointId,
                  point.NumberOfPort,
                  point.ChargingPointStatus
                );

                res.success ? toast.success("Update successful") : toast.error(res.message);
                loadPoints(selectedStationId);
              } catch {
                toast.error("Error updating Point");
              }
            }}

            onDelete={async (id) => {
              try {
                const res = await adminService.deletePoint(id);
                res.success ? toast.success("Delete successful") : toast.error(res.message);
                loadPoints(selectedStationId);
              } catch {
                toast.error("Cannot delete Point");
              }
            }}

            onViewPorts={(pointId: number) => {
              setSelectedPointId(pointId);
              loadPorts(pointId);
              setActiveTab("ports");
            }}

            onBack={() => {
              setActiveTab("stations");
              setSelectedStationId(null);
            }}
          />
        )}

        {activeTab === "ports" && selectedPointId && (
          <PortsSection
            ports={ports}
            pointId={selectedPointId}
            stationName={selectedStationName}

            onAdd={async (port: {
              PortName: string;
              PortType: string;
              PortStatus: string;
              PortTypeOfKwh: number;
              PortTypePrice: number;
            }) => {
              try {
                if (!port.PortName || !port.PortType) {
                  toast.warning("Please fill in all Port information!");
                  return;
                }
                if (port.PortTypeOfKwh <= 0) {
                  toast.warning("Power must be greater than 0!");
                  return;
                }
                const res = await adminService.createPort(
                  selectedPointId,
                  port.PortName,
                  port.PortType,
                  port.PortStatus || "AVAILABLE",
                  port.PortTypeOfKwh,
                  port.PortTypePrice
                );
                if (res.success) {
                  toast.success("Port added successfully");
                  loadPorts(selectedPointId);
                } else {
                  toast.error(res.message);
                }
              } catch {
                toast.error("Error adding Port");
              }
            }}

            onEdit={async (port: {
              PortId: number;
              PointId: number;
              PortName: string;
              PortType: string;
              PortStatus: string;
              PortTypeOfKwh?: number;
              PortTypePrice?: number;
            }) => {
              try {
                if (!port.PortName || !port.PortType) {
                  toast.warning("Please fill in all Port information!");
                  return;
                }
                const res = await adminService.updatePort(
                  port.PortId,
                  port.PortName,
                  port.PortType,
                  port.PortStatus,
                  port.PortTypeOfKwh || 0,
                  port.PortTypePrice || 0
                );
                if (res.success) {
                  toast.success("Port updated successfully");
                  loadPorts(selectedPointId);
                } else {
                  toast.error(res.message);
                }
              } catch {
                toast.error("Error updating Port");
              }
            }}

            onDelete={async (id: number) => {
              try {
                const res = await adminService.deletePort(id);
                if (res.success) {
                  toast.success("Port deleted successfully");
                  loadPorts(selectedPointId);
                } else {
                  toast.error(res.message);
                }
              } catch {
                toast.error("Error deleting Port");
              }
            }}

            onBack={() => {
              setActiveTab("points");
              setSelectedPointId(null);
            }}
          />
        )}


        {/* ====================================================== */}

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
