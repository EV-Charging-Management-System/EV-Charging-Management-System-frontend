import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { invoiceService } from '../../../services/invoiceService';
import type { InvoiceData } from './types';

const API_BASE = "http://localhost:5000";

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  useEffect(() => {
    const stateAny = location.state as any;
    const stateInvoice = stateAny?.invoice as Partial<InvoiceData> | undefined;
    const stateCost = stateAny?.cost as number | undefined;

    // Nếu có invoice từ state
    if (stateInvoice) {
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

    // Nếu có sessionId từ query
    const sid = query.get("sessionId");
    if (sid) {
      (async () => {
        try {
          const created = await invoiceService.getInvoiceBySessionId(Number(sid));
          
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

    // Load lịch sử hóa đơn
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) { 
          navigate("/login"); 
          return; 
        }

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
      const res = await fetch(`${API_BASE}/api/payment/${invoice.invoiceId}/pay`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Lỗi thanh toán");

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

  return {
    invoice,
    invoices,
    paid,
    loading,
    error,
    handlePayment,
  };
};
