import React, { useEffect, useState } from "react";
import "../../css/Business.css";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import MenuBar from "../layouts/menu-bar";
import { authService } from "../../services/authService";
import { businessService } from "../../services/businessService";
import VehicleManager from "../../components/VehicleManager";
import SessionHistory from "../../components/SessionHistory";
import BusinessOverview from "../../components/BusinessOverview";
import { toast } from "react-toastify";

const Business: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🟢 Tab hiện tại
  const [activeTab, setActiveTab] = useState<
    "vehicles" | "sessions" | "overview" | "lookup"
  >("vehicles");

  // 🟢 Tra cứu công ty theo biển số
  const [licenseLookup, setLicenseLookup] = useState("");
  const [lookupResult, setLookupResult] = useState<any>(null);

  // 🔹 Lấy thông tin user hiện tại
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await authService.getProfile();
        const u = profile?.user || profile?.data || profile;
        setUser(u);
        console.log("👤 User profile:", u);
      } catch (err) {
        console.error("❌ Không thể tải thông tin người dùng:", err);
        toast.error("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Lấy thông tin công ty (chỉ dành cho user BUSINESS)
  useEffect(() => {
    const fetchCompany = async () => {
      if (!user) return;
      const role = user.RoleName || user.role;
      if (role !== "BUSINESS") return;

      const id = user.CompanyId || user.UserId || user.userId;
      if (!id) {
        console.warn("⚠️ Không có ID hợp lệ để gọi API overview!");
        return;
      }

      try {
        const res = await businessService.getCompanyOverview(id);
        if (res.success && res.data) {
          setCompany(res.data);
          console.log("🏢 Company data:", res.data);
        } else {
          toast.warn("Không tìm thấy thông tin công ty!");
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải thông tin công ty:", err);
        toast.error("Lỗi khi tải thông tin công ty!");
      }
    };
    fetchCompany();
  }, [user]);

  // 🔍 Tra cứu công ty theo biển số
  const handleLookup = async () => {
    if (!licenseLookup.trim()) {
      toast.warn("⚠️ Vui lòng nhập biển số xe để tra cứu!");
      return;
    }
    try {
      const res = await businessService.lookupCompanyByPlate(
        licenseLookup.trim()
      );
      if (res.success && res.data) {
        setLookupResult(res.data);
        toast.success("✅ Đã tìm thấy công ty!");
      } else {
        setLookupResult(null);
        toast.error(res.message || "Không tìm thấy công ty nào sở hữu xe này!");
      }
    } catch (err) {
      console.error("❌ Lỗi khi tra cứu:", err);
      toast.error("Không thể kết nối đến máy chủ.");
    }
  };

  // 🔹 Gửi yêu cầu nâng cấp Business
  const handleUpgrade = async () => {
    try {
      const res = await businessService.requestUpgrade(
        user?.userId || user?.UserId
      );
      if (res.success) {
        toast.success(
          "🎯 Đã gửi yêu cầu nâng cấp tài khoản doanh nghiệp. Vui lòng chờ admin duyệt."
        );
      } else {
        toast.error(res.message || "Không thể gửi yêu cầu hợp tác.");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi yêu cầu doanh nghiệp:", err);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    }
  };

  if (loading) return <div className="loading-text">Đang tải...</div>;

  // ✅ Nếu là user doanh nghiệp
  if ((user?.RoleName || user?.role) === "BUSINESS") {
    return (
      <div className="page-container">
        <Header />
        <MenuBar />

        <main className="page-body fade-in">
          <div className="business-dashboard">
            <h1 className="page-title">👔 Trang Doanh Nghiệp</h1>
            <p className="page-description">
              Xin chào, <b>{user?.FullName || user?.UserName}</b>! Quản lý doanh
              nghiệp của bạn tại đây.
            </p>

            {/* === TAB MENU === */}
            <div className="business-tabs">
              <button
                className={`tab-btn ${
                  activeTab === "vehicles" ? "active" : ""
                }`}
                onClick={() => setActiveTab("vehicles")}
              >
                🚗 Quản lý xe
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "sessions" ? "active" : ""
                }`}
                onClick={() => setActiveTab("sessions")}
              >
                ⚡ Lịch sử sạc
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                💰 Doanh thu & thống kê
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "lookup" ? "active" : ""
                }`}
                onClick={() => setActiveTab("lookup")}
              >
                🔍 Tra cứu công ty
              </button>
            </div>

            {/* === TAB CONTENT === */}
            <div className="tab-content">
              {activeTab === "vehicles" && (
                <VehicleManager
                  companyId={company?.companyId || user?.CompanyId}
                />
              )}

              {activeTab === "sessions" && (
                <div className="business-section">
                  <h3>⚡ Lịch Sử Sạc Của Doanh Nghiệp</h3>
                  <SessionHistory
                    companyId={company?.companyId || user?.CompanyId}
                  />
                </div>
              )}

              {activeTab === "overview" && (
                <div className="business-section">
                  <BusinessOverview
                    companyId={company?.companyId || user?.CompanyId}
                  />
                </div>
              )}

              {activeTab === "lookup" && (
                <div className="business-section">
                  <h3>🔍 Tra Cứu Công Ty Theo Biển Số Xe</h3>
                  <div className="lookup-form">
                    <input
                      type="text"
                      placeholder="Nhập biển số xe (VD: 51H-123.45)"
                      value={licenseLookup}
                      onChange={(e) =>
                        setLicenseLookup(e.target.value.toUpperCase())
                      }
                    />
                    <button className="btn-premium" onClick={handleLookup}>
                      Tra Cứu
                    </button>
                  </div>

                  {lookupResult && (
                    <div className="lookup-result">
                      <p>
                        <strong>Công ty:</strong>{" "}
                        {lookupResult.CompanyName || "Chưa có"}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong>{" "}
                        {lookupResult.Address || "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {lookupResult.CompanyMail || "N/A"}
                      </p>
                      <p>
                        <strong>Điện thoại:</strong>{" "}
                        {lookupResult.Phone || "N/A"}
                      </p>
                      <p>
                        <strong>Xe:</strong> {lookupResult.VehicleName} (
                        {lookupResult.LicensePlate})
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // 🚀 Nếu user chưa nâng cấp
  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body fade-in">
        <div className="business-card text-center">
          <h1 className="page-title">Hợp Tác Kinh Doanh</h1>
          <p className="page-description">
            Mở rộng hệ thống trạm sạc của bạn cùng chúng tôi – giải pháp năng
            lượng xanh cho tương lai.
          </p>

          <div className="business-content">
            <h3>🎯 Trở thành đối tác doanh nghiệp EV</h3>
            <p>
              Với tài khoản doanh nghiệp, bạn có thể quản lý nhiều trạm sạc,
              phương tiện và nhân viên, nhận báo cáo doanh thu định kỳ cùng
              nhiều đặc quyền khác.
            </p>

            <button className="btn-premium" onClick={handleUpgrade}>
              Gửi Yêu Cầu Nâng Cấp
            </button>

            <button className="btn-back" onClick={() => navigate("/premium")}>
              ← Quay lại
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Business;
