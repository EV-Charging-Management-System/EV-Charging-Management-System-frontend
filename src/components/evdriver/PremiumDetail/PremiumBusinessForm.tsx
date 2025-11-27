import React, { useState } from "react";
import { businessService } from "../../../services/businessService";
import { authService } from "../../../services/authService";

const PremiumBusinessForm = ({ onClose }: any) => {
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState({
    companyName: "",
    address: "",
    mail: "",
    phone: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const user = await authService.getProfile();

    const payload = {
      userId: user?.UserId || user?.userId,
      ...company,
    };

    const res = await businessService.createCompany(payload);

    if (res?.companyId) {
      alert("Request submitted successfully! Please wait for admin approval.");
      onClose();
    } else {
      alert(res?.message || "An error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🏢 Register Business Account</h2>

        <form onSubmit={handleSubmit}>
          <label>Company Name</label>
          <input
            type="text"
            required
            placeholder="Enter company name..."
            onChange={(e) =>
              setCompany({ ...company, companyName: e.target.value })
            }
          />

          <label>Address</label>
          <input
            type="text"
            required
            placeholder="Enter address..."
            onChange={(e) =>
              setCompany({ ...company, address: e.target.value })
            }
          />

          <label>Email</label>
          <input
            type="email"
            required
            placeholder="Enter email..."
            onChange={(e) =>
              setCompany({ ...company, mail: e.target.value })
            }
          />

          <label>Phone Number</label>
          <input
            type="tel"
            required
            placeholder="Enter phone number..."
            onChange={(e) =>
              setCompany({ ...company, phone: e.target.value })
            }
          />

          <div className="form-buttons">
            <button type="submit" className="confirm-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>

            <button type="button" className="back-btn-bottom" onClick={onClose}>
              ← Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PremiumBusinessForm;
