import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import "../../css/Payment.css";

const PaymentFail: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body text-center fade-in">
        <h1 className="page-title fail-title">❌ Thanh Toán Thất Bại</h1>

        <p className="page-description">
          Giao dịch của bạn không thành công hoặc đã bị hủy.
          <br />
          Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vẫn gặp lỗi.
        </p>

        <div className="action-group">
          <button className="confirm-btn" onClick={() => navigate("/premium")}>
            Quay lại Gói Premium
          </button>
          <button className="back-btn" onClick={() => navigate("/")}>
            Trang chủ
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentFail;
