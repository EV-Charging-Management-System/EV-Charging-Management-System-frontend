import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'
import ProfileStaff from '../../components/ProfileStaff'
import StaffSideBar from '../../pages/layouts/staffSidebar'
import locationService from '../../services/locationService'
import type { MappedStation } from '../../services/locationService'
import '../../css/Location.css'

const defaultCenter = { lat: 10.7765, lng: 106.7009 }

const Location: React.FC = () => {
  const navigate = useNavigate()
  const [showContent, setShowContent] = useState(false)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const [selectedStationId, setSelectedStationId] = useState<number | null>(null)
  const [stations, setStations] = useState<MappedStation[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDdxswSYXCcEgs8I4GJTPR82Dqpjkon1TM'
  })

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await locationService.getAllStations()

        const mappedWithFallback = data.map((station, idx) => ({
          ...station,
          lat: station.lat ?? (10.776 + (idx % 10) * 0.002),
          lng: station.lng ?? (106.700 + Math.floor(idx / 10) * 0.002)
        }))

        setStations(mappedWithFallback)
        setFetchError(null)
      } catch (error) {
        setFetchError((error as any)?.message || String(error))
      }
    }

    fetchStations()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) return <div className='map-loading'>Đang tải bản đồ trạm sạc...</div>

  const markersToShow = selectedStationId != null
    ? stations.filter((s) => s.id === selectedStationId)
    : stations

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

              {/* ===== LEFT PANEL ===== */}
              <div className='location-left-panel center-panel'>
                <h2>Danh sách Trạm sạc - TP.HCM</h2>

                <label>Chọn trạm để xem trên bản đồ:</label>
                <select
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === '') {
                      setSelectedStationId(null)
                      setMapCenter(defaultCenter)
                      return
                    }
                    const stationId = Number(val)
                    if (Number.isNaN(stationId)) return
                    setSelectedStationId(stationId)
                    const station = stations.find((s) => s.id === stationId)
                    if (station) setMapCenter({ lat: station.lat!, lng: station.lng! })
                  }}
                  value={selectedStationId ?? ''}
                >
                  <option value=''>-- Hiển thị tất cả trạm --</option>
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: 8 }}>
                  <small>Tổng số trạm đang quản lý: {stations.length}</small>
                  {fetchError && <div style={{ color: 'red' }}>Không thể tải dữ liệu trạm!</div>}
                </div>
              </div>

              {/* ===== GOOGLE MAP VIEW ===== */}
              <div className='location-right-map'>
                <GoogleMap mapContainerClassName='map-container' center={mapCenter} zoom={15}>
                  {markersToShow.map((station) => (
                    <Marker
                      key={station.id}
                      position={{ lat: station.lat!, lng: station.lng! }}
                      onClick={() => setActiveMarker(station.id)}
                      title={station.name}
                      icon={{
                        url:
                          station.id === selectedStationId
                            ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                            : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                      }}
                    >
                      {activeMarker === station.id && (
                        <InfoWindow
                          options={{ pixelOffset: new window.google.maps.Size(0, -35), maxWidth: 0 }}
                          onCloseClick={() => setActiveMarker(null)}
                        >
                          <div className='info-window'>
                            <p><strong>{station.name}</strong></p>
                            <p>📍 Địa chỉ: {station.address}</p>
                            <p>⚡ Trạng thái: {station.status}</p>
                            <button
                              onClick={() =>
                                navigate(`/staff/locationDetail/${encodeURIComponent(station.fullAddress)}`)
                              }
                            >
                              Xem chi tiết trạm
                            </button>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  ))}
                </GoogleMap>
              </div>
            </div>
          </section>
        </main>
        <footer className='footer'>EV Charging System • Staff Portal © 2025</footer>
      </div>
    </div>
  )
}

export default Location