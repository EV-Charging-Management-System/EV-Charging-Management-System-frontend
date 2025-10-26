import { FaPhoneAlt } from "react-icons/fa";
import Notification from "../../components/Notification";
import ProfileUser from "../../components/ProfileUser";
import "../../css/Header.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Đăng xuất thất bại!");
    }
  };

  return (
    <header className="header">
      {/* --- Bên trái: slogan --- */}
      <div className="header-left">
        <span className="slogan">
          Optimising your journey, Powering your life
        </span>
      </div>

      {/* --- Giữa: hotline --- */}
      <div className="header-center">
        <FaPhoneAlt className="phone-icon" />
        <span className="hotline-text">Hotline: 0112334567</span>
      </div>

      {/* --- Bên phải: notification + profile hoặc nút login --- */}
      <div className="header-right" style={{ display: "flex", gap: "16px" }}>
        {user ? (
          <>
            <Notification />
            <ProfileUser />
            <button
              onClick={handleLogout}
              className="btn-logout"
              style={{
                background: "#f44",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="btn-login"
            style={{
              background: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
