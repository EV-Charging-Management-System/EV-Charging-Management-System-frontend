import { FaPhoneAlt } from "react-icons/fa";
import Notification from "../../components/Notification";
import ProfileUser from "../../components/ProfileUser";
import "../../css/Header.css";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import React, { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogin = () => {
    navigate("/login");
  };

  // Register modal state & form
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    Email: "",
    PasswordHash: "",
    ConfirmPassword: "",
    FullName: "",
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  const openRegister = () => setShowRegister(true);
  const closeRegister = () => setShowRegister(false);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((s) => ({ ...s, [name]: value }));
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.PasswordHash !== registerForm.ConfirmPassword) {
      alert("Mật khẩu và Xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setRegisterLoading(true);
      // Only send the fields requested by backend
      const payload = {
        Email: registerForm.Email,
        PasswordHash: registerForm.PasswordHash,
        ConfirmPassword: registerForm.ConfirmPassword,
        FullName: registerForm.FullName,
        // Ensure this registration is for an EV driver / User role on the backend
        role: 'EVDRIVER',
      };
      const res = await authService.register(payload as any);
      // res is ApiResponse<RegisterResponse>
      const success = !!res?.success;
      const msg = res?.message || res?.data?.message || (success ? 'Register successful' : 'Register failed');
      alert(msg);
      if (success) {
        closeRegister();
        navigate("/login");
      }
    } catch (err: any) {
      const m = err?.response?.data?.message || err?.message || "Đăng ký thất bại";
      alert(m);
    }
    finally {
      setRegisterLoading(false);
    }
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
        <div className="header-right" style={{ display: "flex", gap: "12px", alignItems: 'center' }}>
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
          <>
            <button onClick={openRegister} className="header-btn btn-register" aria-label="register">
              Register
            </button>

            <button onClick={handleLogin} className="header-btn btn-login" aria-label="login">
              Login
            </button>
          </>
        )}
        {/* Register Modal */}
        {showRegister && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>Register account</h3>
              <p>For EV drivers (user)</p>
              <form onSubmit={submitRegister}>
                <label>Email</label>
                <input name="Email" type="email" value={registerForm.Email} onChange={handleRegisterChange} required />

                <label>Họ và tên</label>
                <input name="FullName" type="text" value={registerForm.FullName} onChange={handleRegisterChange} required />

                <label>Mật khẩu</label>
                <input name="PasswordHash" type="password" value={registerForm.PasswordHash} onChange={handleRegisterChange} required />

                <label>Xác nhận mật khẩu</label>
                <input name="ConfirmPassword" type="password" value={registerForm.ConfirmPassword} onChange={handleRegisterChange} required />

                <div className="modal-actions">
                  <button type="button" onClick={closeRegister} className="modal-cancel">Cancel</button>
                  <button type="submit" className="modal-submit">Register</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
