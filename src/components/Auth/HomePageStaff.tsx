import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePageStaff.css";
import ProfileStaff from "./ProfileStaff";

const HomePageStaff: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100); // fade-in
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="staff-wrapper">
      {/* ===== SIDEBAR HOVER ===== */}
      <aside className="staff-sidebar-hover">
        <div className="staff-sidebar">
          <div className="staff-logo">⚡ EV STAFF</div>
          <nav className="staff-menu">
            <ul>
              <li className="active" onClick={() => navigate("/staff")}>About</li>
              <li onClick={() => navigate("/staff/location")}>Location</li>
              <li onClick={() => navigate("/staff/sessions")}>Sessions</li>
              <li onClick={() => navigate("/staff/invoice")}>Invoice</li>
              <li onClick={() => navigate("/staff/report")}>Report To Admin</li>
              <li onClick={() => navigate("/staff/settings")}>Settings</li>
            </ul>
          </nav>
          <button className="logout-btn" onClick={() => navigate("/")}>← Exit</button>
        </div>
      </aside>

      {/* ===== MAIN WRAPPER ===== */}
      <div className={`staff-main-wrapper ${showContent ? "fade-in" : "hidden"}`}>
        <main className="staff-main">
          {/* Header */}
          <header className="staff-header">
            <h1>Optimising your journey, <span>Powering your life</span></h1>
            <div className="staff-header-actions">
              <ProfileStaff />
            </div>
          </header>

          {/* Hero */}
          <section className="staff-hero">
            <div className="hero-content">
              <h1 className="hi-staff-text">Hi Staff</h1>
              <p>
                This system is built to support EV charging station management. Staff can monitor
                stations, track transactions, check charging sessions and verify user activities.
              </p>
              <button 
                className="start-charge-btn" 
                onClick={() => navigate("/staff/sessions")}
              >
                Bắt đầu sạc
              </button>
            </div>
          </section>
        </main>

        <footer className="footer">@SWP Staff Fall 2025</footer>
      </div>
    </div>
  );
};

export default HomePageStaff;
