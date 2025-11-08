import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { StationData } from './types'

interface StationCardProps {
  station: StationData
  isActive: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
}

/**
 * Component hiển thị thông tin 1 trạm sạc dạng card
 */
export const StationCard: React.FC<StationCardProps> = ({ station, isActive, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate()

  return (
    <div
      className={`station-card ${isActive ? 'station-card-active' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='station-info'>
        <h3>{station.name}</h3>
        <p className='address'>📍 {station.address}</p>
        <div className='progress-bar'>
          <div
            className='progress-fill'
            style={{
              width: `${(station.empty / station.total) * 100}%`
            }}
          ></div>
        </div>
      </div>

      <div className='station-footer'>
        <span className='empty-count'>
          {station.empty}/{station.total} trống
        </span>
        <button className='detail-btn' onClick={() => navigate(`/booking-detail/${station.id}`)}>
          Xem Chi Tiết & Đặt Lịch
        </button>
      </div>
    </div>
  )
}
