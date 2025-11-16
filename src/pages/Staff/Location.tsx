import React, { useState, useEffect } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import ProfileStaff from '../../components/ProfileStaff'
import StaffSideBar from '../../pages/layouts/staffSidebar'
import { StationSelector, StationMap, useStations } from '../../components/staff/location'
import '../../css/Location.css'

const Location: React.FC = () => {
  const [showContent, setShowContent] = useState(false)
  const {
    stations,
    mapCenter,
    activeMarker,
    selectedStationId,
    fetchError,
    setActiveMarker,
    handleStationSelect,
  } = useStations()

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDdxswSYXCcEgs8I4GJTPR82Dqpjkon1TM'
  })

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (loadError) return <div style={{ color: 'red' }}>Không thể tải Google Maps</div>
  if (!isLoaded) return <div className='map-loading'>Đang tải bản đồ trạm sạc...</div>

  return (
    <div className='location-wrapper'>
      <StaffSideBar />
      <div className={`location-main-wrapper ${showContent ? 'fade-in' : 'hidden'}`}>
        <main className='location-main'>
          <header className='location-header'>
            <h1>Quản lý vị trí trạm sạc</h1>
            <div className='location-header-actions'>
              <ProfileStaff />
            </div>
          </header>

          <section className='location-body'>
            <div className='location-map-container'>
              <StationSelector
                stations={stations}
                selectedStationId={selectedStationId}
                fetchError={fetchError}
                onStationSelect={handleStationSelect}
              />

              <StationMap
                stations={stations}
                mapCenter={mapCenter}
                activeMarker={activeMarker}
                selectedStationId={selectedStationId}
                onMarkerClick={setActiveMarker}
                onInfoWindowClose={() => setActiveMarker(null)}
              />
            </div>
          </section>
        </main>
        <footer className='footer'>EV Charging System • Staff Portal © 2025</footer>
      </div>
    </div>
  )
}

export default Location
