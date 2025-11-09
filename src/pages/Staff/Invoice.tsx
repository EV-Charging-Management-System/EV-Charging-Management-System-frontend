import React, { useEffect, useState } from "react";
import "../../css/Invoice.css";
import ProfileStaff from "../../components/ProfileStaff";
import { useNavigate, useLocation } from "react-router-dom";
import StaffSideBar from "../../pages/layouts/staffSidebar";

interface Session {
  SessionId: number;
  LicensePlate?: string | null;
  BatteryPercentage?: number;
  StationName?: string;
  chargerName?: string;
  power?: string;
  date?: string;
  time?: string;
  userType?: "guest" | "staff";
}

interface InvoiceData {
  sessionId: number;
  customer?: string;
  startTime?: string;
  endTime?: string;
  cost: number;
  stationName?: string;
  chargerName?: string;
  power?: string;
  batteryStart?: number;
  batteryEnd?: number;
  paid?: boolean; // trạng thái đã thanh toán
}

const API_BASE = "http://localhost:5000";

const Invoice: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null); // Hóa đơn mới cần thanh toán
  const [invoices, setInvoices] = useState<InvoiceData[]>([]); // Lịch sử hóa đơn
  const [paymentMethod, setMethod] = useState<string>("");
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ------------------- Load hóa đơn -------------------
  useEffect(() => {
    const locationState = location.state as { session: Session; cost: number } | undefined;

    if (locationState?.session && locationState.cost !== undefined) {
      // Phiên mới vừa kết thúc → hiển thị thanh toán
      const { session, cost } = locationState;
      setInvoice({
        sessionId: session.SessionId,
        customer: session.LicensePlate ?? undefined,
        startTime: session.date,
        endTime: new Date().toLocaleTimeString("vi-VN"),
        cost,
        stationName: session.StationName,
        chargerName: session.chargerName,
        power: session.power,
        batteryStart: session.BatteryPercentage,
        batteryEnd: 100,
        paid: false,
      });
      setInvoices([]); // Clear danh sách khi có hóa đơn mới
    } else {
      // Không có session mới → fetch toàn bộ lịch sử hóa đơn
      const fetchHistory = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) { navigate("/login"); return; }

          const res = await fetch(`${API_BASE}/api/payment/history`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Lỗi tải lịch sử hóa đơn");
          setInvoices(data || []);
        } catch (err: any) {
          setError(err.message || "Lỗi không xác định");
        }
      };
      fetchHistory();
      setInvoice(null);
    }
  }, [location.state, navigate]);

  // ------------------- Thanh toán -------------------
  const handlePayment = async () => {
    if (!invoice || !paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setLoading(true);
    setError(null);
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("⚠️ Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/payment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sessionId: invoice.sessionId,
          amount: invoice.cost,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi thanh toán");

      setPaid(true);
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

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

            {/* Hóa đơn mới cần thanh toán */}
            {invoice ? (
              <>
                <h2>Hóa đơn phiên sạc #{invoice.sessionId}</h2>
                <div className="invoice-box">
                  <p>Trạm: {invoice.stationName}</p>
                  <p>Charger: {invoice.chargerName} ({invoice.power})</p>
                  <p>Xe/Khách hàng: {invoice.customer}</p>
                  <p>Bắt đầu: {invoice.startTime}</p>
                  <p>Kết thúc: {invoice.endTime}</p>
                  <p>Pin: {invoice.batteryStart}% → {invoice.batteryEnd}%</p>
                  <p>Tổng tiền: <strong className="price-text">{invoice.cost.toLocaleString()}đ</strong></p>
                </div>

                {!paid ? (
                  <>
                    <h3 className="choose-method-title">Chọn phương thức thanh toán</h3>
                    <div className="payment-methods">
                      {["Tiền mặt", "Chuyển khoản", "Business"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setMethod(opt)}
                          className={`pm-btn ${paymentMethod === opt ? "active" : ""}`}
                          disabled={loading}
                        >
                          {opt === "Tiền mặt" ? "💵 Tiền mặt" : opt === "Chuyển khoản" ? "🏦 Chuyển khoản" : "💳 Business"}
                        </button>
                      ))}
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button onClick={handlePayment} disabled={loading || !paymentMethod} className="pay-btn">
                      {loading ? "Đang xử lý..." : "Thanh toán"}
                    </button>
                  </>
                ) : (
                  <p className="paid-text">✅ Đã thanh toán</p>
                )}
              </>
            ) : null}

            {/* Lịch sử hóa đơn */}
            {invoices.length > 0 ? (
              <>
                <h2>Lịch sử hóa đơn</h2>
                {invoices.map(inv => (
                  <div key={inv.sessionId} className="invoice-box">
                    <p>Hóa đơn #{inv.sessionId}</p>
                    <p>Trạm: {inv.stationName}</p>
                    <p>Charger: {inv.chargerName} ({inv.power})</p>
                    <p>Khách: {inv.customer}</p>
                    <p>Bắt đầu: {inv.startTime}</p>
                    <p>Kết thúc: {inv.endTime}</p>
                    <p>Tổng tiền: {inv.cost.toLocaleString()}đ</p>
                    <p>{inv.paid ? "✅ Đã thanh toán" : "💰 Chưa thanh toán"}</p>
                  </div>
                ))}
              </>
            ) : !invoice ? (
              <p>Chưa có hóa đơn nào.</p>
            ) : null}

          </div>
        </main>
      </div>
    </div>
  );
};

export default Invoice;
