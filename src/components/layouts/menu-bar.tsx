import { useNavigate } from "react-router-dom";

const MenuBar = () => {
    const navigate = useNavigate();
    return (
        <nav className="menu-bar">
        <ul className="menu-list">
          <li onClick={() => navigate("/")}>About</li>
          <li onClick={() => navigate("/booking-online-station")}>Booking Online Station</li>
          <li className="menu-active">Blog</li>
          <li onClick={() => navigate("/payment")}>Payment</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          <li onClick={() => navigate("/premium")}>Premium</li>
          <li onClick={() => navigate("/business")}>Business</li>
        </ul>
      </nav>    
    )
}
export default MenuBar;