import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/PremiumDetail.css";
import { premiumService } from "../../services/premiumService";

const PremiumDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ======= DANH SÁCH GÓI =======
  const packages = {
    "plan-premium": {
      id: 1,
      title: "Gói Premium",
      desc: "Trải nghiệm đặc quyền cao cấp – truy cập không giới hạn và hỗ trợ ưu tiên.",
      qr: "/QR1.png",
      benefits: [
        "Truy cập toàn bộ hệ thống trạm sạc trên toàn quốc.",
        "Hỗ trợ 24/7 riêng cho hội viên Premium.",
        "Nhận thông báo sớm về trạm sạc trống & khuyến mãi độc quyền.",
        "Tự động lưu lịch sử giao dịch và trạm yêu thích.",
        "Ưu đãi thành viên với đối tác liên kết.",
      ],
    },
    "plan-business": {
      id: 2,
      title: "Tài Khoản Doanh Nghiệp",
      desc: "Dành cho doanh nghiệp muốn quản lý tập trung và tối ưu doanh thu sạc điện.",
      qr: "/QR2.png",
      benefits: [
        "Quản lý nhiều tài khoản nhân viên và phương tiện cùng lúc.",
        "Theo dõi hiệu suất sạc và báo cáo giao dịch định kỳ.",
        "Tổng hợp thanh toán & chuyển doanh thu cuối chu kỳ.",
        "Ưu tiên hỗ trợ kỹ thuật & bảo mật dữ liệu doanh nghiệp.",
        "Cập nhật thống kê & báo cáo theo thời gian thực.",
      ],
    },
  };

  const current = packages[type as keyof typeof packages];

  // ======= XỬ LÝ MUA GÓI =======
  const handleConfirm = async () => {
    setError("");
    if (!current) {
      navigate("/premium");
      return;
    }

    try {
      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        setError("⚠️ Bạn cần đăng nhập trước khi mua gói!");
        return;
      }

      setLoading(true);
      const res = await premiumService.purchase({
        userId,
        packageId: current.id,
        paymentMethod: "QR",
      });

      if (res.success) {
        navigate("/payment-success");
      } else {
        navigate("/payment-failed");
      }
    } catch (err) {
      console.error("premium purchase error:", err);
      navigate("/payment-failed");
    } finally {
      setLoading(false);
    }
  };

  // ======= GÓI KHÔNG TỒN TẠI =======
  if (!current) {
    return (
      <div className="detail-container">
        <div className="detail-card fade-in">
          <h2>Không tìm thấy gói hội viên</h2>
          <button className="back-btn" onClick={() => navigate("/premium")}>
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  // ======= GIAO DIỆN CHÍNH =======
  return (
    <div className="detail-container">
      <div className="detail-card fade-in">
        <h2>{current.title}</h2>
        <p className="desc">{current.desc}</p>

        <h4>Quyền lợi:</h4>
        <ul className="benefit-list">
          {current.benefits.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>

        <img src={current.qr} alt="QR Code" className="qr-image" />

        {error && <p className="error-text">{error}</p>}

        <div className="action-group">
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
          </button>

          <button className="back-btn" onClick={() => navigate("/premium")}>
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumDetail;
