import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/ViTraSau.css";

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

const STORAGE_KEY = "viTraSau";

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
    console.error("Error parsing viTraSau", e);
    return { currentMonth: 0, transactions: [] };
  }
};

const saveViTraSau = (data: ViTraSauData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const formatMonthLabel = (monthStr: string) => (monthStr ? `Tháng ${monthStr}` : "");

const getCurrentMonthString = (d = new Date()) => {
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  return `${m.toString().padStart(2, "0")}/${y}`;
};

const getPrevMonthString = (d = new Date()) => {
  const dt = new Date(d.getFullYear(), d.getMonth() - 1, 1);
  const m = dt.getMonth() + 1;
  const y = dt.getFullYear();
  return `${m.toString().padStart(2, "0")}/${y}`;
};

const ViTraSau: React.FC = () => {
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = React.useState<number>(0);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [showInvoices, setShowInvoices] = React.useState<boolean>(false);

  React.useEffect(() => {
    const data = loadViTraSau();
    setCurrentMonth(data.currentMonth || 0);
    const sorted = [...(data.transactions || [])].sort((a, b) => (a.date < b.date ? 1 : -1));
    setTransactions(sorted);
  }, []);

  const currentMonthKey = getCurrentMonthString();
  const prevMonthKey = getPrevMonthString();

  const paidByMonth = transactions.reduce<Record<string, number>>((acc, t) => {
    if (t.paid) acc[t.month] = (acc[t.month] || 0) + t.amount;
    return acc;
  }, {});

  const lastMonthAmount = paidByMonth[prevMonthKey] || 0;
  const sumPaid = Object.values(paidByMonth).reduce((s, v) => s + v, 0);
  const averagePerMonth = Object.keys(paidByMonth).length > 0 ? Math.round(sumPaid / Object.keys(paidByMonth).length) : 0;
  const totalAll = sumPaid + (currentMonth || 0);

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, t) => {
    acc[t.month] = acc[t.month] || [];
    acc[t.month].push(t);
    return acc;
  }, {});

  const handlePayNow = () => {
    if (!currentMonth || currentMonth <= 0) {
      alert("Không có số dư nào để thanh toán.");
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn thanh toán ${currentMonth.toLocaleString()} đ cho tháng ${currentMonthKey}?`)) return;

    const data = loadViTraSau();
    data.transactions = data.transactions.map(t => t.month === currentMonthKey && !t.paid ? { ...t, paid: true } : t);
    data.currentMonth = 0;
    saveViTraSau(data);
    setCurrentMonth(0);
    setTransactions([...data.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)));
    alert("💳 Thanh toán thành công!");
  };

  return (
    <div className="vi-tra-sau-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Quay lại</button>

      <div className="vi-tra-sau-card">
        <div className="vi-tra-sau-info">
          <h2>Xin chào!</h2>
          <p>Chào mừng bạn đến với dịch vụ <b>Ví Trả Sau</b> – quản lý chi tiết các phiên sạc và thanh toán. Tại đây bạn có thể theo dõi số dư hiện tại, các giao dịch đã thanh toán, chưa thanh toán và tổng quan chi tiêu của mình một cách tiện lợi và trực quan.</p>
          <p>Thanh toán sẽ thực hiện vào <b>ngày 30 hàng tháng</b>. Xem lịch sử giao dịch bằng cách nhấn nút bên dưới.</p>
        </div>

        <div className="vi-tra-sau-wallet">
          <h3>Số dư tháng này</h3>
          <h1 className="wallet-amount">{(currentMonth || 0).toLocaleString()} VND</h1>

          <div className="summary-grid">
            <div className="summary-item">
              <span>Giao Dịch Tháng Này</span>
              <strong>{(currentMonth || 0).toLocaleString()} đ</strong>
            </div>
            <div className="summary-item">
              <span>Tháng trước ({formatMonthLabel(prevMonthKey)})</span>
              <strong>{lastMonthAmount.toLocaleString()} đ</strong>
            </div>
            <div className="summary-item">
              <span>Trung bình mỗi tháng</span>
              <strong>{averagePerMonth.toLocaleString()} đ</strong>
            </div>
          </div>

          <div className="total-box">
            <span>Tổng cộng: </span>
            <strong>{totalAll.toLocaleString()} đ</strong>
          </div>

          <button className="pay-btn" onClick={handlePayNow}>Thanh toán ngay</button>

          <button
            className="pay-btn"
            style={{background: "#4db6ac"}}
            onClick={() => setShowInvoices(!showInvoices)}
          >
            {showInvoices ? "Ẩn hóa đơn" : "Xem chi tiết"}
          </button>

          {showInvoices && (
            <div className="invoice-section">
              <h4>Hóa Đơn & Lịch Sử Giao Dịch</h4>
              {transactions.length === 0 ? (
                <div className="no-transactions">Hiện chưa có giao dịch. Lịch sử trước đây sẽ hiển thị tại đây.</div>
              ) : (
                Object.keys(grouped).sort((a,b)=> (a<b?1:-1)).map(monthKey => (
                  <div key={monthKey} className="month-group">
                    <div className="month-header" style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
                      <div>{formatMonthLabel(monthKey)}</div>
                      <div>Tổng: {grouped[monthKey].reduce((s,t)=>s+t.amount,0).toLocaleString()} đ</div>
                    </div>
                    <table className="transactions-table">
                      <thead>
                        <tr>
                          <th>Ngày giờ</th>
                          <th>Trạm / Địa chỉ</th>
                          <th>Mã</th>
                          <th>Thời gian</th>
                          <th>KWh</th>
                          <th>Số tiền</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grouped[monthKey].map(t => (
                          <tr key={t.id} className={t.paid?"paid":"unpaid"}>
                            <td>{new Date(t.date).toLocaleString()}</td>
                            <td>
                              <div className="station-name">{t.station}</div>
                              <div className="station-address">{t.address}</div>
                            </td>
                            <td>{t.code}</td>
                            <td>{t.durationMinutes ? `${t.durationMinutes} phút`:"-"}</td>
                            <td>{t.kwh ?? "-"} kWh</td>
                            <td>{t.amount.toLocaleString()} đ</td>
                            <td>
                              <span className={t.paid?"status paid-badge":"status unpaid-badge"}>
                                {t.paid ? "Đã thanh toán" : "Chưa thanh toán"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          )}

          <footer className="wallet-footer">
            <p>© 2024 Company Name. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ViTraSau;
