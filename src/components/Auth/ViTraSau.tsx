import React from "react";
import { useNavigate } from "react-router-dom";
import "./ViTraSau.css";

const ViTraSau: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="vi-tra-sau-container">
      {/* Nút quay lại */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      {/* Nội dung chính */}
      <div className="vi-tra-sau-card">
        {/* Bên trái: mô tả */}
        <div className="vi-tra-sau-info">
          <h2>Xin chào!</h2>
          <p>
            Chào mừng bạn đến với dịch vụ <b>Ví Trả Sau</b> của chúng tôi – giải
            pháp tiện lợi giúp bạn sạc xe mà không cần thanh toán ngay lập tức.
          </p>
          <p>
            Với ví trả sau, bạn có thể sử dụng dịch vụ không giới hạn số tiền và
            số lần sạc, thoải mái di chuyển mà không lo gián đoạn.
          </p>
          <p>
            Thanh toán sẽ thực hiện vào <b>ngày 30 hàng tháng</b>. Hãy đảm bảo
            thanh toán đúng hạn để tránh gián đoạn dịch vụ và các phí phát sinh
            không mong muốn.
          </p>
          <p>
            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi. Chúc bạn
            luôn trải nghiệm sạc xe điện thuận tiện và thú vị!
          </p>
        </div>

        {/* Bên phải: thông tin ví */}
        <div className="vi-tra-sau-wallet">
          <h3>Số dư đã sử dụng</h3>
          <h1 className="wallet-amount">0 VND</h1>
          <button className="pay-btn">Thanh toán ngay</button>

          <div className="invoice-section">
            <h4>Hóa Đơn Của Tôi</h4>
            <div className="invoice-list">
              <div className="invoice-item">
                <span>Tháng 10</span>
                <span>0 đ</span>
              </div>
              <div className="invoice-item">
                <span>Tháng 9</span>
                <span>0 đ</span>
              </div>
              <div className="invoice-item">
                <span>Tháng 8</span>
                <span>0 đ</span>
              </div>
            </div>
          </div>

          <footer className="wallet-footer">
            <p>© 2024 Company Name. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ViTraSau;
