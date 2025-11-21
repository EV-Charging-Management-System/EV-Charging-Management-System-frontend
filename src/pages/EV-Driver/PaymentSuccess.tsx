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

type PaymentType =
  | "booking"
  | "invoice"
  | "business-invoice"
  | "premium"
  | null;

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
  const amount = vnp_Amount ? Number(vnp_Amount) : null;

  // ===== Helper =====
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
        console.error("❌ Error fetching membership:", error);
      }
    };
    fetchMembership();
  }, []);

  // ===== Handle EVDRIVER Invoice =====
  const handleInvoicePayment = async (invoiceId: string) => {
    setPaymentType("invoice");

    try {
      await paymentService.payInvoice(parseInt(invoiceId));
    } catch (error: any) {
      console.warn("⚠️ Invoice may already be paid:", error);
    } finally {
      cleanupLocalStorage("payingInvoiceId", "paymentType");
      redirectWithDelay("/payment");
    }
  };

  // ===== Handle BUSINESS Invoice =====
  const handleBusinessInvoicePayment = async (invoiceId: string) => {
    setPaymentType("business-invoice");

    try {
      await paymentService.payInvoice(parseInt(invoiceId));
    } catch (error: any) {
      console.warn("⚠️ Business invoice may already be paid:", error);
    } finally {
      cleanupLocalStorage("payingInvoiceId", "paymentType");
      redirectWithDelay("/business/invoices");
    }
  };

  // ===== Handle Booking =====
  const handleBookingCreation = async (bookingPayload: string) => {
    setPaymentType("booking");

    try {
      const payload = JSON.parse(bookingPayload);
      const res = await bookingService.createBooking(payload);

      if (res?.success) {
        cleanupLocalStorage("bookingPayload", "paymentType");
      } else {
        throw new Error("Booking failed");
      }
    } catch (error) {
      alert("Không thể tạo booking. Vui lòng thử lại!");
      navigate("/payment-fail");
    }
  };

  // ===== Handle Premium =====
  const handlePremiumActivation = async () => {
    setPaymentType("premium");

    try {
      const membershipRes = await premiumService.getCurrentSubscription();
      if (membershipRes?.success && membershipRes.data) {
        const m = membershipRes.data;
        setMembership({
          id: m.SubscriptionId || m.PackageId || m.id,
          startDate: m.StartDate || m.startDate,
          endDate: m.ExpireDate || m.endDate,
          status: m.Status || "ACTIVE",
        });
      }
    } finally {
      cleanupLocalStorage("paymentType");
    }
  };

  // ===== Main Handler =====
  useEffect(() => {
    const handlePaymentCallback = async () => {
      const codeParam = params.get("code");
      const txnRefValue = params.get("txnRef");
      const urlPaymentType = params.get("type");

      setTxnRef(txnRefValue);

      if (hasRun.current) return;
      hasRun.current = true;

      if (codeParam !== "00") {
        navigate("/payment-fail");
        return;
      }

      const savedPaymentType = localStorage.getItem("paymentType");
      const paymentTypeToUse = savedPaymentType || urlPaymentType;

      switch (paymentTypeToUse) {
        case "invoice": {
          const id = localStorage.getItem("payingInvoiceId");
          if (!id) return navigate("/payment-fail");
          await handleInvoicePayment(id);
          break;
        }

        case "business-invoice": {
          const id = localStorage.getItem("payingInvoiceId");
          if (!id) return navigate("/payment-fail");
          await handleBusinessInvoicePayment(id);
          break;
        }

        case "booking": {
          const payload = localStorage.getItem("bookingPayload");
          if (!payload) return navigate("/payment-fail");
          await handleBookingCreation(payload);
          break;
        }

        case "premium": {
          await handlePremiumActivation();
          break;
        }

        default: {
          await handlePremiumActivation();
          break;
        }
      }
    };

    handlePaymentCallback();
  }, [navigate, params]);

  // ===== RENDER =====
  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="page-body text-center fade-in">
        <h1 className="page-title success-title">✅ Thanh Toán Thành Công!</h1>

        {paymentType === "invoice" && (
          <div className="success-message">
            <p>🎉 Hóa đơn của bạn đã được thanh toán!</p>
            <p>Chờ 3 giây để quay về trang hóa đơn...</p>
          </div>
        )}

        {paymentType === "business-invoice" && (
          <div className="success-message">
            <p>🎉 Hóa đơn doanh nghiệp đã được thanh toán!</p>
            <p>Chờ 3 giây để quay về trang hóa đơn doanh nghiệp...</p>
          </div>
        )}

        {paymentType === "booking" && (
          <div className="success-message">
            <p>🎉 Đặt lịch đã được xác nhận!</p>
          </div>
        )}

        {paymentType === "premium" && (
          <div className="success-message">
            <p>🎉 Gói Premium đã được kích hoạt!</p>
          </div>
        )}

        {(txnRef || vnp_TxnRef) && (
          <div className="txn-box mt-4 p-3 border rounded text-center">
            <p>
              <b>Mã giao dịch:</b> {txnRef || vnp_TxnRef}
            </p>
            {amount && (
              <p>
                <b>Số tiền:</b> {amount.toLocaleString()} VND
              </p>
            )}
          </div>
        )}

        {paymentType === "premium" && membership && (
          <div className="membership-box">
            <h3>🎫 Thông tin hội viên</h3>
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

        <Row className="justify-content-center mt-4">
          <Col xs="auto">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {paymentType === "invoice" && (
                <Button variant="success" onClick={() => navigate("/payment")}>
                  🧾 Quay về hóa đơn
                </Button>
              )}

              {paymentType === "business-invoice" && (
                <Button
                  variant="success"
                  onClick={() => navigate("/business/invoices")}
                >
                  🧾 Về hóa đơn doanh nghiệp
                </Button>
              )}

              {paymentType === "booking" && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/charging-schedule")}
                >
                  📅 Xem lịch đặt
                </Button>
              )}

              {paymentType === "premium" && (
                <Button variant="warning" onClick={() => navigate("/premium")}>
                  💎 Xem gói Premium
                </Button>
              )}

              <Button
                variant="outline-secondary"
                onClick={() => navigate("/customer/dashboard")}
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
