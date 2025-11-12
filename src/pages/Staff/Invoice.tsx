import React, { useEffect, useState } from "react";
import "../../css/Invoice.css";
import ProfileStaff from "../../components/ProfileStaff";
import { useNavigate, useSearchParams } from "react-router-dom";
import StaffSideBar from "../../pages/layouts/staffSidebar";

interface InvoiceData {
  invoiceId: number;
  sessionId: number;
  totalAmount: number;
  paidStatus: string;
  paymentMethod: string;
  createdAt: string;
}

const API_BASE = "http://localhost:5000";

const Invoice: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  // ------------------- Load hóa đơn -------------------
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return navigate("/login");

        if (!sessionId) {
          setError("Không có sessionId để tải hóa đơn");
          setLoading(false);
          return;
        }

        console.log(`🧾 Fetching invoice for guest sessionId=${sessionId}`);
        const res = await fetch(`${API_BASE}/api/charging-session/${sessionId}/invoice-staff`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}), // guest không cần userId
        });

        const data = await res.json();
        console.log("📦 Invoice API response:", data);

        if (!res.ok) throw new Error(data.message || "Không tìm thấy hóa đơn");

        // ✅ Map dữ liệu trả về đúng field từ backend
        setInvoice({
          invoiceId: data.data.invoiceId || data.data.InvoiceId,
          sessionId: data.data.sessionId || data.data.SessionId,
          totalAmount: data.data.totalAmount || data.data.TotalAmount,
          paidStatus: data.data.paidStatus || data.data.PaidStatus,
          paymentMethod: data.data.paymentMethod || data.data.PaymentMethod || "CASH",
          createdAt: data.data.createdAt || data.data.CreatedAt,
        });
      } catch (err: any) {
        console.error("❌ Lỗi tải hóa đơn:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchInvoice();
  }, [sessionId, navigate]);

  // ------------------- Giao diện -------------------
  return (
    <div className="charging-wrapper">
      <StaffSideBar />

      <div className="charging-main-wrapper fade-in">
        <header className="charging-header">
          <h1>Hóa đơn sạc xe</h1>
          <div className="charging-header-actions">
            <ProfileStaff />
          </div>
        </header>

        <main className="invoice-body">
          <div className="invoice-container">
            {loading ? (
              <p>⏳ Đang tải hóa đơn...</p>
            ) : error ? (
              <p className="error">⚠️ {error}</p>
            ) : invoice ? (
              <>
                <h2>🧾 Hóa đơn phiên sạc #{invoice.sessionId}</h2>
                <div className="invoice-box">
                  <p><strong>Mã hóa đơn:</strong> #{invoice.invoiceId}</p>
                  <p><strong>Phương thức thanh toán:</strong> {invoice.paymentMethod}</p>
                  <p><strong>Tổng tiền:</strong> <span className="price-text">{invoice.totalAmount.toLocaleString()}đ</span></p>
                  <p><strong>Trạng thái:</strong> {invoice.paidStatus === "PAID" ? "✅ Đã thanh toán" : "💰 Chưa thanh toán"}</p>
                  <p><strong>Ngày tạo:</strong> {new Date(invoice.createdAt).toLocaleString("vi-VN")}</p>
                </div>

                <button
                  onClick={() => navigate("/staff/charging-process")}
                  className="pay-btn"
                >
                  ← Quay lại trang sạc
                </button>
              </>
            ) : (
              <p>Chưa có hóa đơn nào.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Invoice;
