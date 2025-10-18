import React, { useState } from "react";
import "./HomePage.css";
import { FaPhoneAlt } from "react-icons/fa";
import Notification from "./Notification";
import ProfileUser from "./ProfileUser";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { FaLocationDot } from "react-icons/fa6";
import { MapPin, Clock, Zap, Star, Wallet, Shield } from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      alert("Đăng xuất thành công!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Logout thất bại!");
    }
  };

  const featuresContent: { [key: string]: string } = {
    "Tìm Trạm Dễ Dàng": `Với tính năng tìm trạm dễ dàng, người dùng có thể nhanh chóng xác định vị trí trạm sạc gần nhất. Bản đồ hiển thị chi tiết từng trạm với công suất và tình trạng hoạt động. Hệ thống cung cấp thông tin về số lượng cổng sạc khả dụng, thời gian chờ trung bình và loại sạc hỗ trợ. Người dùng có thể lọc theo khoảng cách, công suất và phí sạc. Việc này giúp tiết kiệm thời gian và tối ưu hóa lịch trình di chuyển. Ngoài ra, các trạm mới được cập nhật liên tục. Mọi dữ liệu được đồng bộ hóa theo thời gian thực. Tính năng này đặc biệt hữu ích với người dùng mới. Nó cũng hiển thị đánh giá và phản hồi từ những người đã sử dụng trạm trước đó. Chức năng yêu thích trạm giúp truy cập nhanh lần sau.`,
    "Đặt Lịch Online": `Đặt lịch online giúp người dùng chủ động sắp xếp thời gian sạc. Họ có thể chọn trạm, ngày và giờ phù hợp mà không cần xếp hàng chờ đợi. Hệ thống nhắc nhở qua thông báo trước khi lịch sắp đến. Người dùng nhận được xác nhận tức thì khi đặt lịch thành công. Có thể thay đổi hoặc hủy lịch dễ dàng trong ứng dụng. Lịch sử đặt sạc được lưu lại để tiện theo dõi. Tính năng này kết nối trực tiếp với hệ thống trạm để đảm bảo slot trống. Đồng thời hỗ trợ đặt lịch cho nhiều xe cùng lúc. Dữ liệu được bảo mật và đồng bộ hóa với ví thanh toán. Đây là giải pháp tiện lợi cho người có lịch trình bận rộn.`,
    "Sạc Nhanh": `Tính năng sạc nhanh mang lại trải nghiệm tiện lợi cho người dùng với thời gian sạc tối ưu. Công suất từ 80kW đến 150kW giúp xe sạc đầy nhanh chóng. Hệ thống kiểm soát nhiệt độ và dòng điện để đảm bảo an toàn. Người dùng có thể theo dõi tiến trình sạc trực tiếp trên ứng dụng. Các trạm sạc nhanh được đặt tại vị trí thuận tiện. Có thông báo khi quá trình sạc hoàn tất. Ngoài ra, phí sạc được tính minh bạch. Sạc nhanh giúp giảm thời gian chờ tại trạm. Tính năng này thích hợp cho những người cần di chuyển liên tục. Cơ chế bảo vệ pin giúp kéo dài tuổi thọ xe. Mỗi trạm được kiểm tra định kỳ để đảm bảo ổn định. Người dùng có thể chọn chế độ sạc tối ưu cho xe.`,
    "Gói Premium": `Gói Premium mang lại nhiều quyền lợi cho người dùng. Bao gồm ưu tiên đặt lịch, giảm giá 30% mỗi lần sạc. Người dùng có thể truy cập các trạm đặc biệt dành riêng cho gói này. Hỗ trợ tư vấn khách hàng nhanh chóng và ưu tiên. Lịch sử sạc và giao dịch được quản lý chi tiết. Có thêm các ưu đãi đặc biệt vào các dịp lễ. Thông báo và nhắc nhở được gửi nhanh hơn. Người dùng có thể tạm ngừng hoặc nâng cấp gói dễ dàng. Gói Premium giúp trải nghiệm dịch vụ tiện lợi hơn. Mọi tính năng đều được bảo mật tuyệt đối. Nó hướng đến khách hàng trung thành và thường xuyên sử dụng. Truy cập app luôn có thông tin gói rõ ràng và dễ quản lý.`,
    "Ví Trả Sau": `Ví trả sau cho phép người dùng sạc trước và thanh toán cuối tháng. Hệ thống tổng hợp giao dịch hàng tháng để thanh toán dễ dàng. Người dùng có thể xem chi tiết các giao dịch đã thực hiện. Dễ dàng kiểm tra số dư và hạn mức còn lại. Tích hợp với các phương thức thanh toán trực tuyến. Thông báo nhắc thanh toán được gửi tự động. Ví Trả Sau giúp quản lý chi phí sạc hiệu quả. An toàn và bảo mật thông tin tài khoản luôn được đảm bảo. Tính năng này thuận tiện cho doanh nghiệp sử dụng nhiều xe. Hỗ trợ lịch sử giao dịch để tra cứu và đối chiếu. Giao diện thân thiện giúp thao tác nhanh chóng. Người dùng cũng nhận ưu đãi khi thanh toán đúng hạn.`,
    "Bảo Mật Cao": `Tính năng bảo mật cao đảm bảo mọi dữ liệu người dùng được mã hóa. Các giao dịch thanh toán đều qua hệ thống bảo mật nghiêm ngặt. Thông tin cá nhân và lịch sử giao dịch được lưu trữ an toàn. Hệ thống phát hiện và ngăn chặn hành vi truy cập trái phép. Người dùng có thể thiết lập xác thực 2 bước. Dữ liệu truyền đi được mã hóa toàn bộ. Các trạm sạc tuân thủ tiêu chuẩn an ninh quốc tế. Hệ thống sao lưu định kỳ để tránh mất dữ liệu. Tất cả thông tin được kiểm tra bảo mật thường xuyên. Người dùng có thể yên tâm trải nghiệm dịch vụ. Mọi cảnh báo bảo mật được gửi trực tiếp trong app. Đây là cam kết an toàn cho mọi khách hàng.`
  };

  const handleCardClick = (featureName: string) => {
    // Nếu click ô đang mở => ẩn, nếu click ô khác => mở ô mới và ẩn ô cũ
    setActiveFeature(activeFeature === featureName ? null : featureName);
  };

  const iconsMap: { [key: string]: React.ReactNode } = {
    "Tìm Trạm Dễ Dàng": <MapPin />,
    "Đặt Lịch Online": <Clock />,
    "Sạc Nhanh": <Zap />,
    "Gói Premium": <Star />,
    "Ví Trả Sau": <Wallet />,
    "Bảo Mật Cao": <Shield />
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="slogan">
            Optimising your journey, Powering your life
          </span>
        </div>
        <div className="header-center">
          <FaPhoneAlt className="phone-icon" />
          <span className="hotline-text">Hotline: 0112334567</span>
        </div>
        <div className="header-right" style={{ display: "flex", gap: "16px" }}>
          <Notification />
          <ProfileUser />
        </div>
      </header>

      {/* Menu */}
      <nav className="menu-bar">
        <ul className="menu-list">
          <li><NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink></li>
          <li><NavLink to="/booking-online-station" className={({ isActive }) => (isActive ? "active" : "")}>Booking Online Station</NavLink></li>
          <li><NavLink to="/blog" className={({ isActive }) => (isActive ? "active" : "")}>Blog</NavLink></li>
          <li><NavLink to="/payment" className={({ isActive }) => (isActive ? "active" : "")}>Payment</NavLink></li>
          <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink></li>
          <li><NavLink to="/premium" className={({ isActive }) => (isActive ? "active" : "")}>Premium</NavLink></li>
          <li><NavLink to="/business" className={({ isActive }) => (isActive ? "active" : "")}>Business</NavLink></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <main className="main-content">
        <div className="hero-text">
          <h1>
            Sạc Xe Điện <span className="highlight">Thông Minh</span><br />
            Nhanh Chóng & Tiện Lợi
          </h1>
          <p className="description">
            Hệ thống quản lý trạm sạc xe điện hiện đại với mạng lưới rộng khắp,<br />
            đặt lịch online và thanh toán linh hoạt
          </p>
          <div className="hero-buttons">
            <button className="btn-find" onClick={() => navigate("/charging-schedule")}>
              <FaLocationDot className="icon" /> Xem Lịch Đặt
            </button>
            <button className="btn-premium" onClick={() => navigate("/premium")}>
              Gói Premium
            </button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Tính Năng Nổi Bật</h2>
          <div className="features-grid">
            {Object.keys(featuresContent).map((feature) => (
              <div key={feature} className="card" onClick={() => handleCardClick(feature)}>
                <div className="card-icon">{iconsMap[feature]}</div>
                <h3>{feature}</h3>
                <p>{featuresContent[feature].split(".")[0]}.</p>
                {activeFeature === feature && (
                  <div className="feature-detail">
                    {featuresContent[feature]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Sẵn Sàng Trải Nghiệm?</h2>
          <p>Đăng ký ngay để nhận ưu đãi sạc miễn phí lần đầu!</p>
         <button className="btn-cta" onClick={() => navigate("/staff")}>
           Đăng Ký Miễn Phí
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">@SWP Fall 2025</footer>
    </div>
  );
};

export default HomePage;
