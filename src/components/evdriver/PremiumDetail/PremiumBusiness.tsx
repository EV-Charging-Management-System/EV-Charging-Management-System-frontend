import React, { useEffect, useState } from "react";
import { authService } from "../../../services/authService";
import PremiumBusinessForm from "./PremiumBusinessForm";
import { useNavigate } from "react-router-dom";

const PremiumBusiness: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);

  // Điều kiện
  const isBusiness = user?.roleName?.toUpperCase() === "BUSINESS";
  const isPending = (user?.status || "").toUpperCase() === "PENDING";
  const hasCompany = !!user?.companyId; // user.companyId != null

  useEffect(() => {
    authService.getProfile({ noCache: true }).then((u) => setUser(u));
  }, []);

  return (
    <>
      <div className="business-card">
        
        {/* CASE 1: ĐÃ LÀ DOANH NGHIỆP */}
        {isBusiness ? (
          <h3 className="business-title">💼 Bạn đã là tài khoản doanh nghiệp</h3>
        ) :

        /* CASE 2: YÊU CẦU ĐANG CHỜ ADMIN DUYỆT */
        isPending ? (
          <h3 className="business-title">🕓 Yêu cầu đang chờ admin duyệt</h3>
        ) :

        /* CASE 3: ĐÃ CÓ COMPANY ID → KHÔNG CHO GỬI */
        hasCompany ? (
          <h3 className="business-title">🏢 Bạn đã có hồ sơ doanh nghiệp</h3>
        ) : (
          <>
            {/* CASE 4: CHƯA ĐĂNG KÝ → CHO GỬI */}
            <i className="business-icon">🏢</i>
            <h2 className="business-title">Đăng Ký Tài Khoản Doanh Nghiệp</h2>

            <p className="business-desc">
              Tài khoản doanh nghiệp cho phép bạn sử dụng toàn bộ tính năng nâng cao.
            </p>

            <ul className="business-intro-list">
              <li>Quản lý trạm sạc của riêng bạn</li>
              <li>Thêm & quản lý nhân viên</li>
              <li>Xem báo cáo doanh thu theo thời gian thực</li>
              <li>Ưu tiên hỗ trợ từ hệ thống</li>
            </ul>

            <button className="btn-main" onClick={() => setShowForm(true)}>
              Gửi yêu cầu nâng cấp
            </button>
          </>
        )}

        {/* NÚT QUAY LẠI */}
        <button className="btn-back" onClick={() => navigate("/premium")}>
          ← Quay lại
        </button>
      </div>

      {/* MODAL  */}
      {showForm && <PremiumBusinessForm onClose={() => setShowForm(false)} />}
    </>
  );
};

export default PremiumBusiness;
