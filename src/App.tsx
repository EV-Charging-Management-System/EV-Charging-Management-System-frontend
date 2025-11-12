import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { authService } from "./services/authService";
import Login from "./pages/Auth/Login";

// EV Driver Pages
import HomePage from "./pages/EV-Driver/HomePage";
import BookingOnlineStation from "./pages/EV-Driver/BookingOnlineStation";
import Premium from "./pages/EV-Driver/Premium";
import PremiumDetail from "./pages/EV-Driver/PremiumDetail";
import ViTraSau from "./pages/EV-Driver/ViTraSau";
import Blog from "./pages/EV-Driver/Blog";
import Payment from "./pages/EV-Driver/Payment";
import Contact from "./pages/EV-Driver/Contact";
import Business from "./pages/EV-Driver/Business";
import BookingDetail from "./pages/EV-Driver/BookingDetail";
import VnPayReturn from "./pages/EV-Driver/VnPayReturn";
import PaymentSuccess from "./pages/EV-Driver/PaymentSuccess";
import PaymentFail from "./pages/EV-Driver/PaymentFail";
import ChargingSchedule from "./pages/EV-Driver/ChargingSchedule";
import ChargingSession from "./pages/EV-Driver/ChargingSession";
import Pay from "./pages/EV-Driver/Pay";
import Vehicle from "./pages/EV-Driver/Vehicle";

// Staff & Admin imports
import HomePageStaff from "./pages/Staff/HomePageStaff";
import ProfileStaff from "./components/ProfileStaff";
import Location from "./pages/Staff/Location";
import LocationDetail from "./pages/Staff/LocationDetail";
import ChargingProcessStaff from "./pages/Staff/ChargingProcessStaff";
import Invoice from "./pages/Staff/Invoice";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const App: React.FC = () => {
  const ProtectedRoute = ({
    element,
    allowedRoles,
  }: {
    element: JSX.Element;
    allowedRoles: string[];
  }) => {
    const user = authService.getCurrentUser();
    if (!user) return <Navigate to="/login" replace />;

    const role = (user.role || user.roleName || "").toUpperCase();
    if (!allowedRoles.includes(role)) return <Navigate to="/" replace />;

    return element;
  };
//
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔑 Login */}
        <Route path="/login" element={<Login />} />
  
        {/* 🚗 EV DRIVER ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/booking-online-station" element={<BookingOnlineStation />} />

        {/* 💎 PREMIUM FLOW */}
        <Route path="/premium" element={<Premium />} />
        <Route path="/premium/:type" element={<PremiumDetail />} />
        <Route path="/vnpay-return" element={<VnPayReturn />} /> {/* ✅ sửa đúng */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFail />} />

        {/* 💳 OTHER PAGES */}
        <Route path="/vi-tra-sau" element={<ViTraSau />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/business" element={<Business />} />
        <Route path="/booking-detail/:id" element={<BookingDetail />} />
        <Route path="/vnpay/return" element={<VnPayReturn />} />
        <Route path="/charging-schedule" element={<ChargingSchedule />} />
        <Route path="/charging-session" element={<ChargingSession />} />
        <Route path="/pay" element={<Pay />} />

        {/* 🚘 XE CỦA TÔI - EV DRIVER CÁ NHÂN */}
        <Route path="/evdriver/vehicle" element={<Vehicle />} />

        {/* 🧑‍🔧 STAFF ROUTES */}
        <Route
          path="/staff"
          element={<ProtectedRoute allowedRoles={["STAFF"]} element={<HomePageStaff />} />}
        />
        <Route
          path="/staff/profile"
          element={<ProtectedRoute allowedRoles={["STAFF"]} element={<ProfileStaff />} />}
        />
        <Route
          path="/staff/location"
          element={<ProtectedRoute allowedRoles={["STAFF"]} element={<Location />} />}
        />
        <Route
          path="/staff/locationDetail/:address"
          element={<ProtectedRoute allowedRoles={["STAFF"]} element={<LocationDetail />} />}
        />
        <Route
          path="/staff/charging-process"
          element={<ProtectedRoute allowedRoles={["STAFF"]} element={<ChargingProcessStaff />} />}
        />
        <Route
          path="/staff/charging-process-staff/:id"
          element={<ProtectedRoute allowedRoles={["STAFF"]} element={<ChargingProcessStaff />} />}
        />
        <Route
          path="/staff/invoice"
          element={<ProtectedRoute allowedRoles={["STAFF"]} element={<Invoice />} />}
        />

        {/* 🧑‍💼 ADMIN ROUTES */}
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRoles={["ADMIN"]} element={<AdminDashboard />} />}
        />

        {/* 🧱 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
