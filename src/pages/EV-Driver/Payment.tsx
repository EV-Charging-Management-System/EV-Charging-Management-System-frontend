import React, { useEffect, useState } from "react";
import "../../css/Payment.css";
import { CreditCard, FileText, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";
import paymentService, { type Invoice } from "../../services/paymentService";

const Payment: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingInvoiceId, setPayingInvoiceId] = useState<number | null>(null);

  // ✅ Lấy danh sách Invoice khi component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getInvoices();
      setInvoices(data);
    } catch (err: any) {
      console.error("[Payment] Lỗi tải invoice:", err);
      setError(err.message || "Không thể tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Xử lý thanh toán Invoice với VNPay
  const handlePayInvoice = async (invoice: Invoice) => {
    if (!invoice || payingInvoiceId) return;

    setPayingInvoiceId(invoice.InvoiceId);

    try {
      // Tạo URL thanh toán VNPay
      const vnpayRes = await paymentService.createVnpayInvoice({
        invoiceId: invoice.InvoiceId,
        orderInfo: `Thanh toán hóa đơn #${invoice.InvoiceId}`,
      });

      if (vnpayRes?.success && vnpayRes?.data?.url) {
        // Lưu thông tin để xử lý sau khi thanh toán thành công
        localStorage.setItem("payingInvoiceId", invoice.InvoiceId.toString());

        // Chuyển hướng đến VNPay
        console.log("🔄 Redirecting to VNPay:", vnpayRes.data.url);
        window.location.href = vnpayRes.data.url;
      } else {
        throw new Error("Không nhận được URL thanh toán từ VNPay");
      }
    } catch (err: any) {
      console.error("[Payment] Lỗi thanh toán:", err);
      alert(`❌ ${err.message || "Không thể thanh toán hóa đơn"}`);
      setPayingInvoiceId(null);
    }
  };

  // ✅ Format số tiền
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // ✅ Format ngày
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // ✅ Icon trạng thái
  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return <CheckCircle size={20} color="#00ff88" />;
      case "PENDING":
        return <Clock size={20} color="#ffaa00" />;
      default:
        return <XCircle size={20} color="#ff6b6b" />;
    }
  };

  // ✅ Badge trạng thái
  const getStatusBadge = (status: string) => {
    const statusUpper = status.toUpperCase();
    const colors = {
      PAID: "status-paid",
      PENDING: "status-pending",
      FAILED: "status-failed",
    };
    return colors[statusUpper as keyof typeof colors] || "status-pending";
  };

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="payment-body">
        <div className="invoice-header">
          <h1 className="page-title">
            <FileText size={36} style={{ marginRight: "10px", verticalAlign: "middle" }} />
            Danh Sách Hóa Đơn
          </h1>
          <p className="page-description">
            Quản lý và thanh toán các hóa đơn sạc xe của bạn bằng VNPay một cách dễ dàng và an toàn.
          </p>
        </div>

        {/* ===== DANH SÁCH HÓA ĐƠN ===== */}
        {loading ? (
          <div className="loading-container">
            <Loader2 className="spinner" size={50} />
            <p>Đang tải hóa đơn...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <XCircle size={50} color="#ff6b6b" />
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchInvoices}>
              Thử lại
            </button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="empty-container">
            <FileText size={60} color="#00ffcc" opacity={0.3} />
            <p>Bạn chưa có hóa đơn nào</p>
          </div>
        ) : (
          <div className="invoice-grid">
            {invoices.map((invoice) => (
              <div key={invoice.InvoiceId} className="invoice-card">
                <div className="invoice-header-info">
                  <div>
                    <h3 className="invoice-id">Hóa đơn #{invoice.InvoiceId}</h3>
                    <p className="invoice-date">
                      Ngày tạo: {formatDate(invoice.CreatedAt)}
                    </p>
                  </div>
                  <div className={`status-badge ${getStatusBadge(invoice.PaidStatus)}`}>
                    {getStatusIcon(invoice.PaidStatus)}
                    <span>{invoice.PaidStatus}</span>
                  </div>
                </div>

                <div className="invoice-details">
                  <div className="detail-row">
                    <span>Mã phiên:</span>
                    <strong>#{invoice.SessionId}</strong>
                  </div>
                  {invoice.CompanyId && (
                    <div className="detail-row">
                      <span>Công ty:</span>
                      <strong>#{invoice.CompanyId}</strong>
                    </div>
                  )}
                  <div className="detail-row">
                    <span>Tháng/Năm:</span>
                    <strong>{invoice.MonthYear || "—"}</strong>
                  </div>
                  <div className="detail-row amount-row">
                    <span>Tổng tiền:</span>
                    <strong className="amount">{formatAmount(invoice.TotalAmount)}</strong>
                  </div>
                </div>

                {invoice.PaidStatus.toUpperCase() === "PENDING" && (
                  <button
                    className="pay-btn"
                    onClick={() => handlePayInvoice(invoice)}
                    disabled={payingInvoiceId === invoice.InvoiceId}
                  >
                    {payingInvoiceId === invoice.InvoiceId ? (
                      <>
                        <Loader2 className="spinner" size={18} />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Thanh toán ngay
                      </>
                    )}
                  </button>
                )}

                {invoice.PaidStatus.toUpperCase() === "PAID" && (
                  <div className="paid-badge">
                    <CheckCircle size={18} />
                    Đã thanh toán
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
