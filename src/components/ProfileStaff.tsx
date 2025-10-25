import React, { useState, useRef, useEffect } from "react";
import "../css/ProfileStaff.css";

const ProfileStaff: React.FC = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="profile-staff" ref={menuRef}>
      <img
        src="../assets//Staff.jpg"
        alt="Staff Avatar"
        className="profile-avatar"
        onClick={toggleMenu}
      />

      {openMenu && (
        <div className="profile-dropdown">
          <div className="profile-header">
            <img src="/Staff.jpg" alt="Avatar" />
            <div>
              <h4>Jos Nguyễn</h4>
              <p>Staff ID: ST2353</p>
            </div>
          </div>

          <button className="profile-item">Thông tin cá nhân</button>
          <button className="profile-item">Cài đặt tài khoản</button>
          <button className="profile-item logout">Đăng xuất</button>
        </div>
      )}
    </div>
  );
};

export default ProfileStaff;
