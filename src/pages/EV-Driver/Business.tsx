import React, { useState } from "react";
import "../../css/Business.css";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import { authService } from "../../services/authService";
import { businessService } from "../../services/businessService";
import { toast } from "react-toastify";

const Business: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const user = await authService.getProfile();
      if (!user) {
        toast.warn("Vui lòng đăng nhập trước khi gửi yêu cầu!");
        navigate("/login");
        return;
      }

      const res = await businessService.requestUpgrade(user.userId);
      if (res.success) {
        toast.success("🎯 Yêu cầu hợp tác doanh nghiệp đã được gửi! Vui lòng chờ admin duyệt.");
        navigate("/premium");
      } else {
        toast.error(res.message || "Không thể gửi yêu cầu hợp tác.");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi yêu cầu doanh nghiệp:", err);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body">
        <h1 className="page-title">Hợp Tác Kinh Doanh</h1>
        <p className="page-description">
          Mở rộng hệ thống trạm sạc của bạn cùng chúng tôi – giải pháp năng lượng xanh cho tương lai.
        </p>

        <div className="business-card">
          <h3>🎯 Trở thành đối tác doanh nghiệp EV</h3>
          <p>
            Với tài khoản doanh nghiệp, bạn có thể quản lý nhiều trạm sạc, phương tiện và nhân viên, 
            nhận báo cáo doanh thu định kỳ, cùng nhiều đặc quyền khác.
          </p>

          <button
            className="btn-premium"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? "Đang gửi yêu cầu..." : "Gửi Yêu Cầu Nâng Cấp"}
          </button>

          <button className="btn-back" onClick={() => navigate("/premium")}>
            ← Quay lại
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Business;
