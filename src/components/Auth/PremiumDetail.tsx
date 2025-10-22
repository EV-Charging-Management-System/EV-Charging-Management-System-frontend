import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PremiumDetail.css";

const PremiumDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  // ===================== GÓI MỚI =====================
  const packages = {
    "plan-premium": {
      title: "Gói Premium",
      desc: "Trải nghiệm đặc quyền cao cấp – quyền truy cập không giới hạn và hỗ trợ ưu tiên.",
      name: "Nguyễn Văn A",
      birth: "01/10/2004",
      email: "jansusu123@gmail.com",
      qr: "/QR1.png",
      benefits: [
        "Truy cập toàn bộ hệ thống trạm sạc trên toàn quốc.",
        "Đường dây hỗ trợ 24/7 riêng cho hội viên Premium.",
        "Nhận thông báo sớm về trạm sạc trống & khuyến mãi độc quyền.",
        "Tự động lưu lịch sử giao dịch và trạm yêu thích.",
        "Ưu đãi thành viên với đối tác liên kết."
      ]
    },
    "plan-business": {
      title: "Tài Khoản Doanh Nghiệp",
      desc: "Dành cho doanh nghiệp muốn quản lý tập trung và tối ưu lợi nhuận sạc điện.",
      name: "Công Ty TNHH EV Charge Việt Nam",
      birth: "Thành lập: 15/05/2020",
      email: "business@evcharge.vn",
      qr: "/QR2.png",
      benefits: [
        "Quản lý nhiều tài khoản nhân viên và phương tiện cùng lúc.",
        "Theo dõi hiệu suất sạc và báo cáo giao dịch định kỳ.",
        "Tổng hợp toàn bộ khoản thanh toán và chuyển doanh thu cho doanh nghiệp vào cuối chu kỳ thanh toán.",
        "Ưu tiên hỗ trợ kỹ thuật và bảo mật dữ liệu doanh nghiệp.",
        "Cập nhật thống kê & báo cáo sử dụng theo thời gian thực."
      ]
    }
  };

  const current = packages[type as keyof typeof packages];

  const handleConfirm = () => {
    setError("❌ Bạn chưa hoàn tất thanh toán. Vui lòng quét mã QR để tiếp tục.");
  };

  // ===================== KHÔNG TÌM THẤY GÓI =====================
  if (!current) {
    return (
      <div className="detail-container">
        <div className="detail-card">
          <h2>Không tìm thấy gói hội viên</h2>
          <div className="action-group">
            <button className="back-btn" onClick={() => navigate("/premium")}>
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===================== HIỂN THỊ CHI TIẾT =====================
  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2>{current.title}</h2>
        <p className="desc">{current.desc}</p>
        <p>Chủ tài khoản: {current.name}</p>
        <p>{current.birth}</p>
        <p>Email liên hệ: {current.email}</p>

        <h4>Quyền lợi:</h4>
        <ul className="benefit-list">
          {current.benefits.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>

        <img src={current.qr} alt="QR Code" className="qr-image" />

        {error && <p className="error-text">{error}</p>}

        <div className="action-group">
          <button className="confirm-btn" onClick={handleConfirm}>
            Xác nhận và Thanh toán
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
