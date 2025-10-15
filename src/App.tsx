// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/Auth/HomePage";
import Membership from "./components/Auth/Membership";
import MembershipDetail from "./components/Auth/MembershipDetail";
import ViTraSau from "./components/Auth/ViTraSau";
import BookingOnlineStation from "./components/Auth/BookingOnlineStation";
import Payment from "./components/Auth/Payment";
import Contact from "./components/Auth/Contact";
import Business from "./components/Auth/Business";
import Blog from "./components/Auth/Blog";
import BookingDetail from "./components/Auth/BookingDetail";
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Trang đặt chỗ trạm sạc */}
        <Route path="/booking-online-station" element={<BookingOnlineStation />} />

        {/* Trang hội viên */}
        <Route path="/membership" element={<Membership />} />
        <Route path="/membership/:type" element={<MembershipDetail />} />

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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
