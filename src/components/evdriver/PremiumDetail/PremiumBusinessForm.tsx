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
      alert("Gửi yêu cầu thành công! Vui lòng chờ admin duyệt.");
      onClose();
    } else {
      alert(res?.message || "Có lỗi xảy ra.");
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🏢 Đăng Ký Tài Khoản Doanh Nghiệp</h2>

        <form onSubmit={handleSubmit}>
          <label>Tên công ty</label>
          <input
            type="text"
            required
            placeholder="Nhập tên công ty..."
            onChange={(e) =>
              setCompany({ ...company, companyName: e.target.value })
            }
          />

          <label>Địa chỉ</label>
          <input
            type="text"
            required
            placeholder="Nhập địa chỉ..."
            onChange={(e) =>
              setCompany({ ...company, address: e.target.value })
            }
          />

          <label>Email</label>
          <input
            type="email"
            required
            placeholder="Nhập email..."
            onChange={(e) =>
              setCompany({ ...company, mail: e.target.value })
            }
          />

          <label>Số điện thoại</label>
          <input
            type="tel"
            required
            placeholder="Nhập số điện thoại..."
            onChange={(e) =>
              setCompany({ ...company, phone: e.target.value })
            }
          />

          <div className="form-buttons">
            <button type="submit" className="confirm-btn" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>

            <button type="button" className="back-btn-bottom" onClick={onClose}>
              ← Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PremiumBusinessForm;
