import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MembershipDetail.css";

const MembershipDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const packages = {
    "1month": {
      title: "Gói 1 Tháng",
      desc: "Ưu tiên đổi gói 1 Tháng",
      name: "Nguyễn Văn A",
      birth: "1/10/2004",
      email: "jansusu123@gmail.com",
      qr: "/QR1.png",
    },
    "6month": {
      title: "Gói Nửa Năm",
      desc: "Ưu tiên đổi gói Nửa Năm",
      name: "Nguyễn Văn A",
      birth: "1/10/2004",
      email: "jansusu123@gmail.com",
      qr: "/QR2.png",
    },
    "1year": {
      title: "Gói 1 Năm",
      desc: "Ưu tiên đổi gói 1 Năm",
      name: "Jos Nguyễn",
      birth: "1/10/2004",
      email: "jansusu123@gmail.com",
      qr: "/QR3.png",
    },
  };

  const current = packages[type as keyof typeof packages];

  const handleConfirm = () => {
    setError("❌ Bạn chưa thanh toán! Vui lòng thanh toán trước khi xác nhận.");
  };

  // TH: không tìm thấy gói
  if (!current) {
    return (
      <div className="detail-container">
        <div className="detail-card">
          <h2>Không tìm thấy gói hội viên</h2>

          <div className="action-group">
            <button className="back-btn" onClick={() => navigate("/membership")}>
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2>{current.title}</h2>
        <p>{current.desc}</p>
        <p>Họ tên chủ quyền: {current.name}</p>
        <p>Ngày sinh: {current.birth}</p>
        <p>Email: {current.email}</p>

        <img src={current.qr} alt="QR Code" className="qr-image" />

        {error && <p className="error-text">{error}</p>}

        {/* gom 2 nút vào 1 nhóm để đảm bảo thứ tự & spacing */}
        <div className="action-group">
          <button className="confirm-btn" onClick={handleConfirm}>
            Xác nhận và Thanh toán</button>
          <button className="back-btn" onClick={() => navigate("/membership")}>
            ← Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetail;
