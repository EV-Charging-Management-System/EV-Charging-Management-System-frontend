import React from "react";
import "../../css/Payment.css";
import { CreditCard, Smartphone, Wallet, QrCode } from "lucide-react";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";

const Payment: React.FC = () => {
  const paymentMethods = [
    {
      id: 1,
      name: "Thanh Toán VNPay",
      description: "Liên kết ví VNPay để thanh toán nhanh chóng, an toàn chỉ trong vài giây.",
      icon: <QrCode size={40} color="#00ffcc" />,
      color: "linear-gradient(90deg, #00ffa3, #00cc66)",
    },
    {
      id: 2,
      name: "Thẻ Visa / Mastercard",
      description: "Chấp nhận tất cả thẻ quốc tế và nội địa, bảo mật theo chuẩn PCI DSS.",
      icon: <CreditCard size={40} color="#00ffcc" />,
      color: "linear-gradient(90deg, #00d4ff, #00ffa3)",
    },
    {
      id: 3,
      name: "Ví EV Wallet",
      description: "Sử dụng số dư trong ví của bạn để thanh toán và nhận ưu đãi hoàn tiền.",
      icon: <Wallet size={40} color="#00ffcc" />,
      color: "linear-gradient(90deg, #00ffa3, #00b3b3)",
    },
    {
      id: 4,
      name: "Thanh Toán Qua App",
      description: "Quét mã QR trực tiếp trên ứng dụng EV Charging để hoàn tất thanh toán.",
      icon: <Smartphone size={40} color="#00ffcc" />,
      color: "linear-gradient(90deg, #00ffcc, #00aaff)",
    },
  ];

  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="payment-body">
        <h1 className="page-title">Phương Thức Thanh Toán</h1>
        <p className="page-description">
          Lựa chọn phương thức thanh toán tiện lợi và an toàn cho mỗi lần sạc của bạn.
        </p>

        <div className="payment-grid">
          {paymentMethods.map((method) => (
            <div className="payment-card" key={method.id}>
              <div className="icon-wrapper" style={{ background: method.color }}>
                {method.icon}
              </div>
              <h3 className="payment-title">{method.name}</h3>
              <p className="payment-desc">{method.description}</p>
              <button className="select-btn">Chọn Phương Thức</button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
