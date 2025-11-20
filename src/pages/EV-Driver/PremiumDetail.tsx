import React from "react";
import { useParams } from "react-router-dom";
import "../../css/PremiumDetail.css";

import PremiumPremium from "../../components/evdriver/PremiumDetail/PremiumPremium";
import PremiumBusiness from "../../components/evdriver/PremiumDetail/PremiumBusiness";

const PremiumDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  return (
    <div className="detail-container">

      {/* --- PAGE PREMIUM --- */}
      {type === "plan-premium" && (
        <div className="detail-card fade-in">
          <PremiumPremium />
        </div>
      )}

      {/* --- PAGE BUSINESS --- */}
      {type === "plan-business" && (
        <div className="business-card fade-in">
          <PremiumBusiness />
        </div>
      )}

    </div>
  );
};

export default PremiumDetail;
