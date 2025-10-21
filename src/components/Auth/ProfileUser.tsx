import React, { useState } from "react"; 
import "./HomePage.css"; // dùng chung CSS
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth'

const ProfileUser: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  // ✅ Xử lý logout qua AuthContext để đảm bảo state được xoá và điều hướng
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      // AuthContext will navigate to /login and clear localStorage
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert('Logout thất bại!')
    }
  }

  return (
    <div className="profile-container" style={{ position: "relative" }}>
      <img
        src="/account.jpg"
        alt="Account"
        className="account-avatar"
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
              src="/account.jpg"
              alt="Account"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                margin: "0 auto 8px",
                border: "2px solid #4ade80",
              }}
            />
            <h3 className="profile-name">Jos Nguyễn</h3>
            <p className="profile-id">ID: SE182928</p>
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

            <hr style={{ borderColor: "rgba(255,255,255,0.2)", margin: "8px 0" }} />

            <button
              className="profile-btn logout-btn"
              onClick={handleLogout} // dùng service logout
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUser;
