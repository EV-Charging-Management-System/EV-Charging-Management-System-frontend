import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import { premiumService } from "../../services/premiumService";
import bookingService from "../../services/bookingService";
import "../../css/Payment.css";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRun = useRef(false);

  const [membership, setMembership] = useState<any>(null);
  const [txnRef, setTxnRef] = useState<string | null>(null);

  // 🧾 Lấy thông tin từ URL VNPay trả về
  const params = new URLSearchParams(location.search);
  const vnp_TxnRef = params.get("vnp_TxnRef");
  const vnp_Amount = params.get("vnp_Amount");
  const amount = vnp_Amount ? Number(vnp_Amount) / 100 : null;

  // ✅ Gọi API kiểm tra gói Premium hiện tại
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await premiumService.getCurrentSubscription();
        console.log("[PaymentSuccess] Membership:", res);
        if (res?.success) setMembership(res.data);
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin Premium:", error);
      }
    };
    fetchMembership();
  }, []);

  // ✅ Xử lý booking sau khi thanh toán thành công
  useEffect(() => {
    const handleBookingAfterPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const txnRefParam = params.get("txnRef");
      setTxnRef(txnRefParam);

      console.log("🔁 [PaymentSuccess] VNPay callback:", code, txnRefParam);

      // 🧩 Ngăn việc chạy effect nhiều lần
      if (hasRun.current) {
        console.log("⚠️ Booking đã được xử lý, bỏ qua lần gọi lại.");
        return;
      }
      hasRun.current = true;

      const savedPayload = localStorage.getItem("bookingPayload");
      if (!savedPayload) {
        console.warn("⚠️ Không tìm thấy bookingPayload trong localStorage!");
        return;
      }

      const payload = JSON.parse(savedPayload);
      console.log("📦 [PaymentSuccess] Payload booking:", payload);

      if (code === "00") {
        try {
          const res = await bookingService.createBooking(payload);
          console.log("✅ [PaymentSuccess] API booking response:", res);

          if (res?.success) {
            localStorage.removeItem("bookingPayload");
            console.log("🎉 Booking created successfully!");
          } else {
            alert("⚠️ Thanh toán thành công nhưng tạo booking thất bại!");
            navigate("/payment-fail");
          }
        } catch (error) {
          console.error("❌ [PaymentSuccess] Lỗi khi gọi createBooking:", error);
          alert("Không thể tạo booking. Vui lòng thử lại sau!");
          navigate("/payment-fail");
        }
      } else {
        console.warn("⚠️ Thanh toán thất bại hoặc bị hủy.");
        navigate("/payment-fail");
      }
    };

    handleBookingAfterPayment();
  }, [navigate]);

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body text-center fade-in">
        <h1 className="page-title success-title">✅ Thanh Toán Thành Công!</h1>
        <h3>Mã giao dịch: {txnRef || vnp_TxnRef}</h3>

        <p className="page-description">
          Cảm ơn bạn đã đăng ký <b>Gói Premium</b>.<br />
          Giao dịch đã được xác nhận. Đơn đặt lịch sạc của bạn đang được xử lý
          và lưu vào hệ thống.
        </p>

        {/* 🔹 Thông tin giao dịch */}
        {(txnRef || vnp_TxnRef) && (
          <div className="txn-box">
            <p>
              <b>Mã giao dịch:</b> {txnRef || vnp_TxnRef}
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

        {/* 🔹 Thông tin hội viên */}
        {membership && (
          <div className="membership-box">
            <h3>🎫 Thông tin hội viên của bạn</h3>
            <p>
              <b>Mã gói:</b> #{membership.id}
            </p>
            <p>
              <b>Ngày bắt đầu:</b> {membership.startDate}
            </p>
            <p>
              <b>Ngày hết hạn:</b> {membership.endDate}
            </p>
            <p>
              <b>Trạng thái:</b> {membership.status}
            </p>
          </div>
        )}

        {/* 🔹 Nút hành động */}
        <div className="action-group">
          <button className="confirm-btn" onClick={() => navigate("/premium")}>
            Quay lại Gói Premium
          </button>
          <button
            className="confirm-btn"
            onClick={() => navigate("/booking-history")}
          >
            Xem lịch sử đặt sạc
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
