import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/StaffSidebar.css";

const StaffSideBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra xem menu nào đang active
  const isActive = (path: string) => (location.pathname === path ? "active" : "");

  return (
    <aside className="charging-sidebar-hover">
      <div className="charging-sidebar">
        {/* Logo */}
        <div className="charging-logo" onClick={() => navigate("/staff")} style={{ cursor: "pointer" }}>
          ⚡ EV STAFF
        </div>

        {/* Menu */}
        <nav className="charging-menu">
          <ul>
            <li className={isActive("/staff")} onClick={() => navigate("/staff")}>
              About
            </li>

            <li className={isActive("/staff/location")} onClick={() => navigate("/staff/location")}>
              Location
            </li>

          

           <li
              className={isActive("/staff/charging-process-staff/1")}
              onClick={() => navigate("/staff/charging-process-staff/1")}
            >
              Charging Process
            </li>

            <li className={isActive("/staff/invoice")} onClick={() => navigate("/staff/invoice")}>
              Invoice
            </li>


          </ul>
        </nav>

        {/* Logout */}
        <button className="logout-btn" onClick={() => navigate("/")}>
          ← Exit
        </button>
      </div>
    </aside>
  );
};

export default StaffSideBar;
