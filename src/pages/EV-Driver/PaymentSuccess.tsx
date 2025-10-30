import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import "../../css/Payment.css";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body" style={{ textAlign: "center" }}>
        <h1 className="page-title" style={{ color: "#00C851" }}>
          ✅ Thanh Toán Thành Công!
        </h1>
        <p className="page-description">
          Cảm ơn bạn đã đăng ký <b>Gói Premium</b>. Tài khoản của bạn đã được
          nâng cấp và kích hoạt đặc quyền hội viên.
        </p>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Quay lại Trang chủ
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
