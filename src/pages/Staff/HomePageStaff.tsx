import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileStaff from '../../components/ProfileStaff'
import '../../css/HomePageStaff.css'
import StaffSideBar from '../../pages/layouts/staffSidebar'

const HomePageStaff: React.FC = () => {
  const navigate = useNavigate()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='staff-wrapper'>
      <StaffSideBar />

      {/* ===== MAIN WRAPPER ===== */}
      <div className={`staff-main-wrapper ${showContent ? 'fade-in' : 'hidden'}`}>
        {/* Google Maps iframe Background */}
        <iframe
          title='HomePage Staff Map'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.484!2d106.7009!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f!2sTP.HCM!5e0!3m2!1sen!2s!4v1690000000000'
          className='staff-map'
          allowFullScreen
          loading='lazy'
        />

        <main className="staff-main">
          {/* Header */}
          <header className='staff-header'>
            <h1>
              Optimising your journey, <span>Powering your life</span>
            </h1>
            <div className='staff-header-actions'>
              <ProfileStaff />
            </div>
          </header>

          {/* Hero */}
          <section className='staff-hero'>
            <div className='hero-content'>
              <h1 className='hi-staff-text'>Hi Staff</h1>
              <p>
                This system is built to support EV charging station management. Staff can monitor stations, track
                transactions, check charging sessions and verify user activities.
              </p>
              <button className='start-charge-btn' onClick={() => navigate('/staff/location')}>
                Bắt đầu sạc
              </button>
            </div>
          </section>
        </main>

        <footer className='footer'>
          @SWP Staff Fall 2025
        </footer>
      </div>
    </div>
  )
}

export default HomePageStaff
