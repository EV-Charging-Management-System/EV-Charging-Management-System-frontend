import { useNavigate, useLocation } from "react-router-dom";
import "../../css/Menu-bar.css";

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="menu-bar">
      <ul className="menu-list">
        <li className={currentPath === "/" ? "menu-active" : ""} onClick={() => navigate("/")}>
          About
        </li>
        <li
          className={currentPath === "/booking-online-station" ? "menu-active" : ""}
          onClick={() => navigate("/booking-online-station")}
        >
          Booking Online Station
        </li>
        <li className={currentPath === "/blog" ? "menu-active" : ""} onClick={() => navigate("/blog")}>
          Blog
        </li>
        <li className={currentPath === "/payment" ? "menu-active" : ""} onClick={() => navigate("/payment")}>
          Payment
        </li>
        <li className={currentPath === "/contact" ? "menu-active" : ""} onClick={() => navigate("/contact")}>
          Contact
        </li>
        <li className={currentPath === "/premium" ? "menu-active" : ""} onClick={() => navigate("/premium")}>
          Premium
        </li>
        <li className={currentPath === "/business" ? "menu-active" : ""} onClick={() => navigate("/business")}>
          Business
        </li>

        {/* 🚘 Thêm mục Xe của tôi */}
        <li
          className={currentPath === "/evdriver/vehicle" ? "menu-active" : ""}
          onClick={() => navigate("/evdriver/vehicle")}
        >
          My Vehicle
        </li>
      </ul>
    </nav>
  );
};

export default MenuBar;
