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


        <Route path="/charging-session" element={<ChargingSession />} />

        <Route path="/pay" element={<Pay />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
