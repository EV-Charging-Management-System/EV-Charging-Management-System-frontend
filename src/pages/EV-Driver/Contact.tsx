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
        <h1 className="page-title">Contact Us</h1>
        <p className="page-description">
          Leave your feedback or support request, our customer care team is always ready to serve 24/7.
        </p>

        {/* ===== CONTACT INFORMATION ===== */}
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
            <h3>Address</h3>
            <p>123 EV Street, Ho Chi Minh City</p>
          </div>
        </div>

        {/* ===== CONTACT FORM ===== */}
        <form className="contact-form">
          <input type="text" placeholder="Your full name" required />
          <input type="email" placeholder="Contact email" required />
          <textarea placeholder="Message content..." rows={5} required></textarea>
          <button type="submit" className="send-btn">
            <Send size={18} />
            <span>Send Message</span>
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
