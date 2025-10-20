import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileStaff from "./ProfileStaff";
import "./HomePageStaff.css";

const HomePageStaff: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
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
        {/* Google Maps iframe Background */}
        <iframe
          title="HomePage Staff Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.484!2d106.7009!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f!2sTP.HCM!5e0!3m2!1sen!2s!4v1690000000000"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
            zIndex: 0,
          }}
          allowFullScreen
          loading="lazy"
        />

        <main className="staff-main" style={{ position: "relative", zIndex: 1 }}>
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

        <footer className="footer" style={{ position: "relative", zIndex: 1 }}>
          @SWP Staff Fall 2025
        </footer>
      </div>
    </div>
  );
};

export default HomePageStaff;
