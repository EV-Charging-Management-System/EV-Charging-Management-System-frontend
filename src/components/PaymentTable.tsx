import React, { useState, useEffect } from "react";
import "../css/AdminDashboard.css";

interface Payment {
  PaymentId: number;
  BookingId: number;
  Amount: number;
  Method: string;
  Status: string;
  CreatedAt: string;
  UserName: string;
  StationName: string;
}

const PaymentTable: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selected, setSelected] = useState<Payment | null>(null);

  useEffect(() => {
    // 🎯 Dữ liệu giả lập để hiển thị bảng
    const mockData: Payment[] = [
      {
        PaymentId: 1001,
        BookingId: 501,
        Amount: 250000,
        Method: "VNPAY",
        Status: "PAID",
        CreatedAt: "2025-10-26T09:00:00",
        UserName: "driver01",
        StationName: "Trạm Sạc Trung Tâm",
      },
      {
        PaymentId: 1002,
        BookingId: 502,
        Amount: 180000,
        Method: "MOMO",
        Status: "PENDING",
        CreatedAt: "2025-10-25T14:30:00",
        UserName: "business01",
        StationName: "Trạm Sạc Hà Nội",
      },
      {
        PaymentId: 1003,
        BookingId: 503,
        Amount: 200000,
        Method: "CASH",
        Status: "FAILED",
        CreatedAt: "2025-10-24T10:00:00",
        UserName: "staff01",
        StationName: "Trạm Sạc Bình Dương",
      },
    ];
    setPayments(mockData);
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <section className="data-section">
      <h2>💳 Danh sách hóa đơn</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Booking</th>
            <th>Số tiền (VNĐ)</th>
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.PaymentId}>
              <td>{p.PaymentId}</td>
              <td>{p.BookingId}</td>
              <td className="money">{formatCurrency(p.Amount)}</td>
              <td>{p.Method}</td>
              <td>
                <span
                  className={`status-badge ${
                    p.Status === "PAID"
                      ? "active"
                      : p.Status === "PENDING"
                      ? "warn"
                      : "inactive"
                  }`}
                >
                  {p.Status}
                </span>
              </td>
              <td>{new Date(p.CreatedAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn-detail"
                  onClick={() => setSelected(p)}
                >
                  Xem
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup xem chi tiết */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🧾 Chi tiết hóa đơn</h3>
            <p><b>Mã hóa đơn:</b> {selected.PaymentId}</p>
            <p><b>Người dùng:</b> {selected.UserName}</p>
            <p><b>Trạm sạc:</b> {selected.StationName}</p>
            <p><b>Booking ID:</b> {selected.BookingId}</p>
            <p><b>Phương thức:</b> {selected.Method}</p>
            <p><b>Số tiền:</b> {formatCurrency(selected.Amount)}</p>
            <p><b>Trạng thái:</b> {selected.Status}</p>
            <p><b>Ngày tạo:</b> {new Date(selected.CreatedAt).toLocaleString()}</p>
            <button className="btn-cancel" onClick={() => setSelected(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentTable;
