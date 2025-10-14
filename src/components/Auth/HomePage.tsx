import React from "react";
import "./HomePage.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService"; // import logout

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      alert("Đăng xuất thành công!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout thất bại!");
    }
  };

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
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/booking-online-station"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Booking Online Station
            </NavLink>
          </li>
          <li>
           <NavLink
              to="/blog"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/payment"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Payment
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/membership"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Membership
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/business"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Business
            </NavLink>
          </li>
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

          {/* ✅ Nút logout */}
          <button
            className="logout-btn"
            onClick={handleLogout}
            style={{ backgroundColor: "#ef4444", color: "white", fontWeight: "bold" }}
          >
            Logout
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default HomePage;
