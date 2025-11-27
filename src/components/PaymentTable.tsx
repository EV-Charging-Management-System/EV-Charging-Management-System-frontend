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
    // 🎯 Mock data for displaying the table
    const mockData: Payment[] = [
      {
        PaymentId: 1001,
        BookingId: 501,
        Amount: 250000,
        Method: "VNPAY",
        Status: "PAID",
        CreatedAt: "2025-10-26T09:00:00",
        UserName: "driver01",
        StationName: "Central Charging Station",
      },
      {
        PaymentId: 1002,
        BookingId: 502,
        Amount: 180000,
        Method: "MOMO",
        Status: "PENDING",
        CreatedAt: "2025-10-25T14:30:00",
        UserName: "business01",
        StationName: "Hanoi Charging Station",
      },
      {
        PaymentId: 1003,
        BookingId: 503,
        Amount: 200000,
        Method: "CASH",
        Status: "FAILED",
        CreatedAt: "2025-10-24T10:00:00",
        UserName: "staff01",
        StationName: "Binh Duong Charging Station",
      },
    ];
    setPayments(mockData);
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <section className="data-section">
      <h2>💳 Invoice List</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Booking</th>
            <th>Amount (VND)</th>
            <th>Method</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
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
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail popup */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🧾 Invoice Details</h3>
            <p><b>Invoice ID:</b> {selected.PaymentId}</p>
            <p><b>User:</b> {selected.UserName}</p>
            <p><b>Charging Station:</b> {selected.StationName}</p>
            <p><b>Booking ID:</b> {selected.BookingId}</p>
            <p><b>Method:</b> {selected.Method}</p>
            <p><b>Amount:</b> {formatCurrency(selected.Amount)}</p>
            <p><b>Status:</b> {selected.Status}</p>
            <p><b>Created At:</b> {new Date(selected.CreatedAt).toLocaleString()}</p>
            <button className="btn-cancel" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentTable;
