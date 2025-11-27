import React, { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AdminDashboard.css";

const BusinessAccountTable: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Fetch pending business accounts
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await adminService.getBusinessAccounts();
      if (Array.isArray(res?.data)) setAccounts(res.data);
      else if (Array.isArray(res)) setAccounts(res);
      else setAccounts([]);
    } catch (err) {
      console.error("❌ Failed to load business accounts:", err);
      toast.error("Unable to load business accounts!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // 🔹 Update status in FE
  const updateStatus = (id: number, status: string) =>
    setAccounts((prev) =>
      prev.map((acc) => (acc.UserId === id ? { ...acc, AccountStatus: status } : acc))
    );

  // ✅ Approve
  const handleApprove = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await adminService.approveBusinessAccount(id);
      if (res.success) {
        updateStatus(id, "APPROVED");
        toast.success(res.message || "✅ Business account approved!");
        await fetchAccounts();
      } else toast.error(res.message || "❌ Approval failed!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error while approving account!");
    } finally {
      setProcessingId(null);
    }
  };

  // ❌ Reject
  const handleReject = async (id: number) => {
    setProcessingId(id);
    try {
      const res = await adminService.rejectBusinessAccount(id);
      if (res.success) {
        updateStatus(id, "REJECTED");
        toast.info(res.message || "🚫 Rejected!");
        await fetchAccounts();
      } else toast.error(res.message || "❌ Rejection failed!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error while rejecting account!");
    } finally {
      setProcessingId(null);
    }
  };

  // 🔍 View request details (show modal)
  const handleViewDetail = async (id: number) => {
    try {
      const res = await adminService.getBusinessDetail(id);
      if (res?.success && res.data) {
        setSelectedDetail(res.data);
        setShowModal(true);
      } else toast.warn("Business information not found!");
    } catch (err) {
      console.error("❌ Error while viewing details:", err);
      toast.error("Unable to load details!");
    }
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading business accounts...</p>
      </div>
    );

  if (!accounts.length)
    return (
      <div className="empty-container">
        <p>No pending business accounts.</p>
      </div>
    );

  return (
    <section className="admin-section">
      <h2>🏢 Business Account List</h2>
      <p className="section-desc">
        Admins can view details, approve, or reject upgrade requests.
      </p>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => {
            const status = acc.AccountStatus || acc.RoleName || "PENDING";
            return (
              <tr key={acc.UserId}>
                <td>{acc.UserId}</td>
                <td>{acc.UserName}</td>
                <td>{acc.Mail}</td>
                <td>
                  <span
                    className={`status-badge ${
                      status === "BUSINESS" || status === "APPROVED"
                        ? "status-approved"
                        : status === "PENDING_BUSINESS" || status === "PENDING"
                        ? "status-pending"
                        : "status-rejected"
                    }`}
                  >
                    {status === "BUSINESS" ? "APPROVED" : status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-detail"
                      onClick={() => handleViewDetail(acc.UserId)}
                    >
                      View Details
                    </button>
                    {status === "PENDING_BUSINESS" || status === "PENDING" ? (
                      <>
                        <button
                          className="btn-approve"
                          disabled={processingId === acc.UserId}
                          onClick={() => handleApprove(acc.UserId)}
                        >
                          {processingId === acc.UserId ? "Approving..." : "Approve"}
                        </button>
                        <button
                          className="btn-reject"
                          disabled={processingId === acc.UserId}
                          onClick={() => handleReject(acc.UserId)}
                        >
                          {processingId === acc.UserId ? "Rejecting..." : "Reject"}
                        </button>
                      </>
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 🔹 Modal for details */}
      {showModal && selectedDetail && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>📋 Business Details</h3>
            <p><strong>👤 User:</strong> {selectedDetail.UserName}</p>
            <p><strong>📧 Email:</strong> {selectedDetail.UserMail}</p>
            <p><strong>🏢 Company:</strong> {selectedDetail.CompanyName || "N/A"}</p>
            <p><strong>📍 Address:</strong> {selectedDetail.Address || "N/A"}</p>
            <p><strong>📞 Phone:</strong> {selectedDetail.Phone || "N/A"}</p>
            <p><strong>✉️ Company Email:</strong> {selectedDetail.CompanyMail || "N/A"}</p>

            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default BusinessAccountTable;
