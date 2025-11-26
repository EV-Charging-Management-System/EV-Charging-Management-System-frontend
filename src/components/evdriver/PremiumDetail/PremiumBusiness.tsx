import React, { useEffect, useState } from "react";
import { authService } from "../../../services/authService";
import PremiumBusinessForm from "./PremiumBusinessForm";
import { useNavigate } from "react-router-dom";

const PremiumBusiness: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  // Conditions
  const isBusiness = user?.roleName?.toUpperCase() === "BUSINESS";
  const isPending = (user?.status || "").toUpperCase() === "PENDING";
  const hasCompany = !!user?.companyId;

  useEffect(() => {
    authService.getProfile({ noCache: true }).then((u) => setUser(u));
  }, []);

  return (
    <>
      <div className="business-card">
        
        {/* CASE 1: Already a Business Account */}
        {isBusiness ? (
          <h3 className="business-title">💼 You are already a Business Account</h3>
        ) :

        /* CASE 2: Request Pending Approval */
        isPending ? (
          <h3 className="business-title">🕓 Your request is pending admin approval</h3>
        ) :

        /* CASE 3: Company profile exists */
        hasCompany ? (
          <h3 className="business-title">🏢 You already have a business profile</h3>
        ) : (
          <>
            {/* CASE 4: Not Registered → Can Submit Request */}
            <i className="business-icon">🏢</i>
            <h2 className="business-title">Register Business Account</h2>

            <p className="business-desc">
              A Business Account allows you to access all advanced system features.
            </p>

            <ul className="business-intro-list">
              <li>Manage your own charging stations</li>
              <li>Add & manage staff members</li>
              <li>View real-time revenue reports</li>
              <li>Receive priority system support</li>
            </ul>

            <button className="btn-main" onClick={() => setShowForm(true)}>
              Submit Upgrade Request
            </button>
          </>
        )}

        {/* BACK BUTTON */}
        <button className="btn-back" onClick={() => navigate("/premium")}>
          ← Back
        </button>
      </div>

      {/* MODAL */}
      {showForm && <PremiumBusinessForm onClose={() => setShowForm(false)} />}
    </>
  );
};

export default PremiumBusiness;
