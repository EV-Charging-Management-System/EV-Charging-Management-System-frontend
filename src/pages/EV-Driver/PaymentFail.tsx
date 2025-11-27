import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import "../../css/Payment.css";

const PaymentFail: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("❌ [PaymentFail] VNPay code:", params.get("vnp_ResponseCode"));
  }, []);

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body text-center fade-in">
        <h1 className="page-title fail-title">❌ Payment Failed</h1>

        <p>
          Your transaction was unsuccessful or has been canceled.  
          <br />
          Please try again later or contact support if the issue continues.
        </p>

        <div className="action-group">
          <button className="confirm-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>

          <button className="back-btn" onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentFail;
