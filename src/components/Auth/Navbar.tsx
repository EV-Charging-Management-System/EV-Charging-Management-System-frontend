import { NavLink } from "react-router-dom";
import "./Navbar.css"; // tạo file CSS này ở cùng thư mục

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        About
      </NavLink>

      <NavLink
        to="/booking-online-station"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        booking Online Station
      </NavLink>

      <NavLink
        to="/membership"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Membership
      </NavLink>

      <NavLink
        to="/notification"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Notification
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Profile
      </NavLink>
    </nav>
  );
};

export default Navbar;
