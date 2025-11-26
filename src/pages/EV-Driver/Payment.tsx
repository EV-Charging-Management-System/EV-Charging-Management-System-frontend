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

  // ✅ Fetch invoice list on mount
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
      console.error("[Payment] Error loading invoices:", err);
      setError(err.message || "Unable to load invoices");
    } finally {
      setLoading(false);
    }
  };

  // ✅ VNPay invoice payment handler
  const handlePayInvoice = async (invoice: Invoice) => {
    if (!invoice || payingInvoiceId) return;

    setPayingInvoiceId(invoice.InvoiceId);

    try {
      const vnpayRes = await paymentService.createVnpayInvoice({
        invoiceId: invoice.InvoiceId,
        orderInfo: `Payment for invoice #${invoice.InvoiceId}`,
      });

      if (vnpayRes?.success && vnpayRes?.data?.url) {
        localStorage.setItem("payingInvoiceId", invoice.InvoiceId.toString());
        localStorage.setItem("paymentType", "invoice");

        console.log("🔄 Redirecting to VNPay:", vnpayRes.data.url);
        window.location.href = vnpayRes.data.url;
      } else {
        throw new Error("No payment URL received from VNPay");
      }
    } catch (err: any) {
      console.error("[Payment] Payment error:", err);
      alert(`❌ ${err.message || "Unable to proceed with payment"}`);
      setPayingInvoiceId(null);
    }
  };

  // ✅ Format amount
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // ✅ Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // ✅ Status icon
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

  // ✅ Status badge
  const getStatusBadge = (status: string) => {
    const upper = status.toUpperCase();
    const colors = {
      PAID: "status-paid",
      PENDING: "status-pending",
      FAILED: "status-failed",
    };
    return colors[upper as keyof typeof colors] || "status-pending";
  };

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="payment-body">
        <div className="invoice-header">
          <h1 className="page-title">
            <FileText size={36} style={{ marginRight: "10px", verticalAlign: "middle" }} />
            Invoice List
          </h1>
          <p className="page-description">
            Easily and securely manage and pay your EV charging invoices via VNPay.
          </p>
        </div>

        {/* ===== INVOICE LIST ===== */}
        {loading ? (
          <div className="loading-container">
            <Loader2 className="spinner" size={50} />
            <p>Loading invoices...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <XCircle size={50} color="#ff6b6b" />
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchInvoices}>
              Retry
            </button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="empty-container">
            <FileText size={60} color="#00ffcc" opacity={0.3} />
            <p>You have no invoices yet</p>
          </div>
        ) : (
          <div className="invoice-grid">
            {invoices.map((invoice) => (
              <div key={invoice.InvoiceId} className="invoice-card">
                <div className="invoice-header-info">
                  <div>
                    <h3 className="invoice-id">Invoice #{invoice.InvoiceId}</h3>
                    <p className="invoice-date">
                      Created: {formatDate(invoice.CreatedAt)}
                    </p>
                  </div>
                  <div className={`status-badge ${getStatusBadge(invoice.PaidStatus)}`}>
                    {getStatusIcon(invoice.PaidStatus)}
                    <span>{invoice.PaidStatus}</span>
                  </div>
                </div>

                <div className="invoice-details">
                  <div className="detail-row">
                    <span>Session ID:</span>
                    <strong>#{invoice.SessionId}</strong>
                  </div>

                  {invoice.CompanyId && (
                    <div className="detail-row">
                      <span>Company:</span>
                      <strong>#{invoice.CompanyId}</strong>
                    </div>
                  )}

                  <div className="detail-row">
                    <span>Month/Year:</span>
                    <strong>{invoice.MonthYear || "—"}</strong>
                  </div>

                  <div className="detail-row amount-row">
                    <span>Total Amount:</span>
                    <strong className="amount">{formatAmount(invoice.TotalAmount)}</strong>
                  </div>
                </div>

                {/* PAYMENT BUTTON */}
                {invoice.PaidStatus.toUpperCase() === "PENDING" && (
                  <button
                    className="pay-btn"
                    onClick={() => handlePayInvoice(invoice)}
                    disabled={payingInvoiceId === invoice.InvoiceId}
                  >
                    {payingInvoiceId === invoice.InvoiceId ? (
                      <>
                        <Loader2 className="spinner" size={18} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        Pay Now
                      </>
                    )}
                  </button>
                )}

                {/* PAID BADGE */}
                {invoice.PaidStatus.toUpperCase() === "PAID" && (
                  <div className="paid-badge">
                    <CheckCircle size={18} />
                    Paid
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
