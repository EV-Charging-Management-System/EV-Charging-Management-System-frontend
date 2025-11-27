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
        setErrors({ email: res.message || "Login failed!" });
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setErrors({ email: err.message || "Cannot login!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">🔋 Login to EV System</h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* 🔗 Link to register */}
        <p className="switch-link">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-400 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
