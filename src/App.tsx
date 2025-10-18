// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/Auth/HomePage";
import Premium from "./components/Auth/Premium";
import PremiumDetail from "./components/Auth/PremiumDetail";
import ViTraSau from "./components/Auth/ViTraSau";
import BookingOnlineStation from "./components/Auth/BookingOnlineStation";
import Payment from "./components/Auth/Payment";
import Contact from "./components/Auth/Contact";
import Business from "./components/Auth/Business";
import Blog from "./components/Auth/Blog";
import BookingDetail from "./components/Auth/BookingDetail";
import ChargingSchedule from "./components/Auth/ChargingSchedule";
import ChargingSession from "./components/Auth/ChargingSession";
import Pay from "./components/Auth/Pay";
import HomePageStaff from "./components/Auth/HomePageStaff";
import ProfileStaff from "./components/Auth/ProfileStaff";

// ✅ Thêm các trang STAFF
import Location from "./components/Auth/Location";
//import Sessions from "./components/Auth/Sessions";
//import Transactions from "./components/Auth/Transactions";
//import ReportToAdmin from "./components/Auth/ReporttoAdmin";
//import Settings from "./components/Auth/Settings";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Trang đặt chỗ trạm sạc */}
        <Route path="/booking-online-station" element={<BookingOnlineStation />} />

        {/* Trang hội viên */}
        <Route path="/premium" element={<Premium />} />
        <Route path="/premium/:type" element={<PremiumDetail />} />

        {/* Trang ví trả sau */}
        <Route path="/vi-tra-sau" element={<ViTraSau />} />

        {/* Trang blog */}
        <Route path="/blog" element={<Blog />} />

        {/* Trang thanh toán */}
        <Route path="/payment" element={<Payment />} />

        {/* Trang liên hệ */}
        <Route path="/contact" element={<Contact />} />

        {/* Trang doanh nghiệp */}
        <Route path="/business" element={<Business />} />

        {/* Trang chi tiết đặt chỗ */}
        <Route path="/booking-detail/:id" element={<BookingDetail />} />

        {/* Trang lịch sạc */}
        <Route path="/charging-schedule" element={<ChargingSchedule />} />

        {/* Phiên sạc */}
        <Route path="/charging-session" element={<ChargingSession />} />

        {/* Thanh toán Pay */}
        <Route path="/pay" element={<Pay />} />

        {/* Trang chủ nhân viên */}
        <Route path="/staff" element={<HomePageStaff />} />
        <Route path="/staff/profile" element={<ProfileStaff />} />

        {/* Các trang nhân viên khác */}
        <Route path="/staff/location" element={<Location />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
