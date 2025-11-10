import React from "react";
import "../../css/Contact.css";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Header from "../../pages/layouts/header";
import Footer from "../../pages/layouts/footer";
import MenuBar from "../../pages/layouts/menu-bar";

const Contact: React.FC = () => {
  return (
    <div className="page-container">
      <Header />
      <MenuBar />

      <main className="contact-body">
        <h1 className="page-title">Liên Hệ Với Chúng Tôi</h1>
        <p className="page-description">
          Hãy để lại phản hồi hoặc yêu cầu hỗ trợ, đội ngũ chăm sóc khách hàng luôn sẵn sàng phục vụ 24/7.
        </p>

        {/* ===== THÔNG TIN LIÊN HỆ ===== */}
        <div className="contact-info">
          <div className="info-card">
            <Phone size={36} color="#00ffcc" />
            <h3>Hotline</h3>
            <p>0112 334 567</p>
          </div>

          <div className="info-card">
            <Mail size={36} color="#00ffcc" />
            <h3>Email</h3>
            <p>support@evchargingsystem.com</p>
          </div>

          <div className="info-card">
            <MapPin size={36} color="#00ffcc" />
            <h3>Địa chỉ</h3>
            <p>123 EV Street, TP. Hồ Chí Minh</p>
          </div>
        </div>

        {/* ===== FORM LIÊN HỆ ===== */}
        <form className="contact-form">
          <input type="text" placeholder="Họ và tên của bạn" required />
          <input type="email" placeholder="Email liên hệ" required />
          <textarea placeholder="Nội dung tin nhắn..." rows={5} required></textarea>
          <button type="submit" className="send-btn">
            <Send size={18} />
            <span>Gửi Liên Hệ</span>
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
