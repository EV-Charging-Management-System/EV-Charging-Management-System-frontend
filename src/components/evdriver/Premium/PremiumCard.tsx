import React from "react";
import "../../../css/Premium.css";
import { useNavigate } from "react-router-dom";

interface PremiumCardProps {
  title: string;
  price: number;
  benefits: string[];
  packageId: number;
}

const PremiumCard: React.FC<PremiumCardProps> = ({ title, price, benefits, packageId }) => {
  const navigate = useNavigate();

  return (
    <div className="premium-plan-card">
      <h3>{title}</h3>
      <p className="price">{price.toLocaleString()} VND</p>

      <ul className="benefits">
        {benefits.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      <button
        className="buy-btn"
        onClick={() => navigate(`/premium/plan-premium?id=${packageId}`)}
      >
        Chọn gói
      </button>
    </div>
  );
};

export default PremiumCard;
