import React, { useState, useEffect } from "react";
import "../css/HomePage.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import accountImg from "../assets/account.jpg";

interface UserData {
  userId: number;
  email: string;
  role: string;
}

const ProfileUser: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    }
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      alert("Đăng xuất thành công!");
      navigate("/login");
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Logout thất bại!");
    }
  };

  return (
    <div className="profile-container" style={{ position: "relative" }}>
      <img
        src={accountImg}
        alt="Account"
        onClick={() => setOpen(!open)}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          border: "2px solid white",
        }}
      />

      {open && (
        <div
          className="profile-dropdown"
          style={{
            position: "absolute",
            right: 0,
            marginTop: "10px",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(6px)",
            color: "white",
            borderRadius: "12px",
            width: "220px",
            padding: "16px",
            zIndex: 100,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={accountImg}
              alt="Account"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                margin: "0 auto 8px",
                border: "2px solid #4ade80",
              }}
            />
            <h3 className="profile-name">
              {user ? user.email.split("@")[0] : "Đang tải..."}
            </h3>
            <p className="profile-id">ID: {user?.userId ?? "—"}</p>
            <p
              className="profile-role"
              style={{ fontSize: "12px", color: "#9ca3af" }}
            >
              {user?.role === "EVDRIVER" && "EV Driver"}
            </p>
          </div>

          <div
            className="profile-menu"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "10px",
            }}
          >
            <button className="profile-btn">Thông tin cá nhân</button>
            <button className="profile-btn">Mật khẩu & Bảo mật</button>
            <button
              className="profile-btn"
              onClick={() => handleNavigate("/vi-tra-sau")}
            >
              Ví Trả Sau
            </button>

            <hr
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                margin: "8px 0",
              }}
            />

            <button
              className="profile-btn logout-btn"
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

export default ProfileUser;
