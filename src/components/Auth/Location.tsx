import React from "react";
import { useNavigate } from "react-router-dom";
import "./Location.css";
import ProfileStaff from "./ProfileStaff";

const Location: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="staff-wrapper">
      {/* Sidebar */}
      <aside className="staff-sidebar">
        <div className="staff-logo">⚡ EV STAFF</div>
        <nav className="staff-menu">
          <ul>
            <li onClick={() => navigate("/staff")}>About</li>
            <li className="active">Location</li>
            <li onClick={() => navigate("/staff/sessions")}>Sessions</li>
            <li onClick={() => navigate("/staff/transactions")}>Transactions</li>
            <li onClick={() => navigate("/staff/report")}>Report To Admin</li>
            <li onClick={() => navigate("/staff/settings")}>Settings</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={() => navigate("/")}>← Exit</button>
      </aside>

      {/* Main + Footer Wrapper */}
      <div className="staff-main-wrapper">
        <main className="staff-main">
          {/* Header */}
          <header className="staff-header">
            <h1>📍 Manage Locations</h1>
            <div className="staff-header-actions">
              <ProfileStaff />
            </div>
          </header>

          {/* Content */}
          <section className="staff-content">
            <p>This is Location Page. Content will be added later.</p>
          </section>
        </main>

        {/* Footer */}
        <footer className="footer">@SWP Staff Fall 2025</footer>
      </div>
    </div>
  );
};

export default Location;
