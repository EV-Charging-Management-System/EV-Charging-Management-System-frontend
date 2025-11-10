import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import { premiumService } from "../../services/premiumService";
import bookingService from "../../services/bookingService";
import paymentService from "../../services/paymentService";
import "../../css/Payment.css";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRun = useRef(false);

  const [membership, setMembership] = useState<any>(null);
  const [txnRef, setTxnRef] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<"booking" | "invoice" | "premium" | null>(null);

  // 🧾 Lấy thông tin từ URL VNPay trả về
  const params = new URLSearchParams(location.search);
  const vnp_TxnRef = params.get("vnp_TxnRef");
  const vnp_Amount = params.get("vnp_Amount");
  const code = params.get("code");
  const txnRefParam = params.get("txnRef");
  const amount = vnp_Amount ? Number(vnp_Amount) / 100 : null;

  // ✅ Gọi API kiểm tra gói Premium hiện tại
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await premiumService.getCurrentSubscription();
        console.log("[PaymentSuccess] Membership:", res);

        if (res?.success && res.data) {
          const m = res.data;
          // ✅ Map lại key để đảm bảo hiển thị đúng
          setMembership({
            id: m.SubscriptionId || m.PackageId || m.id,
            startDate: m.StartDate || m.start_date || m.startDate,
            endDate: m.ExpireDate || m.EndDate || m.end_date || m.endDate,
            status: m.Status || m.status || "ACTIVE",
          });
        } else {
          console.warn("⚠️ Không có dữ liệu membership từ API!");
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin Premium:", error);
      }
    };
    fetchMembership();
  }, []);

  // ✅ Xử lý sau khi thanh toán thành công
  useEffect(() => {
    const handleAfterPayment = async () => {
      const codeParam = params.get("code");
      const txnRefValue = params.get("txnRef");
      setTxnRef(txnRefValue);

      console.log("🔁 [PaymentSuccess] VNPay callback:", codeParam, txnRefValue);

      // 🧩 Ngăn việc chạy effect nhiều lần
      if (hasRun.current) {
        console.log("⚠️ Payment đã được xử lý, bỏ qua lần gọi lại.");
        return;
      }
      hasRun.current = true;

      // Kiểm tra thanh toán có thành công không
      if (codeParam !== "00") {
        console.warn("⚠️ Thanh toán thất bại hoặc bị hủy.");
        navigate("/payment-fail");
        return;
      }

      // 🔍 Xác định loại thanh toán: Booking hay Invoice
      const savedBookingPayload = localStorage.getItem("bookingPayload");
      const savedInvoiceId = localStorage.getItem("payingInvoiceId");

      if (savedInvoiceId) {
        // ✅ XỬ LÝ THANH TOÁN INVOICE
        setPaymentType("invoice");
        console.log("📄 [PaymentSuccess] Processing invoice payment:", savedInvoiceId);

        try {
          const invoiceId = parseInt(savedInvoiceId);
          const result = await paymentService.payInvoice(invoiceId);

          if (result?.success) {
            console.log("✅ [PaymentSuccess] Invoice paid successfully!");
            localStorage.removeItem("payingInvoiceId");
            
            // Tự động chuyển về trang payment sau 3 giây
            setTimeout(() => {
              navigate("/payment");
            }, 3000);
          } else {
            throw new Error(result?.message || "Thanh toán thất bại");
          }
        } catch (error) {
          console.error("❌ [PaymentSuccess] Lỗi khi thanh toán invoice:", error);
          alert("Thanh toán thành công ");
          navigate("/payment-fail");
        }
      } else if (savedBookingPayload) {
        // ✅ XỬ LÝ TẠO BOOKING
        setPaymentType("booking");
        console.log("📦 [PaymentSuccess] Processing booking payment");

        const payload = JSON.parse(savedBookingPayload);
        console.log("📦 [PaymentSuccess] Payload booking:", payload);

        try {
          const res = await bookingService.createBooking(payload);
          console.log("✅ [PaymentSuccess] API booking response:", res);

          if (res?.success) {
            localStorage.removeItem("bookingPayload");
            console.log("🎉 Booking created successfully!");
          } else {
            alert("⚠️ Thanh toán thành công nhưng tạo booking thất bại!....");
            navigate("/payment-fail");
          }
        } catch (error) {
          console.error("❌ [PaymentSuccess] Lỗi khi gọi createBooking:", error);
          alert("Không thể tạo booking. Vui lòng thử lại sau!");
          navigate("/payment-fail");
        }
      } else {
        // ✅ THANH TOÁN PREMIUM
        setPaymentType("premium");
        console.log("💎 [PaymentSuccess] Premium payment detected");
      }
    };

    handleAfterPayment();
  }, [navigate, params]);

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body text-center fade-in">
        <h1 className="page-title success-title">✅ Thanh Toán Thành Công!</h1>

        {/* 🔹 Thông báo theo loại thanh toán */}
        {paymentType === "invoice" && (
          <div className="success-message">
            <p>🎉 Hóa đơn của bạn đã được thanh toán thành công!</p>
            <p>Bạn sẽ được chuyển về trang quản lý hóa đơn sau 3 giây...</p>
          </div>
        )}

        {paymentType === "booking" && (
          <div className="success-message">
            <p>🎉 Đặt lịch của bạn đã được xác nhận!</p>
          </div>
        )}

        {paymentType === "premium" && (
          <div className="success-message">
            <p>🎉 Gói Premium của bạn đã được kích hoạt!</p>
          </div>
        )}

        {/* 🔹 Thông tin giao dịch */}
        {(txnRef || vnp_TxnRef) && (
          <div className="txn-box mt-4 p-3 border rounded text-center">
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

        {/* 🔹 Thông tin hội viên (chỉ hiện với Premium) */}
        {paymentType === "premium" && membership && (
          <div className="membership-box">
            <h3>🎫 Thông tin hội viên của bạn</h3>
            <p>
              <b>Mã gói:</b> #{membership.id}
            </p>
            <p>
              <b>Ngày bắt đầu:</b> {membership.startDate || "—"}
            </p>
            <p>
              <b>Ngày hết hạn:</b> {membership.endDate || "—"}
            </p>
            <p>
              <b>Trạng thái:</b> {membership.status || "—"}
            </p>
          </div>
        )}

        {/* 🔹 Nút hành động */}
        <div className="action-group">
          {paymentType === "invoice" && (
            <button className="confirm-btn" onClick={() => navigate("/payment")}>
              Quay về trang hóa đơn
            </button>
          )}
          {paymentType === "booking" && (
            <button className="confirm-btn" onClick={() => navigate("/charging-schedule")}>
              Xem lịch đặt
            </button>
          )}
          {paymentType === "premium" && (
            <button className="confirm-btn" onClick={() => navigate("/premium")}>
              Xem gói Premium
            </button>
          )}
          <button className="back-btn" onClick={() => navigate("/customer/dashboard")}>
            Về trang chủ
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
