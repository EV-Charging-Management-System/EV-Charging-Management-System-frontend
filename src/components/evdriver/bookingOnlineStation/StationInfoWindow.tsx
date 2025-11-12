import React from 'react'
import { InfoWindow } from '@react-google-maps/api'
import { useNavigate } from 'react-router-dom'
import type { StationData } from './types'

interface StationInfoWindowProps {
  station: StationData
  onClose: () => void
}

/**
 * Component hiển thị InfoWindow khi click vào marker trên map
 */
export const StationInfoWindow: React.FC<StationInfoWindowProps> = ({ station, onClose }) => {
  const navigate = useNavigate()

  return (
    <InfoWindow position={{ lat: station.lat, lng: station.lng }} onCloseClick={onClose}>
      <div className='station-popup'>
        <h3 className='station-popup-title'>{station.name}</h3>
        <p className='station-popup-address'>{station.address}</p>
        <p className='station-popup-info'>
          Số trống: {station.empty}/{station.total}
        </p>
        <button className='detail-btn' onClick={() => navigate(`/booking-detail/${station.id}`)}>
          Xem Chi Tiết & Đặt Lịch
        </button>
      </div>
    </InfoWindow>
  )
}
