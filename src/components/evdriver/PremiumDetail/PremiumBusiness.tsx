import React, { useEffect, useState } from "react";
import { authService } from "../../../services/authService";
import PremiumBusinessForm from "./PremiumBusinessForm";
import { useNavigate } from "react-router-dom";

const PremiumBusiness: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  const isBusiness = user?.roleName?.toUpperCase() === "BUSINESS";
  const isPending = (user?.status || "").toUpperCase() === "PENDING";

  useEffect(() => {
    authService.getProfile({ noCache: true }).then((u) => setUser(u));
  }, []);

  return (
    <div className="membership-info">
      {isBusiness ? (
        <h3>💼 Bạn đã là tài khoản doanh nghiệp</h3>
      ) : isPending ? (
        <h3>🕓 Yêu cầu đang chờ admin duyệt</h3>
      ) : (
        <>
          <p>Nâng cấp tài khoản doanh nghiệp để sử dụng đầy đủ chức năng.</p>

          <button className="confirm-btn" onClick={() => setShowForm(true)}>
            Gửi yêu cầu nâng cấp
          </button>
        </>
      )}

      <button className="back-btn-bottom" onClick={() => navigate("/premium")}>
        ← Quay lại
      </button>

      {showForm && <PremiumBusinessForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default PremiumBusiness;
