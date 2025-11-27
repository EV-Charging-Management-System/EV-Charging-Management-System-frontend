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
  // 🔥 Pay a single business invoice
  // =========================
  const handlePaySingle = async (invoiceId) => {
    // ⭐ Save payment type so PaymentSuccess can identify it
    localStorage.setItem("paymentType", "business-invoice");
    localStorage.setItem("payingInvoiceId", invoiceId);

    const newTab = window.open("", "_blank");

    try {
      const res = await businessService.paySingleInvoice(invoiceId);

      const url = res?.data?.url;

      if (!url) {
        alert("No payment URL received!");
        newTab.close();
        return;
      }

      newTab.location.href = url;
    } catch (err) {
      console.error("PAY ERROR:", err);
      alert("Unable to initiate payment!");
      newTab.close();
    }
  };

  return (
    <div className="business-section">
      <h3 className="section-title">🧾 Business Invoices</h3>

      <table className="green-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Vehicle</th>
            <th>License Plate</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Payment</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.invoiceId}>
              <td>{inv.invoiceId}</td>

             {/* 🟢 HIỂN THỊ TÊN USER */}
              <td>{inv.userName ? inv.userName : `User #${inv.userId}`}</td>

              {/* 🟢 HIỂN THỊ TÊN XE */}
              <td>{inv.vehicleName || "—"}</td>

              {/* 🟢 HIỂN THỊ BIỂN SỐ */}
              <td>{inv.licensePlate || "—"}</td>

              <td>{Number(inv.totalAmount || 0).toLocaleString()} đ</td>

              <td
                style={{
                  color: inv.paidStatus === "Paid" ? "#00ff99" : "#ff4444",
                  fontWeight: "bold",
                }}
              >
                {inv.paidStatus}
              </td>

              {/* Created At */}
              <td>
                {inv.createdAt
                  ? new Date(inv.createdAt).toLocaleString()
                  : "—"}
              </td>

              <td>
                {inv.paidStatus === "Paid" ? (
                  <span style={{ color: "#00ff99", fontWeight: "bold" }}>
                    ✔ Paid
                  </span>
                ) : (
                  <button
                    className="pay-btn"
                    onClick={() => handlePaySingle(inv.invoiceId)}
                  >
                    💳 Pay Now
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
