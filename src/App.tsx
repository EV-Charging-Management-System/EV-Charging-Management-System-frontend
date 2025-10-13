import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/Auth/HomePage";
import Membership from "./components/Auth/Membership";
import MembershipDetail from "./components/Auth/MembershipDetail";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/membership/:type" element={<MembershipDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
