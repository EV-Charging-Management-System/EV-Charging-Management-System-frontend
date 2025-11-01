import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import "../../css/Payment.css";
import bookingService from "../../services/bookingService";



const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false); // 🧩 Dùng ref để chặn lặp effect thật sự
  const [txnRef, setTxnRef] = useState<string | null>(null); // ✅ Add state for txnRef 

  useEffect(() => {
    const handleBookingAfterPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code") ;
      const txnRef = params.get("txnRef");

      setTxnRef(txnRef); 
      console.log("🔁 [PaymentSuccess] VNPay callback:", code, txnRef);

      // 🧩 Chỉ chạy đúng 1 lần thực sự
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
        } catch (error: any) {
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
      <main className="page-body text-center">
        <h1 className="page-title success-title">✅ Thanh Toán Thành Công!</h1>
        <h3>Mã giao dịch: {txnRef}</h3>
        <p className="page-description">
          Giao dịch đã được xác nhận. Đơn đặt lịch sạc của bạn đang được xử lý
          và lưu vào hệ thống.
        </p>
        <div className="action-group">
          <button
            className="confirm-btn"
            onClick={() => navigate("/booking-history")}
          >
            Xem lịch sử đặt sạc
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
