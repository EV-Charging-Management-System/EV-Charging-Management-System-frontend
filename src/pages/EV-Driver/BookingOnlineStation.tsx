import React, { useState } from 'react'
import '../../css//BookingOnlineStation.css'
import { useNavigate } from 'react-router-dom'
import { GoogleMap, Marker, useJsApiLoader, InfoWindow } from '@react-google-maps/api'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'

const BookingOnlineStation: React.FC = () => {
  const navigate = useNavigate()
  const [activeStation, setActiveStation] = useState<number | null>(null)

  // ===== GOOGLE MAP LOADER =====
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDdxswSYXCcEgs8I4GJTPR82Dqpjkon1TM'
  })

  // ===== DANH SÁCH TRẠM SẠC (20 trạm) =====
  const stations = [
    {
      id: 1,
      name: 'Trạm Sạc Trung Tâm Q1',
      address: '123 Nguyễn Huệ, Quận 1',
      lat: 10.776,
      lng: 106.7009,
      empty: 3,
      total: 6,
      color: 'orange'
    },
    {
      id: 2,
      name: 'Trạm Sạc Phú Mỹ Hưng',
      address: '456 Nguyễn Văn Linh, Quận 7',
      lat: 10.729,
      lng: 106.721,
      empty: 5,
      total: 6,
      color: 'green'
    },
    {
      id: 3,
      name: 'Trạm Sạc Thủ Đức',
      address: '789 Võ Văn Ngân, TP. Thủ Đức',
      lat: 10.849,
      lng: 106.771,
      empty: 4,
      total: 6,
      color: 'gray'
    },
    {
      id: 4,
      name: 'Trạm Sạc Quận 3',
      address: '12 Cách Mạng Tháng 8, Quận 3',
      lat: 10.784,
      lng: 106.688,
      empty: 2,
      total: 5,
      color: 'green'
    },
    {
      id: 5,
      name: 'Trạm Sạc Quận 4',
      address: '45 Hoàng Diệu, Quận 4',
      lat: 10.763,
      lng: 106.703,
      empty: 1,
      total: 4,
      color: 'orange'
    },
    {
      id: 6,
      name: 'Trạm Sạc Quận 5',
      address: '56 Nguyễn Trãi, Quận 5',
      lat: 10.755,
      lng: 106.665,
      empty: 3,
      total: 5,
      color: 'green'
    },
    {
      id: 7,
      name: 'Trạm Sạc Quận 6',
      address: '78 Hậu Giang, Quận 6',
      lat: 10.748,
      lng: 106.635,
      empty: 2,
      total: 5,
      color: 'gray'
    },
    {
      id: 8,
      name: 'Trạm Sạc Quận 8',
      address: '99 Phạm Thế Hiển, Quận 8',
      lat: 10.725,
      lng: 106.67,
      empty: 4,
      total: 5,
      color: 'green'
    },
    {
      id: 9,
      name: 'Trạm Sạc Quận 9',
      address: '66 Lê Văn Việt, Quận 9',
      lat: 10.84,
      lng: 106.82,
      empty: 5,
      total: 6,
      color: 'orange'
    },
    {
      id: 10,
      name: 'Trạm Sạc Bình Thạnh',
      address: '34 Điện Biên Phủ, Bình Thạnh',
      lat: 10.802,
      lng: 106.71,
      empty: 2,
      total: 5,
      color: 'gray'
    },
    {
      id: 11,
      name: 'Trạm Sạc Gò Vấp',
      address: '22 Quang Trung, Gò Vấp',
      lat: 10.835,
      lng: 106.672,
      empty: 3,
      total: 5,
      color: 'green'
    },
    {
      id: 12,
      name: 'Trạm Sạc Tân Bình',
      address: '10 Cộng Hòa, Tân Bình',
      lat: 10.801,
      lng: 106.652,
      empty: 4,
      total: 5,
      color: 'orange'
    },
    {
      id: 13,
      name: 'Trạm Sạc Tân Phú',
      address: '98 Lũy Bán Bích, Tân Phú',
      lat: 10.79,
      lng: 106.63,
      empty: 3,
      total: 5,
      color: 'green'
    },
    {
      id: 14,
      name: 'Trạm Sạc Bình Tân',
      address: '65 Kinh Dương Vương, Bình Tân',
      lat: 10.75,
      lng: 106.61,
      empty: 2,
      total: 5,
      color: 'gray'
    },
    {
      id: 15,
      name: 'Trạm Sạc Nhà Bè',
      address: '88 Nguyễn Hữu Thọ, Nhà Bè',
      lat: 10.7,
      lng: 106.72,
      empty: 3,
      total: 5,
      color: 'orange'
    },
    {
      id: 16,
      name: 'Trạm Sạc Củ Chi',
      address: '45 Tỉnh Lộ 8, Củ Chi',
      lat: 10.97,
      lng: 106.49,
      empty: 5,
      total: 5,
      color: 'green'
    },
    {
      id: 17,
      name: 'Trạm Sạc Hóc Môn',
      address: '77 Nguyễn Ảnh Thủ, Hóc Môn',
      lat: 10.88,
      lng: 106.62,
      empty: 3,
      total: 5,
      color: 'gray'
    },
    {
      id: 18,
      name: 'Trạm Sạc Bình Chánh',
      address: '12 Quốc Lộ 1A, Bình Chánh',
      lat: 10.74,
      lng: 106.57,
      empty: 4,
      total: 6,
      color: 'orange'
    },
    {
      id: 19,
      name: 'Trạm Sạc Cần Giờ',
      address: '1 Đường Duyên Hải, Cần Giờ',
      lat: 10.41,
      lng: 106.96,
      empty: 2,
      total: 4,
      color: 'gray'
    },
    {
      id: 20,
      name: 'Trạm Sạc Quận 10',
      address: '120 Thành Thái, Quận 10',
      lat: 10.77,
      lng: 106.67,
      empty: 3,
      total: 5,
      color: 'green'
    }
  ]

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
