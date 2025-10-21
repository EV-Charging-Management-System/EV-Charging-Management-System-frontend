import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth'
import "./Navbar.css"; // tạo file CSS này ở cùng thư mục

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      console.error('Navbar logout failed', err)
    }
  }

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
        to="/Blog"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Blog
      </NavLink>

       <NavLink
        to="/Payment"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Payment
      </NavLink>

      <NavLink
        to="/Contact"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Contact
      </NavLink>

      <NavLink
        to="/Business"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Business
      </NavLink>


      <NavLink
        to="/premium"
        className={({ isActive }) => (isActive ? "active" : "inactive")}
      >
        Premium
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
      {isAuthenticated ? (
        <button onClick={handleLogout} className="nav-logout">Logout</button>
      ) : (
        <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : 'inactive')}>Login</NavLink>
      )}
    </nav>
  );
};

export default Navbar;
