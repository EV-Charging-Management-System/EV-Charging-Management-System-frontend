import React, { useState } from "react";
import "./HomePage.css"; // dùng chung CSS

const ProfileUser: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-container">
      {/* Nút tròn account */}
      <img
        src="/account.jpg"
        alt="Account"
        className="account-avatar"
        onClick={() => setOpen(!open)}
      />

      {/* Bảng thông tin user */}
      {open && (
        <div className="profile-dropdown">
          <img src="/account.jpg" alt="Account" className="account-avatar" />   
          <h3 className="profile-name">Jos Nguyễn</h3>
          <p className="profile-id">ID: SE182928</p>

          <div className="profile-menu">
            <button>Thông tin cá nhân</button>
            <button>Mật Khẩu và Bảo Mật</button>
            <button>Ví Trả Sau</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileUser;
