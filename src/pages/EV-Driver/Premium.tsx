import React, { useEffect, useState } from "react";
import "../../css/Premium.css";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import { apiClient } from "../../utils/api";

interface Package {
  PackageId: number;
  PackageName: string;
  PackagePrice: number;
  // Thêm các trường khác nếu cần
}

const Premium: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    apiClient
      .get("/packages")
      .then((res) => setPackages(res.data.data || []))
      .catch((err) => console.error("❌ Lỗi khi lấy packages:", err));
  }, []);

  // Tách từng gói
  const premium1 = packages.find((p) => p.PackageName.includes("1 tháng"));
  const premium3 = packages.find((p) => p.PackageName.includes("3 tháng"));
  const premium6 = packages.find((p) => p.PackageName.includes("6 tháng"));
  const premium12 = packages.find((p) => p.PackageName.includes("12 tháng"));

  // Tách business
  const business = packages.find((p) => p.PackageName.includes("Business"));

  return (
    <div className="member-container">
      <Header />
      <MenuBar />

      <main className="member-body">
        <h1 className="member-title">
          Trải Nghiệm Đặc Quyền - Nâng Tầm Hội Viên  
          <br /> Chọn Gói Phù Hợp Cho Bạn
        </h1>

        {/* ================= PREMIUM LIST ================= */}
        <h2 style={{ marginTop: 30 }}>Các Gói Premium</h2>

        <div className="premium-plan-container">

          {/* CARD 1 THÁNG */}
          {premium1 && (
            <div className="premium-plan-card">
              <h3>Premium 1 tháng</h3>
              <p className="price">{premium1.PackagePrice.toLocaleString()} VND</p>
              <ul className="benefits">
                <li>⚡ Truy cập hệ thống trạm sạc</li>
                <li>⭐ Hỗ trợ ưu tiên 24/7</li>
                <li>🚗 Nhận thông báo sớm</li>
                <li>🎁 Voucher 10.000đ</li>
              </ul>
              <button
                className="buy-btn"
                onClick={() => navigate(`/premium/plan-premium?id=${premium1.PackageId}`)}
              >
                Chọn gói
              </button>
            </div>
          )}

          {/* CARD 3 THÁNG */}
          {premium3 && (
            <div className="premium-plan-card">
              <h3>Premium 3 tháng</h3>
              <p className="price">{premium3.PackagePrice.toLocaleString()} VND</p>
              <ul className="benefits">
                <li>⚡ Toàn bộ quyền lợi Premium</li>
                <li>🎁 Tặng thêm 5% ưu đãi</li>
                <li>💡 Nhắc nhở gia hạn sớm</li>
              </ul>
              <button
                className="buy-btn"
                onClick={() => navigate(`/premium/plan-premium?id=${premium3.PackageId}`)}
              >
                Chọn gói
              </button>
            </div>
          )}

          {/* CARD 6 THÁNG */}
          {premium6 && (
            <div className="premium-plan-card">
              <h3>Premium 6 tháng</h3>
              <p className="price">{premium6.PackagePrice.toLocaleString()} VND</p>
              <ul className="benefits">
                <li>⚡ Quyền lợi đầy đủ</li>
                <li>🎁 Tặng voucher 50.000đ</li>
                <li>💰 Tiết kiệm hơn 10%</li>
              </ul>
              <button
                className="buy-btn"
                onClick={() => navigate(`/premium/plan-premium?id=${premium6.PackageId}`)}
              >
                Chọn gói
              </button>
            </div>
          )}

          {/* CARD 12 THÁNG */}
          {premium12 && (
            <div className="premium-plan-card">
              <h3>Premium 12 tháng</h3>
              <p className="price">{premium12.PackagePrice.toLocaleString()} VND</p>
              <ul className="benefits">
                <li>⚡ Quyền lợi đầy đủ nhất</li>
                <li>💎 Giảm thêm 10% khi gia hạn</li>
                <li>🎉 Có quà tặng sinh nhật</li>
              </ul>
              <button
                className="buy-btn"
                onClick={() => navigate(`/premium/plan-premium?id=${premium12.PackageId}`)}
              >
                Chọn gói
              </button>
            </div>
          )}
        </div>

        {/* ================= BUSINESS ================= */}
        <h2 style={{ marginTop: 50 }}>Gói Business</h2>

        {business && (
          <div className="premium-plan-card">
            <h3>Tài Khoản Doanh Nghiệp</h3>
            <ul className="benefits">
              <li>🏢 Quản lý nhiều phương tiện</li>
              <li>📊 Báo cáo doanh thu</li>
              <li>💼 Thanh toán theo chu kỳ</li>
              <li>🔒 Hỗ trợ kỹ thuật ưu tiên</li>
            </ul>

            <button
              className="buy-btn"
              onClick={() => navigate("/premium/plan-business")}
            >
              Nâng cấp ngay
            </button>
          </div>
        )}

        <p className="note">*Chọn gói để xem quyền lợi chi tiết.</p>
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
