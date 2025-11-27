import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import "../../css/ProfileAdmin.css";

interface UserData {
  userId: number;
  email: string;
  role: string;
}

const ProfileAdmin: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMenu = () => setOpenMenu(!openMenu);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.clear();
      alert("Logout successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout failed!");
    }
  };

  return (
    <div className="profile-admin" ref={menuRef}>
      <button
        className="profile-btn"
        onClick={toggleMenu}
      >
        {user?.email?.split("@")[0] || "Admin"} ▾
      </button>

      {openMenu && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <h3>{user?.email || "Admin"}</h3>
            <p>{user?.role || "ADMIN"}</p>
          </div>

          <div className="profile-menu">
            <button className="profile-item">Account Management</button>
            <button className="profile-item">System Settings</button>
            <button className="profile-item logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAdmin;
