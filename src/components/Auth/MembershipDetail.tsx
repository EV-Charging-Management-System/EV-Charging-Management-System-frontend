import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MembershipDetail.css";

const MembershipDetail: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  // Dữ liệu tĩnh của từng gói hội viên
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

  if (!current) {
    return (
      <div className="detail-container">
        <div className="detail-card">
          <h2>Không tìm thấy gói hội viên</h2>
          <button
            className="back-btn"
            onClick={() => navigate("/membership")}
          >
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Khi bấm nút "Xác nhận và Thanh toán"
  const handleConfirm = () => {
    setError(
      "❌ Bạn chưa thanh toán! Vui lòng thanh toán trước khi xác nhận."
    );
  };

  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2>{current.title}</h2>
        <p>{current.desc}</p>
        <p>Họ tên chủ quyền: {current.name}</p>
        <p>Ngày sinh: {current.birth}</p>
        <p>Email: {current.email}</p>

        {/* Ảnh QR từ thư mục public */}
        <img src={current.qr} alt="QR Code" className="qr-image" />

        {/* Nếu có lỗi sẽ hiện chữ đỏ */}
        {error && <p className="error-text">{error}</p>}

        {/* Nút Xác nhận */}
        <button className="confirm-btn" onClick={handleConfirm}>
          Xác nhận và Thanh toán
        </button>

        {/* Nút Quay lại nằm dưới confirm */}
        <button
          className="back-btn"
          onClick={() => navigate("/membership")}
          style={{ marginTop: "16px" }} // đảm bảo cách confirm
        >
          ← Quay lại
        </button>
      </div>
    </div>
  );
};

export default MembershipDetail;
