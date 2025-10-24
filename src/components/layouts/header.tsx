import { FaPhoneAlt } from "react-icons/fa";
import Notification from "../../Customhooks/Notification";
import ProfileUser from "../../Customhooks/ProfileUser";

const Header = () => {
  return (
    <header className="header">
        <div className="header-left">
          <span className="slogan">Optimising your journey, Powering your life</span>
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
  )
}
export default Header;