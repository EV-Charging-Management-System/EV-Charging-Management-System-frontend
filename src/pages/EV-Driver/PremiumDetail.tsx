import React from "react";
import { useParams } from "react-router-dom";
import "../../css/PremiumDetail.css";

import PremiumPremium from "../../components/evdriver/PremiumDetail/PremiumPremium";
import PremiumBusiness from "../../components/evdriver/PremiumDetail/PremiumBusiness";

const PremiumDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  return (
    <div className="detail-container">
      <div className="detail-card fade-in">
        {type === "plan-premium" && <PremiumPremium />}
        {type === "plan-business" && <PremiumBusiness />}
      </div>
    </div>
  );
};

export default PremiumDetail;
