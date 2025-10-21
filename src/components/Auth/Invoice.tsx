import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileStaff from "./ProfileStaff";
import "./Invoice.css";

const Invoice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="invoice-wrapper">
      {/* ===== SIDEBAR ===== */}
      <aside className="charging-sidebar-hover">
        <div className="charging-sidebar">
          <div className="charging-logo">⚡ EV STAFF</div>
          <nav className="charging-menu">
            <ul>
              <li onClick={() => navigate("/staff")} >About</li>
              <li onClick={() => navigate("/staff/location")}>Location</li>
              <li onClick={() => navigate("/staff/sessions")}>Sessions</li>
              <li onClick={() => navigate("/staff/invoice")} className="active">Invoice</li>
              <li onClick={() => navigate("/staff/report")}>Report To Admin</li>
              <li onClick={() => navigate("/staff/settings")}>Settings</li>
            </ul>
          </nav>
          <button className="logout-btn" onClick={() => navigate("/")}>
            ← Exit
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="invoice-main-wrapper fade-in">
        <header className="charging-header">
          <h1>Optimising your journey, Powering your life</h1>
          <div className="charging-header-actions">
            <ProfileStaff />
          </div>
        </header>

        <main className="invoice-body">
          <h2>Invoice Page</h2>
          <p>abcd</p>
        </main>

        <footer className="footer">
          © 2025 EV Staff. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Invoice;
