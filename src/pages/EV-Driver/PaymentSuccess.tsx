import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import { premiumService } from "../../services/premiumService";
import bookingService from "../../services/bookingService";
import paymentService from "../../services/paymentService";
import "../../css/Payment.css";

type PaymentType = "booking" | "invoice" | "premium" | null;

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRun = useRef(false);

  const [membership, setMembership] = useState<any>(null);
  const [txnRef, setTxnRef] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>(null);

  // Parse URL params
  const params = new URLSearchParams(location.search);
  const vnp_TxnRef = params.get("vnp_TxnRef");
  const vnp_Amount = params.get("vnp_Amount");
  const amount = vnp_Amount ? Number(vnp_Amount)  : null;

  // ===== Helper Functions =====
  const cleanupLocalStorage = (...keys: string[]) => {
    keys.forEach((key) => localStorage.removeItem(key));
  };

  const redirectWithDelay = (path: string, delay: number = 3000) => {
    setTimeout(() => navigate(path), delay);
  };

  // ===== Fetch Premium Membership =====
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await premiumService.getCurrentSubscription();
        console.log("[PaymentSuccess] Membership:", res);

        if (res?.success && res.data) {
          const m = res.data;
          setMembership({
            id: m.SubscriptionId || m.PackageId || m.id,
            startDate: m.StartDate || m.start_date || m.startDate,
            endDate: m.ExpireDate || m.EndDate || m.end_date || m.endDate,
            status: m.Status || m.status || "ACTIVE",
          });
        }
      } catch (error) {
        console.error("❌ [PaymentSuccess] Error fetching membership:", error);
      }
    };
    fetchMembership();
  }, []);

  // ===== Handle Invoice Payment =====
  const handleInvoicePayment = async (invoiceId: string) => {
    setPaymentType("invoice");
    console.log("� [PaymentSuccess] Processing invoice payment:", invoiceId);

    try {
      const result = await paymentService.payInvoice(parseInt(invoiceId));

      if (result?.success) {
        console.log("✅ [PaymentSuccess] Invoice paid successfully!");
      }
    } catch (error: any) {
      console.warn("⚠️ [PaymentSuccess] Invoice payment error (may already be paid):", error);
    } finally {
      cleanupLocalStorage("payingInvoiceId", "paymentType");
      redirectWithDelay("/payment");
    }
  };

  // ===== Handle Booking Creation =====
  const handleBookingCreation = async (bookingPayload: string) => {
    setPaymentType("booking");
    console.log("� [PaymentSuccess] Processing booking payment");

    try {
      const payload = JSON.parse(bookingPayload);
      const res = await bookingService.createBooking(payload);

      if (res?.success) {
        console.log("🎉 [PaymentSuccess] Booking created successfully!");
        cleanupLocalStorage("bookingPayload", "paymentType");
      } else {
        throw new Error("Booking creation failed");
      }
    } catch (error) {
      console.error("❌ [PaymentSuccess] Booking error:", error);
      alert("Không thể tạo booking. Vui lòng thử lại sau!");
      navigate("/payment-fail");
    }
  };

  // ===== Handle Premium Activation =====
  const handlePremiumActivation = async () => {
    setPaymentType("premium");
    console.log("💎 [PaymentSuccess] Processing premium payment");

    try {
      const membershipRes = await premiumService.getCurrentSubscription();

      if (membershipRes?.success && membershipRes.data) {
        console.log("✅ [PaymentSuccess] Premium activated successfully!");
        const m = membershipRes.data;
        setMembership({
          id: m.SubscriptionId || m.PackageId || m.id,
          startDate: m.StartDate || m.start_date || m.startDate,
          endDate: m.ExpireDate || m.EndDate || m.end_date || m.endDate,
          status: m.Status || m.status || "ACTIVE",
        });
      }
    } catch (error) {
      console.error("❌ [PaymentSuccess] Premium activation error:", error);
    } finally {
      cleanupLocalStorage("paymentType");
    }
  };

  // ===== Main Payment Handler =====
  useEffect(() => {
    const handlePaymentCallback = async () => {
      const codeParam = params.get("code");
      const txnRefValue = params.get("txnRef");
      const urlPaymentType = params.get("type");

      setTxnRef(txnRefValue);

      console.log("🔁 [PaymentSuccess] VNPay callback:", {
        code: codeParam,
        txnRef: txnRefValue,
        urlType: urlPaymentType,
      });

      // Prevent duplicate execution
      if (hasRun.current) {
        console.log("⚠️ [PaymentSuccess] Already processed, skipping...");
        return;
      }
      hasRun.current = true;

      // Check payment status
      if (codeParam !== "00") {
        console.warn("⚠️ [PaymentSuccess] Payment failed or cancelled");
        navigate("/payment-fail");
        return;
      }

      // Determine payment type
      const savedPaymentType = localStorage.getItem("paymentType");
      const paymentTypeToUse = savedPaymentType || urlPaymentType;

      console.log("� [PaymentSuccess] Payment type:", paymentTypeToUse);

      // Route to appropriate handler
      switch (paymentTypeToUse) {
        case "invoice": {
          const savedInvoiceId = localStorage.getItem("payingInvoiceId");
          if (!savedInvoiceId) {
            alert("Lỗi: Không tìm thấy thông tin hóa đơn");
            navigate("/payment-fail");
            return;
          }
          await handleInvoicePayment(savedInvoiceId);
          break;
        }

        case "booking": {
          const savedBookingPayload = localStorage.getItem("bookingPayload");
          if (!savedBookingPayload) {
            alert("Lỗi: Không tìm thấy thông tin đặt lịch");
            navigate("/payment-fail");
            return;
          }
          await handleBookingCreation(savedBookingPayload);
          break;
        }

        case "premium": {
          await handlePremiumActivation();
          break;
        }

        default: {
          console.warn("⚠️ [PaymentSuccess] Unknown payment type, treating as premium");
          await handlePremiumActivation();
          break;
        }
      }
    };

    handlePaymentCallback();
  }, [navigate, params]);

  // ===== Render =====
  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body text-center fade-in">
        <h1 className="page-title success-title">✅ Thanh Toán Thành Công!</h1>

        {/* Payment Type Messages */}
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

        {/* Transaction Info */}
        {(txnRef || vnp_TxnRef) && (
          <div className="txn-box mt-4 p-3 border rounded text-center">
            <p>
              <b>Mã giao dịch:</b> {txnRef || vnp_TxnRef}
            </p>
            {amount && (
              <p>
                <b>Số tiền:</b> {amount.toLocaleString()}  VND
              </p>
            )}
          </div>
        )}

        {/* Premium Membership Info */}
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

        {/* Action Buttons */}
        <Row className="justify-content-center mt-4">
          <Col xs="auto">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {paymentType === "invoice" && (
                <Button
                  variant="success"
                  onClick={() => navigate("/payment")}
                  className="fw-bold"
                >
                  🧾 Quay về trang hóa đơn
                </Button>
              )}

              {paymentType === "booking" && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/charging-schedule")}
                  className="fw-bold"
                >
                  📅 Xem lịch đặt
                </Button>
              )}

              {paymentType === "premium" && (
                <Button
                  variant="warning"
                  onClick={() => navigate("/premium")}
                  className="fw-bold text-dark"
                >
                  💎 Xem gói Premium
                </Button>
              )}

              <Button
                variant="outline-secondary"
                onClick={() => navigate("/customer/dashboard")}
                className="fw-bold"
              >
                🏠 Về trang chủ
              </Button>
            </div>
          </Col>
        </Row>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
