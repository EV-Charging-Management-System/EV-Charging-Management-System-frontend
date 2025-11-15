import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { loginSchema } from "../../utils/validationSchemas";
import "../../css/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate using Yup schema
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false });
    } catch (err: any) {
      const validationErrors: any = {};
      err.inner.forEach((error: any) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      console.log("🔍 Login response:", res);

      if (res.success && res.user) {
        const role = (res.user.role || "").toUpperCase();
        console.log("✅ Detected role:", role);

        if (role === "ADMIN") navigate("/admin");
        else if (role === "STAFF") navigate("/staff");
        else if (role === "BUSINESS") navigate("/business");
        else navigate("/");
      } else {
        setErrors({ email: res.message || "Đăng nhập thất bại!" });
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setErrors({ email: err.message || "Không thể đăng nhập!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">🔋 Đăng nhập hệ thống EV</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* 🔗 Link chuyển sang đăng ký */}
        <p className="switch-link">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
