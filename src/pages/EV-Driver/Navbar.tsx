import { NavLink } from "react-router-dom";
import "./Navbar.css"; // tạo file CSS này ở cùng thư mục

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        About
      </NavLink>

      <NavLink
        to="/booking-online-station"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Booking Online Station
      </NavLink>

      <NavLink to="/blog" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        Blog
      </NavLink>

      <NavLink to="/payment" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        Payment
      </NavLink>

      <NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        Contact
      </NavLink>

      <NavLink to="/business" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        Business
      </NavLink>

      {/* 🚘 Thêm mục Xe của tôi */}
      <NavLink to="/evdriver/vehicle" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        My Vehicle
      </NavLink>

      <NavLink to="/premium" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        Premium
      </NavLink>

      <NavLink to="/notification" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        Notification
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "inactive")}>
        Profile
      </NavLink>
    </nav>
  );
};

export default Navbar;
