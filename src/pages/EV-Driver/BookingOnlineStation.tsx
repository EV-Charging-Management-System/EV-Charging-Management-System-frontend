

import React, { useState, useEffect } from 'react'
import '../../css//BookingOnlineStation.css'
import { useJsApiLoader } from '@react-google-maps/api'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'
import { authService } from '../../services/authService'
import { MapSection, StationList, PageHeader, useStations } from '../../components/evdriver/bookingOnlineStation'

const BookingOnlineStation: React.FC = () => {
  const [activeStation, setActiveStation] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<any | null>(null)

  // ===== GOOGLE MAP LOADER =====
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDdxswSYXCcEgs8I4GJTPR82Dqpjkon1TM'
  })

  // ===== DANH SÁCH TRẠM SẠC (sử dụng custom hook) =====
  const { stations, loadingStations, stationsError } = useStations()

  // ===== LẤY THÔNG TIN USER =====
  useEffect(() => {
    let mountedUser = true
    const fetchUser = async () => {
      try {
        const u = await authService.getProfile()
        if (mountedUser) setCurrentUser(u)
      } catch (e) {
        // ignore
      }
    }
    fetchUser()
    return () => {
      mountedUser = false
    }
  }, [])

  const center = { lat: 10.776, lng: 106.7 }

  return (
    <div className='booking-container'>
      <Header />
      <MenuBar />

      {/* ===== BODY ===== */}
      <main className='booking-body'>
        <PageHeader currentUser={currentUser} />

        <div className='station-layout'>
          {/* ==== MAP SECTION ==== */}
          <MapSection
            isLoaded={isLoaded}
            center={center}
            stations={stations}
            activeStation={activeStation}
            onMarkerClick={setActiveStation}
            onInfoWindowClose={() => setActiveStation(null)}
          />

          {/* ==== STATION LIST ==== */}
          <StationList stations={stations} activeStation={activeStation} onStationHover={setActiveStation} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BookingOnlineStation




