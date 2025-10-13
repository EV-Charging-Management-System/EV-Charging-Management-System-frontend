import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/Auth/HomePage";
import Membership from "./components/Auth/Membership";
import MembershipDetail from "./components/Auth/MembershipDetail";
import ViTraSau from "./components/Auth/ViTraSau"; // thêm import

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Trang hội viên */}
        <Route path="/membership" element={<Membership />} />
        <Route path="/membership/:type" element={<MembershipDetail />} />

        {/* Trang ví trả sau */}
        <Route path="/vi-tra-sau" element={<ViTraSau />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
