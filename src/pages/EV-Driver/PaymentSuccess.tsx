import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import { premiumService } from "../../services/premiumService";
import "../../css/Payment.css";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [membership, setMembership] = useState<any>(null);

  // Lấy param từ URL (vnpay trả về)
  const params = new URLSearchParams(location.search);
  const txnRef = params.get("vnp_TxnRef");
  const amount = params.get("vnp_Amount")
    ? Number(params.get("vnp_Amount")) / 100
    : null;

  // Gọi API kiểm tra gói hiện tại (xác nhận đã được cập nhật Premium)
  useEffect(() => {
    const fetchMembership = async () => {
      const res = await premiumService.getCurrentSubscription();
      console.log("[PaymentSuccess] Membership:", res);
      if (res?.success) setMembership(res.data);
    };
    fetchMembership();
  }, []);

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body text-center fade-in">
        <h1 className="page-title success-title">✅ Thanh Toán Thành Công!</h1>

        <p className="page-description">
          Cảm ơn bạn đã đăng ký <b>Gói Premium</b>. 
          <br />
          Tài khoản của bạn đã được nâng cấp và kích hoạt đặc quyền hội viên.
        </p>

        {/* Thông tin giao dịch */}
        {txnRef && (
          <div className="txn-box">
            <p>
              <b>Mã giao dịch:</b> {txnRef}
            </p>
            {amount && (
              <p>
                <b>Số tiền:</b>{" "}
                {amount.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            )}
          </div>
        )}

        {/* Thông tin gói hội viên */}
        {membership && (
          <div className="membership-box">
            <h3>🎫 Thông tin hội viên của bạn</h3>
            <p><b>Mã gói:</b> #{membership.id}</p>
            <p><b>Ngày bắt đầu:</b> {membership.startDate}</p>
            <p><b>Ngày hết hạn:</b> {membership.endDate}</p>
            <p><b>Trạng thái:</b> {membership.status}</p>
          </div>
        )}

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

export default PaymentSuccess;
