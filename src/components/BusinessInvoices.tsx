import React, { useEffect, useState } from "react";
import { businessService } from "../services/businessService";

const BusinessInvoices = ({ companyId }) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    const res = await businessService.getCompanyInvoices(companyId);
    if (res.success) setInvoices(res.data || []);
  };

  // =========================
  // 🔥 Thanh toán 1 hóa đơn doanh nghiệp (ĐÃ FIX)
  // =========================
  const handlePaySingle = async (invoiceId) => {
    // ⭐ LƯU KIỂU THANH TOÁN ĐỂ PaymentSuccess biết
    localStorage.setItem("paymentType", "business-invoice");
    localStorage.setItem("payingInvoiceId", invoiceId);

    const newTab = window.open("", "_blank");

    try {
      const res = await businessService.paySingleInvoice(invoiceId);

      // BE trả về: { success, data: { url, txnRef } }
      const url = res?.data?.url;

      if (!url) {
        alert("Không nhận được URL thanh toán!");
        newTab.close();
        return;
      }

      newTab.location.href = url;
    } catch (err) {
      console.error("PAY ERROR:", err);
      alert("Không thể tạo thanh toán!");
      newTab.close();
    }
  };

  return (
    <div className="business-section">
      <h3 className="section-title">🧾 Hóa Đơn Doanh Nghiệp</h3>

      <table className="green-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Người dùng</th>
            <th>Xe</th>
            <th>Biển số</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thanh toán</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.invoiceId}>
              <td>{inv.invoiceId}</td>

              {/* BE chỉ trả userId */}
              <td>User #{inv.userId}</td>

              {/* BE không trả vehicle info */}
              <td>—</td>
              <td>—</td>

              {/* Số tiền */}
              <td>{Number(inv.totalAmount || 0).toLocaleString()} đ</td>

              {/* Paid Status */}
              <td
                style={{
                  color: inv.paidStatus === "Paid" ? "#00ff99" : "#ff4444",
                  fontWeight: "bold",
                }}
              >
                {inv.paidStatus}
              </td>

              {/* Ngày tạo */}
              <td>
                {inv.createdAt
                  ? new Date(inv.createdAt).toLocaleString()
                  : "—"}
              </td>

              <td>
                {inv.paidStatus === "Paid" ? (
                  <span style={{ color: "#00ff99", fontWeight: "bold" }}>
                    ✔ Đã thanh toán
                  </span>
                ) : (
                  <button
                    className="pay-btn"
                    onClick={() => handlePaySingle(inv.invoiceId)}
                  >
                    💳 Thanh toán
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessInvoices;
