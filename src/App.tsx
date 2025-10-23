// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Page/EV-Driver/HomePage";
import BookingOnlineStation from "./Page/EV-Driver/BookingOnlineStation";
import Premium from "./Page/EV-Driver/Premium";
import PremiumDetail from "./Page/EV-Driver/PremiumDetail";
import ViTraSau from "./Page/EV-Driver/ViTraSau";
import Blog from "./Page/EV-Driver/Blog";
import Payment from "./Page/EV-Driver/Payment";
import Contact from "./Page/EV-Driver/Contact";
import Business from "./Page/EV-Driver/Business";
import BookingDetail from "./Page/EV-Driver/BookingDetail";
import ChargingSchedule from "./Page/EV-Driver/ChargingSchedule";
import ChargingSession from "./Page/EV-Driver/ChargingSession";
import Pay from "./Page/EV-Driver/Pay";
import HomePageStaff from "./Page/Staff/HomePageStaff";
import ProfileStaff from "./Page/Staff/ProfileStaff";
import Location from "./Page/Staff/Location";
import LocationDetail from "./Page/Staff/LocationDetail";
import Sessions from "./Page/Staff/Sessions";
import ChargingProcessStaff from "./Page/Staff/ChargingProcessStaff";
import Invoice from "./Page/Staff/Invoice";
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
