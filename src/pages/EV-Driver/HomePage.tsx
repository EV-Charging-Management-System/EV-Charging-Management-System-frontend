import React, { useState, useEffect } from 'react'
import '../../css/HomePage.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { FaLocationDot } from 'react-icons/fa6'
import { MapPin, Clock, Zap, Star, Wallet, Shield } from 'lucide-react'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'

const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleLogout = async () => {
    try {
      await authService.logout()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      alert('Đăng xuất thành công!')
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Logout thất bại!')
    }
  }

  const featuresContent: { [key: string]: string } = {
    'Tìm Trạm Dễ Dàng': `Với tính năng tìm trạm dễ dàng...`,
    'Đặt Lịch Online': `Đặt lịch online giúp người dùng...`,
    'Sạc Nhanh': `Tính năng sạc nhanh mang lại...`,
    'Gói Premium': `Gói Premium mang lại nhiều quyền lợi...`,
    'Ví Trả Sau': `Ví trả sau cho phép người dùng...`,
    'Bảo Mật Cao': `Tính năng bảo mật cao đảm bảo...`
  }

  const handleCardClick = (featureName: string) => {
    setActiveFeature(activeFeature === featureName ? null : featureName)
  }

  const iconsMap: { [key: string]: React.ReactNode } = {
    'Tìm Trạm Dễ Dàng': <MapPin />,
    'Đặt Lịch Online': <Clock />,
    'Sạc Nhanh': <Zap />,
    'Gói Premium': <Star />,
    'Ví Trả Sau': <Wallet />,
    'Bảo Mật Cao': <Shield />
  }

  // ===== SLIDER =====
  const images = ['/HomePage1.jpg', '/HomePage2.jpg', '/HomePage3.jpg', '/HomePage4.jpg']

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // ===== JSX GỐC + SLIDER DƯỚI HERO =====
  return (
    <div className='home-container'>
      <Header />

      <MenuBar />

      {/* Hero Section */}
      <main className='main-content'>
        <div className='hero-text'>
          <h1>
            Sạc Xe Điện <span className='highlight'>Thông Minh</span>
            <br />
            Nhanh Chóng & Tiện Lợi
          </h1>
          <p className='description'>
            Hệ thống quản lý trạm sạc xe điện hiện đại với mạng lưới rộng khắp,
            <br />
            đặt lịch online và thanh toán linh hoạt
          </p>
          <div className='hero-buttons'>
            <button className='btn-find' onClick={() => navigate('/charging-schedule')}>
              <FaLocationDot className='icon' /> Xem Lịch Đặt
            </button>
            <button className='btn-premium' onClick={() => navigate('/premium')}>
              Gói Premium
            </button>
          </div>
        </div>
      </main>

      {/* SLIDER NGAY DƯỚI HERO */}
      <section className='slider-section'>
        {images.map((img, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img})` }}
          ></div>
        ))}
        <button className='slider-btn prev' onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <button className='slider-btn next' onClick={nextSlide}>
          <FaChevronRight />
        </button>
      </section>

      {/* Features Section */}
      <section className='features-section'>
        <div className='container'>
          <h2 className='section-title'>Tính Năng Nổi Bật</h2>
          <div className='features-grid'>
            {Object.keys(featuresContent).map((feature) => (
              <div key={feature} className='card' onClick={() => handleCardClick(feature)}>
                <div className='card-icon'>{iconsMap[feature]}</div>
                <h3>{feature}</h3>
                <p>{featuresContent[feature].split('.')[0]}.</p>
                {activeFeature === feature && <div className='feature-detail'>{featuresContent[feature]}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='cta-section'>
        <div className='cta-box'>
          <h2>Sẵn Sàng Trải Nghiệm?</h2>
          <p>Đăng ký ngay để nhận ưu đãi sạc miễn phí lần đầu!</p>
          <button className='btn-cta' onClick={() => navigate('/staff')}>
            Đăng Ký Miễn Phí
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
