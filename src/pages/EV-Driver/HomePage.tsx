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

  // 🟢 Đăng xuất
  const handleLogout = async () => {
    try {
      await authService.logout()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      alert('Logged out successfully!')
      navigate('/login')
    } catch (err) {
      console.error(err)
      alert('Logout failed!')
    }
  }

  // 🟣 Nội dung tính năng
  const featuresContent: { [key: string]: string } = {
    'Easy Station Finder': `With the easy station search feature...`,
    'Online Booking': `Online booking helps users...`,
    'Fast Charging': `Fast charging brings convenience...`,
    'Premium Package': `Premium package provides many benefits...`,
    'Postpaid Wallet': `Postpaid wallet allows users...`,
    'High Security': `High security ensures user safety...`
  }

  // 🟣 Click card
  const handleCardClick = (featureName: string) => {
    setActiveFeature(activeFeature === featureName ? null : featureName)
  }

  // 🟣 Icon mapping
  const iconsMap: { [key: string]: React.ReactNode } = {
    'Easy Station Finder': <MapPin />,
    'Online Booking': <Clock />,
    'Fast Charging': <Zap />,
    'Premium Package': <Star />,
    'Postpaid Wallet': <Wallet />,
    'High Security': <Shield />
  }

  // ===== SLIDER =====
  const images = [
    'src/assets/HomePage1.jpg',
    'src/assets/HomePage2.jpg',
    'src/assets/HomePage3.jpg',
    'src/assets/HomePage4.jpg'
  ]

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
            Smart Electric Vehicle <span className='highlight'>Charging</span>
            <br />
            Fast & Convenient
          </h1>
          <p className='description'>
            Modern EV charging station management system with a wide network,
            <br />
            online booking and flexible payment
          </p>
          <div className='hero-buttons'>
            <button className='btn-find' onClick={() => navigate('/charging-schedule')}>
              <FaLocationDot className='icon' /> View Booking
            </button>
            <button className='btn-premium' onClick={() => navigate('/premium')}>
              Premium Package
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
          <h2 className='section-title'>Highlighted Features</h2>
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
          <h2>Ready to Experience?</h2>
          <p>Sign up now to receive your first free charging!</p>
          <button className='btn-cta' onClick={() => navigate('/staff')}>
            Register for Free
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
