import React, { useEffect, useMemo, useState } from "react";
import "../../css/Invoice.css";
import ProfileStaff from "../../components/ProfileStaff";
import { useNavigate, useLocation } from "react-router-dom";
import StaffSideBar from "../../pages/layouts/staffSidebar";
import { invoiceService } from "../../services/invoiceService";

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
  invoiceId?: number;
  sessionId: number;
  sessionPrice?: number;
  penaltyFee?: number;
  totalAmount?: number;
  cost: number; // Tổng tiền hiển thị (fallback từ totalAmount hoặc cost)
  customer?: string;
  startTime?: string;
  endTime?: string;
  stationName?: string;
  chargerName?: string;
  power?: string;
  batteryStart?: number;
  batteryEnd?: number;
  paid?: boolean;
  PaidStatus?: string;
  createdAt?: string;
}

const API_BASE = "http://localhost:5000";

const Invoice: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null); // Hóa đơn mới cần thanh toán
  const [invoices, setInvoices] = useState<InvoiceData[]>([]); // Lịch sử hóa đơn
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // ------------------- Load hóa đơn -------------------
  useEffect(() => {
    // Ưu tiên nhận dữ liệu truyền từ navigate state
    const stateAny = location.state as any;
    const stateInvoice = stateAny?.invoice as Partial<InvoiceData> | undefined;
    const stateSession = stateAny?.session as Session | undefined;
    const stateCost = stateAny?.cost as number | undefined;

    if (stateInvoice) {
      // Đã có hóa đơn được tạo sẵn → hiển thị ngay
      console.log("📋 Received invoice from state:", stateInvoice);
      console.log("📋 Raw data from state:", stateAny?.raw);
      
      // Ưu tiên lấy từ raw data nếu có
      const rawData = stateAny?.raw;
      
      setInvoice({
        invoiceId: rawData?.invoiceId ?? stateInvoice.invoiceId,
        sessionId: Number(stateInvoice.sessionId),
        sessionPrice: rawData?.sessionPrice ?? stateInvoice.sessionPrice ?? 0,
        penaltyFee: rawData?.penaltyFee ?? stateInvoice.penaltyFee ?? 0,
        totalAmount: rawData?.totalAmount ?? stateInvoice.totalAmount ?? stateInvoice.cost ?? 0,
        cost: Number(stateInvoice.cost ?? rawData?.totalAmount ?? 0),
        customer: stateInvoice.customer,
        startTime: stateInvoice.startTime,
        endTime: stateInvoice.endTime ?? new Date().toLocaleTimeString("vi-VN"),
        stationName: stateInvoice.stationName,
        chargerName: stateInvoice.chargerName,
        power: stateInvoice.power,
        batteryStart: stateInvoice.batteryStart,
        batteryEnd: stateInvoice.batteryEnd ?? 100,
        paid: !!stateInvoice.paid || String(rawData?.PaidStatus).toUpperCase() === "PAID",
        PaidStatus: rawData?.PaidStatus ?? stateInvoice.PaidStatus,
        createdAt: rawData?.createdAt,
      });
      setInvoices([]);
      return;
    }

    if (stateSession && stateCost !== undefined) {
      // Trường hợp cũ: truyền session + cost
      setInvoice({
        sessionId: stateSession.SessionId,
        customer: stateSession.LicensePlate ?? undefined,
        startTime: stateSession.date,
        endTime: new Date().toLocaleTimeString("vi-VN"),
        cost: stateCost,
        stationName: stateSession.StationName,
        chargerName: stateSession.chargerName,
        power: stateSession.power,
        batteryStart: stateSession.BatteryPercentage,
        batteryEnd: 100,
        paid: false,
      });
      setInvoices([]);
      return;
    }

    // Nếu có query sessionId → fetch invoice theo sessionId (luồng guest fallback)
    const sid = query.get("sessionId");
    if (sid) {
      (async () => {
        try {
          const created = await invoiceService.getInvoiceBySessionId(Number(sid));
          console.log("📋 Fetched invoice by sessionId:", created);
          
          setInvoice({
            invoiceId: created?.invoiceId,
            sessionId: created?.sessionId ?? created?.SessionId ?? Number(sid),
            sessionPrice: created?.sessionPrice ?? 0,
            penaltyFee: created?.penaltyFee ?? 0,
            totalAmount: created?.totalAmount ?? 0,
            cost: Number(created?.totalAmount ?? created?.amount ?? created?.sessionPrice ?? 0),
            paid: String(created?.PaidStatus || created?.status || "PENDING").toUpperCase() === "PAID",
            PaidStatus: created?.PaidStatus,
            createdAt: created?.createdAt,
          });
          setInvoices([]);
        } catch (err: any) {
          setError(err?.message || "Không thể tải hóa đơn");
        }
      })();
      return;
    }

    // Không có dữ liệu → hiển thị lịch sử hóa đơn
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
  }, [location.state, navigate, query]);

  // ------------------- Thanh toán -------------------
  const handlePayment = async () => {
    if (!invoice) {
      alert("Không có thông tin hóa đơn");
      return;
    }

    if (!invoice.invoiceId) {
      setError("Không có mã hóa đơn để thanh toán");
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
      console.log(`💳 Calling payment API: /api/payment/${invoice.invoiceId}/pay`);

      const res = await fetch(`${API_BASE}/api/payment/${invoice.invoiceId}/pay`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      console.log("📊 Payment API response:", data);

      if (!res.ok) throw new Error(data.message || "Lỗi thanh toán");

      // ✅ Cập nhật trạng thái thanh toán
      setInvoice(prev => prev ? { ...prev, paid: true, PaidStatus: "PAID" } : null);
      setPaid(true);
      alert("✅ Thanh toán thành công!");
    } catch (err: any) {
      console.error("❌ Payment error:", err);
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
                  {invoice.invoiceId && (
                    <p><strong>🧾 Mã hóa đơn:</strong> #{invoice.invoiceId}</p>
                  )}
                  <p><strong>📱 Phiên sạc:</strong> #{invoice.sessionId}</p>
                  
                  {invoice.stationName && (
                    <p><strong>📍 Trạm:</strong> {invoice.stationName}</p>
                  )}
                  
                  {invoice.chargerName && (
                    <p><strong>⚡ Cổng sạc:</strong> {invoice.chargerName} {invoice.power && `(${invoice.power})`}</p>
                  )}
                  
                  {invoice.customer && (
                    <p><strong>🚗 Xe/Khách hàng:</strong> {invoice.customer}</p>
                  )}
                  
                  {invoice.startTime && (
                    <p><strong>🕐 Bắt đầu:</strong> {invoice.startTime}</p>
                  )}
                  
                  {invoice.endTime && (
                    <p><strong>🕐 Kết thúc:</strong> {invoice.endTime}</p>
                  )}
                  
                  {invoice.createdAt && (
                    <p><strong>📅 Ngày tạo HĐ:</strong> {new Date(invoice.createdAt).toLocaleString("vi-VN")}</p>
                  )}
                  
                  {invoice.PaidStatus && (
                    <p><strong>📊 Trạng thái:</strong> 
                      <span style={{ 
                        color: invoice.PaidStatus.toUpperCase() === "PAID" ? "#7cffb2" : "#ff9800",
                        fontWeight: "bold",
                        marginLeft: "8px"
                      }}>
                        {invoice.PaidStatus.toUpperCase() === "PAID" ? "✅ Đã thanh toán" : "⏳ Chưa thanh toán"}
                      </span>
                    </p>
                  )}
                </div>

                {!paid ? (
                  <>
                    <h3 className="choose-method-title">Xác nhận thanh toán</h3>
                    {error && <p className="error">{error}</p>}
                    <button onClick={handlePayment} disabled={loading} className="pay-btn">
                      {loading ? "Đang xử lý..." : "💰 Thanh toán"}
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
