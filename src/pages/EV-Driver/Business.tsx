import React, { useEffect, useState } from "react";
import "../../css/Business.css";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import MenuBar from "../layouts/menu-bar";
import { authService } from "../../services/authService";
import { businessService } from "../../services/businessService";
import VehicleManager from "../../components/VehicleManager";
import { toast } from "react-toastify";

const Business: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vehicles" | "sessions" | "overview">("vehicles");

  // 🔹 Lấy thông tin user hiện tại
  useEffect(() => {
    (async () => {
      try {
        const profile = await authService.getProfile();
        const u = profile?.user || profile?.data || profile;
        setUser(u);
      } catch (err) {
        console.error("❌ Không thể tải thông tin người dùng:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Hàm gửi yêu cầu nâng cấp Business
  const handleUpgrade = async () => {
    try {
      const res = await businessService.requestUpgrade(user?.userId);
      if (res.success) {
        toast.success("🎯 Đã gửi yêu cầu nâng cấp tài khoản doanh nghiệp. Vui lòng chờ admin duyệt.");
      } else {
        toast.error(res.message || "Không thể gửi yêu cầu hợp tác.");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi yêu cầu doanh nghiệp:", err);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  if (loading) return <div className="loading-text">Đang tải...</div>;

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body fade-in">
        {(user?.RoleName || user?.role) === "BUSINESS" ? (
          // ✅ Nếu user là doanh nghiệp
          <div className="business-dashboard">
            <h1 className="page-title">👔 Trang Doanh Nghiệp</h1>
            <p className="page-description">
              Xin chào, <b>{user?.FullName || user?.UserName}</b>! Quản lý doanh nghiệp của bạn tại đây.
            </p>

            {/* === TAB MENU === */}
            <div className="business-tabs">
              <button
                className={`tab-btn ${activeTab === "vehicles" ? "active" : ""}`}
                onClick={() => setActiveTab("vehicles")}
              >
                🚗 Quản lý xe
              </button>
              <button
                className={`tab-btn ${activeTab === "sessions" ? "active" : ""}`}
                onClick={() => setActiveTab("sessions")}
              >
                ⚡ Lịch sử sạc
              </button>
              <button
                className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                💰 Doanh thu & thống kê
              </button>
            </div>

            {/* === TAB CONTENT === */}
            <div className="tab-content">
              {activeTab === "vehicles" && <VehicleManager companyId={user?.CompanyId} />}

              {activeTab === "sessions" && (
                <div className="business-section">
                  <h3>⚡ Lịch Sử Sạc Của Doanh Nghiệp</h3>
                  <p>Chức năng này sẽ hiển thị toàn bộ lịch sử sạc của các xe thuộc công ty bạn.</p>
                  <p className="coming-soon">🚧 Đang phát triển backend API `/api/business/sessions/:companyId`</p>
                </div>
              )}

              {activeTab === "overview" && (
                <div className="business-section">
                  <h3>📈 Báo Cáo Tổng Quan Doanh Nghiệp</h3>
                  <p>Thống kê tổng số xe, phiên sạc, lượng điện tiêu thụ và tổng doanh thu của công ty.</p>
                  <p className="coming-soon">🚧 Đang phát triển backend API `/api/business/overview/:companyId`</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // 🚀 Nếu user là EVDriver hoặc chưa nâng cấp
          <div className="business-card text-center">
            <h1 className="page-title">Hợp Tác Kinh Doanh</h1>
            <p className="page-description">
              Mở rộng hệ thống trạm sạc của bạn cùng chúng tôi – giải pháp năng lượng xanh cho tương lai.
            </p>

            <div className="business-content">
              <h3>🎯 Trở thành đối tác doanh nghiệp EV</h3>
              <p>
                Với tài khoản doanh nghiệp, bạn có thể quản lý nhiều trạm sạc, phương tiện và nhân viên,
                nhận báo cáo doanh thu định kỳ cùng nhiều đặc quyền khác.
              </p>

              <button className="btn-premium" onClick={handleUpgrade}>
                Gửi Yêu Cầu Nâng Cấp
              </button>

              <button className="btn-back" onClick={() => navigate("/premium")}>
                ← Quay lại
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Business;
