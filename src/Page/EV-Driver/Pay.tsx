import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Pay.css";

const STORAGE_KEY = "viTraSau";

type Transaction = {
  id: string;
  date: string;
  month: string;
  station: string;
  address?: string;
  port?: string;
  power?: string;
  code?: string;
  durationMinutes?: number;
  kwh?: number;
  amount: number;
  paid: boolean;
};

type ViTraSauData = {
  currentMonth: number;
  transactions: Transaction[];
};

const loadViTraSau = (): ViTraSauData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { currentMonth: 0, transactions: [] };
    const parsed = JSON.parse(raw) as ViTraSauData;
    return {
      currentMonth: typeof parsed.currentMonth === "number" ? parsed.currentMonth : 0,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch (e) {
    console.error("loadViTraSau error", e);
    return { currentMonth: 0, transactions: [] };
  }
};

const saveViTraSau = (data: ViTraSauData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const getMonthStr = (isoDate: string) => {
  const d = new Date(isoDate);
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  return `${m.toString().padStart(2, "0")}/${y}`;
};

const Pay: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    totalCost = 0,
    stationName = "",
    address = "",
    port = "",
    power = "",
    code = "",
    durationMinutes = 0,
    kwh = 0,
    startTime,
    endTime,
  } = (location.state as any) || {};

  const handleConfirm = () => {
    // Tạo transaction
    const nowIso = new Date().toISOString();
    const tx: Transaction = {
      id: `txn_${Date.now()}`,
      date: nowIso,
      month: getMonthStr(nowIso),
      station: stationName || "Trạm Sạc",
      address,
      port,
      power,
      code,
      durationMinutes,
      kwh,
      amount: Number(totalCost || 0),
      paid: false,
    };

    // Lưu vào localStorage
    const data = loadViTraSau();
    data.transactions = data.transactions || [];
    data.transactions.push(tx);
    data.currentMonth = (data.currentMonth || 0) + tx.amount;
    saveViTraSau(data);

    alert("💰 Đã thêm giao dịch vào Ví Trả Sau (chưa thanh toán).");

    // Điều hướng về Booking Online Station
    navigate("/booking-online-station");
  };

  return (
    <div className="pay-container">
      <div className="pay-card">
        <h1>Thanh Toán Hóa Đơn</h1>
        <p className="desc">Vui lòng xác nhận phương thức thanh toán của bạn</p>

        <div className="method-box">
          <h3>Phương thức thanh toán</h3>
          <div className="method-item selected">
            <span>💳 Ví Trả Sau</span>
          </div>
        </div>

        <div className="session-details" style={{ textAlign: "left", width: "100%", marginTop: 12 }}>
          <p><strong>Trạm:</strong> {stationName}</p>
          <p><strong>Địa chỉ:</strong> {address}</p>
          <p><strong>Mã sạc:</strong> {code}</p>
          <p><strong>Thời gian:</strong> {durationMinutes} phút</p>
          <p><strong>Năng lượng:</strong> {kwh} kWh</p>
          <p><strong>Bắt đầu:</strong> {startTime ? new Date(startTime).toLocaleString() : "-"}</p>
          <p><strong>Kết thúc:</strong> {endTime ? new Date(endTime).toLocaleString() : "-"}</p>
        </div>

        <div className="total-box">
          <p>Tổng số tiền cần ghi vào Ví Trả Sau (nợ tháng này):</p>
          <h2>{Number(totalCost || 0).toLocaleString()} đ</h2>
        </div>

        <button className="confirm-btn" onClick={handleConfirm}>
          Xác Nhận
        </button>
      </div>
    </div>
  );
};

export default Pay;
