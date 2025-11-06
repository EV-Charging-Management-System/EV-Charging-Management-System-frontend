

import React, { useState, useEffect } from 'react'
import '../../css//BookingOnlineStation.css'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'
import { authService } from '../../services/authService'
import bookingService from "../../services/bookingService";

const BookingOnlineStation: React.FC = () => {
  const navigate = useNavigate()
  const [activeStation, setActiveStation] = useState<number | null>(null)
  const [currentUser, setCurrentUser] = useState<any | null>(null)

  // ===== GOOGLE MAP LOADER =====
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDdxswSYXCcEgs8I4GJTPR82Dqpjkon1TM'
  })

  // ===== DANH SÁCH TRẠM SẠC (lấy từ BE) =====
  const [stations, setStations] = useState<Array<any>>([])
  const [loadingStations, setLoadingStations] = useState(false)
  const [stationsError, setStationsError] = useState<string | null>(null)

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

  useEffect(() => {
    let mounted = true
    const fetchStations = async () => {
      setLoadingStations(true)
      setStationsError(null)
      try {
        const data = await bookingService.getAllStations()
        // Map backend response to UI fields if necessary
        const mapped = (data || []).map((s: any, idx: number) => {
          const id = s.StationId ?? s.id ?? idx + 1
          const name = s.StationName ?? s.name ?? 'Trạm Sạc'
          const address = s.Address ?? s.address ?? ''
          const total = s.ChargingPointTotal ?? s.total ?? 4
          const empty = s.AvailableSlots ?? s.empty ?? Math.max(0, Math.floor(total * 0.5))

          let lat = s.Latitude ?? s.lat
          let lng = s.Longitude ?? s.lng
          if (!lat || !lng) {
            // fallback coordinates nearby center
            const offset = (idx % 10) * 0.002
            lat = 10.776 + offset
            lng = 106.7 + Math.floor(idx / 10) * 0.002
          }

          const status = (s.StationStatus || '').toLowerCase()
          const color = status.includes('active') ? 'green' : status.includes('maint') ? 'gray' : 'orange'

          return {
            id,
            name,
            address,
            lat: Number(lat),
            lng: Number(lng),
            empty,
            total,
            color,
            raw: s,
          }
        })

        if (mounted) setStations(mapped)
      } catch (err: any) {
        console.error('Failed to load stations', err)
        if (mounted) setStationsError(err?.message || 'Không thể lấy danh sách trạm')
      } finally {
        if (mounted) setLoadingStations(false)
      }
    }

    fetchStations()
    return () => {
      mounted = false
    }
  }, [])

  const center = { lat: 10.776, lng: 106.7 }

  const mapOptions = {
    styles: [
      {
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{ color: '#333333' }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#f5f5f5' }]
      },
      {
        featureType: 'water',
        stylers: [{ color: '#a0d3ff' }]
      },
      {
        featureType: 'road',
        stylers: [{ color: '#e0e0e0' }]
      }
    ]
  }

  return (
    <div className='booking-container'>
      <Header />

      <MenuBar />

      {/* ===== BODY ===== */}
      <main className='booking-body'>
        <h1 className='booking-title'>Booking Online Station</h1>
        <p className='booking-subtitle'>Chọn trạm sạc gần bạn và đặt lịch ngay</p>
        {currentUser && (
          <div className='user-greeting' style={{ color: '#7cffb2', marginBottom: 8 }}>
            Xin chào, {currentUser.fullName || currentUser.fullname || currentUser.email}
          </div>
        )}

        <div className='station-layout'>
          {/* ==== MAP SECTION ==== */}
          <div className='map-section'>
            {isLoaded ? (
              <GoogleMap center={center} zoom={11.5} options={mapOptions} mapContainerClassName='booking-map-container'>
                {stations.map((s) => (
                  <Marker
                    key={s.id}
                    position={{ lat: s.lat, lng: s.lng }}
                    onClick={() => setActiveStation(s.id)}
                    icon={{
                      url:
                        s.color === 'green'
                          ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                          : s.color === 'orange'
                            ? 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                            : 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png'
                    }}
                  />
                ))}

                {activeStation && (
                  <InfoWindow
                    position={{
                      lat: stations.find((s) => s.id === activeStation)?.lat || center.lat,
                      lng: stations.find((s) => s.id === activeStation)?.lng || center.lng
                    }}
                    onCloseClick={() => setActiveStation(null)}
                  >
                    <div className='station-popup'>
                      <h3 className='station-popup-title'>{stations.find((s) => s.id === activeStation)?.name}</h3>
                      <p className='station-popup-address'>{stations.find((s) => s.id === activeStation)?.address}</p>
                      <p className='station-popup-info'>
                        Số trống: {stations.find((s) => s.id === activeStation)?.empty}/
                        {stations.find((s) => s.id === activeStation)?.total}
                      </p>
                      <button className='detail-btn' onClick={() => navigate(`/booking-detail/${activeStation}`)}>
                        Xem Chi Tiết & Đặt Lịch
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div>Đang tải bản đồ...</div>
            )}
          </div>

          {/* ==== STATION LIST ==== */}
          <div className='station-list-section'>
            <h2 className='station-header'>Trạm Sạc Gần Bạn</h2>
            <button className='location-btn' onClick={() => navigate('/charging-schedule')}>
              📍 Xem Lịch Đặt
            </button>

            <div className='station-scroll'>
              {stations.map((s) => (
                <div
                  key={s.id}
                  className={`station-card ${activeStation === s.id ? 'station-card-active' : ''}`}
                  onMouseEnter={() => setActiveStation(s.id)}
                  onMouseLeave={() => setActiveStation(null)}
                >
                  <div className='station-info'>
                    <h3>{s.name}</h3>
                    <p className='address'>📍 {s.address}</p>
                    <div className='progress-bar'>
                      <div
                        className='progress-fill'
                        style={{
                          width: `${(s.empty / s.total) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className='station-footer'>
                    <span className='empty-count'>
                      {s.empty}/{s.total} trống
                    </span>
                    <button className='detail-btn' onClick={() => navigate(`/booking-detail/${s.id}`)}>
                      Xem Chi Tiết & Đặt Lịch
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default BookingOnlineStation




