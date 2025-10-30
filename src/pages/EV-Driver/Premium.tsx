import React from "react";
import "../../css/Premium.css";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";

const Premium: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="member-container">
      <Header />
      <MenuBar />

      {/* ===== BODY ===== */}
      <main className="member-body">
        <h1 className="member-title">
          Trải Nghiệm Đặc Quyền - Nâng Tầm Hội Viên <br /> Chọn Gói Phù Hợp Cho Bạn
        </h1>

        <div className="member-cards">
          {/* Gói Premium */}
          <div className="member-card">
            <h3>Gói Premium</h3>
            <p className="price">299.000 VND / tháng</p>
            <ul className="benefits">
              <li>⚡ Truy cập không giới hạn vào toàn bộ hệ thống trạm sạc</li>
              <li>⭐ Hỗ trợ ưu tiên 24/7 và hotline riêng cho hội viên</li>
              <li>🚗 Nhận thông báo sớm về trạm sạc trống và khuyến mãi</li>
              <li>🎁 Ưu đãi đặc biệt từ các đối tác độc quyền</li>
              <li>💡 Tự động lưu lịch sử giao dịch và vị trí trạm yêu thích</li>
            </ul>
            <button
              className="buy-btn"
              onClick={() => navigate("/premium/plan-premium")}
            >
              Mua Ngay
            </button>
          </div>

          {/* Gói Business */}
          <div className="member-card">
            <h3>Tài Khoản Doanh Nghiệp</h3>
            <p className="price">Liên hệ để được tư vấn</p>
            <ul className="benefits">
              <li>🏢 Quản lý nhiều phương tiện và tài khoản nhân viên</li>
              <li>📊 Theo dõi hiệu suất sử dụng sạc chi tiết theo thời gian thực</li>
              <li>🧾 Báo cáo tổng hợp doanh thu và giao dịch định kỳ</li>
              <li>
                💰 Tổng hợp thanh toán của khách hàng và chuyển doanh thu định kỳ
              </li>
              <li>🔒 Ưu tiên hỗ trợ kỹ thuật và bảo mật nâng cao</li>
            </ul>
            <button
              className="buy-btn"
              onClick={() => navigate("/premium/plan-business")}
            >
              Nâng Cấp Ngay
            </button>
          </div>
        </div>

        <p className="note">
          *Chi tiết quyền lợi và điều khoản sử dụng được cập nhật trong mục thông tin chi tiết của từng gói.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default Premium;
