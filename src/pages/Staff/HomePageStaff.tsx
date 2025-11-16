import React, { useState, useEffect } from 'react'
import '../../css/HomePageStaff.css'
import StaffSideBar from '../../pages/layouts/staffSidebar'
import { PageHeader, HeroSection, MapBackground, Footer } from '../../components/staff/homePageStaff'

const HomePageStaff: React.FC = () => {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='staff-wrapper'>
      <StaffSideBar />

      <div className={`staff-main-wrapper ${showContent ? 'fade-in' : 'hidden'}`}>
        <MapBackground />

        <main className="staff-main">
          <PageHeader 
            title="Optimising your journey," 
            subtitle="Powering your life" 
          />
          <HeroSection />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default HomePageStaff
