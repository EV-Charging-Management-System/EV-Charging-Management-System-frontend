import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../css/ProfileStaff.css";
import staffImg from "../assets/Staff.jpg";

interface UserData {
  userId: number;
  email: string;
  role: string;
}

const ProfileStaff: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    }
  }, []);

  const toggleMenu = () => setOpenMenu(!openMenu);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Xử lý logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      alert("Đăng xuất thành công!");
      navigate("/login");
      setOpenMenu(false);
    } catch (err) {
      console.error(err);
      alert("Logout thất bại!");
    }
  };

  return (
    <div className="profile-staff" ref={menuRef} style={{ position: "relative" }}>
      <img
        src={staffImg}
        alt="Staff Avatar"
        className="profile-avatar"
        onClick={toggleMenu}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          border: "2px solid white",
        }}
      />

      {openMenu && (
        <div
          className="profile-dropdown"
          style={{
            position: "absolute",
            right: 0,
            marginTop: "10px",
            background: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(6px)",
            color: "white",
            borderRadius: "12px",
            width: "230px",
            padding: "16px",
            zIndex: 100,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            className="profile-header"
            style={{ textAlign: "center", marginBottom: "10px" }}
          >
            <img
              src={staffImg}
              alt="Avatar"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                border: "2px solid #4ade80",
                marginBottom: "6px",
              }}
            />
            <h4 style={{ fontSize: "16px", marginBottom: "2px" }}>
              {user ? user.email.split("@")[0] : "Đang tải..."}
            </h4>
            <p style={{ fontSize: "13px", color: "#9ca3af" }}>
              Staff ID: {user?.userId ?? "—"}
            </p>
            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              {user?.role === "STAFF" && "EV Staff"}
            </p>
          </div>

          <div
            className="profile-menu"
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <button className="profile-item">Thông tin cá nhân</button>
            <button className="profile-item">Cài đặt tài khoản</button>
            <hr
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                margin: "8px 0",
              }}
            />
            <button
              className="profile-item logout"
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStaff;
