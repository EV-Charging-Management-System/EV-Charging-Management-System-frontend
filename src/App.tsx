// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ChargingSchedule from "./pages/EV-Driver/ChargingSchedule";
import ChargingSession from "./pages/EV-Driver/ChargingSession";
import Pay from "./pages/EV-Driver/Pay";

import HomePageStaff from "./pages/Staff/HomePageStaff";
import ProfileStaff from "./components/ProfileStaff"; // ✅ Sửa lại đúng
import Location from "./pages/Staff/Location";
import LocationDetail from "./pages/Staff/LocationDetail";
import Sessions from "./pages/Staff/Sessions";
import ChargingProcessStaff from "./pages/Staff/ChargingProcessStaff";
import Invoice from "./pages/Staff/Invoice";

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

        <Route path="/staff/locationdetail/:id" element={<LocationDetail />} />

        <Route path="/staff/sessions/*" element={<Sessions />} />

        <Route path="/staff/charging-process-staff/:id" element={<ChargingProcessStaff />} />

        <Route path="/staff/invoice/" element={<Invoice />} />
        

      </Routes>
    </BrowserRouter>
  );
};

export default App;
