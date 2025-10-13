import React from "react";
import "./HomePage.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="slogan">
            Optimising your journey, Powering your life
          </span>
        </div>

        <div className="header-center">
          <FaPhoneAlt className="phone-icon" />
          <span className="hotline-text">Hotline: 0112334567</span>
        </div>

        <div className="header-right" style={{ display: "flex", gap: "16px" }}>
          <Notification />
          <ProfileUser />
        </div>
      </header>

      {/* Menu */}
      <nav className="menu-bar">
        <ul className="menu-list">
          <li>About</li>
          <li>Booking Online Station</li>
          <li>Blog</li>
          <li>Payment</li>
          <li>Contact</li>
          <li>Business</li>
        </ul>
      </nav>

      {/* Main */}
      <main className="main-content">
        <div className="station-card">
          <input type="text" placeholder="Search" className="search-input" />
          <button className="find-btn">Find Station</button>

          <img src="/Maptamthoi.jpg" alt="Station Map" className="map-img" />

          <p className="charging-rate">
            Charging Rate: <strong>250,000 VND / Hour</strong>
          </p>

          <button className="logout-btn">Logout</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default HomePage;
