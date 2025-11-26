import React from "react";
import "../../../css/Premium.css";

import { useNavigate } from "react-router-dom";

interface BusinessCardProps {
  benefits: string[];
}

const BusinessCard: React.FC<BusinessCardProps> = ({ benefits }) => {
  const navigate = useNavigate();

  return (
    <div className="premium-plan-card">
      <h3>Business Account</h3>

      <ul className="benefits">
        {benefits.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      <button className="buy-btn" onClick={() => navigate("/premium/plan-business")}>
       Upgrade Your Account
      </button>
    </div>
  );
};

export default BusinessCard;
