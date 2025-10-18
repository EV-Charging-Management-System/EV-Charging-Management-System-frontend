import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePageStaff.css";
import ProfileStaff from "./ProfileStaff";

const HomePageStaff: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="staff-wrapper">
      {/* ============ SIDEBAR ============ */}
      <aside className="staff-sidebar">
        <div className="staff-logo">⚡ EV STAFF</div>
        <nav className="staff-menu">
          <ul>
            <li className="active" onClick={() => navigate("/staff")}>About</li>
            <li onClick={() => navigate("/staff/location")}>Location</li>
            <li onClick={() => navigate("/staff/sessions")}>Sessions</li>
            <li onClick={() => navigate("/staff/transactions")}>Transactions</li>
            <li onClick={() => navigate("/staff/report")}>Report To Admin</li>
            <li onClick={() => navigate("/staff/settings")}>Settings</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={() => navigate("/")}>← Exit</button>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="staff-main">
        <header className="staff-header">
          <h1>Optimising your journey, <span>Powering your life</span></h1>

          {/* Profile (đã bỏ chuông theo yêu cầu) */}
          <div className="staff-header-actions">
            <ProfileStaff />
          </div>
        </header>

        <section className="staff-content">
          <h2>About System</h2>
          <p>
            This system is built to support EV charging station management. Staff can monitor
            stations, track transactions, check charging sessions and verify user activities.
          </p>
          <p>
            Our goal is to deliver fast and safe charging operations with smart management tools.
            The system is being improved every day to reach high performance and better experience.
          </p>

          <div className="about-box">
            <div className="about-card">⚙️ Real-time Station Control</div>
            <div className="about-card">🔐 Role-based Security Access</div>
            <div className="about-card">⚡ Energy Optimisation</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePageStaff;
