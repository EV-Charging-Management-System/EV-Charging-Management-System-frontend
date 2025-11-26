import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StationCard } from './StationCard'
import type { StationData } from './types'

interface StationListProps {
  stations: StationData[]
  activeStation: number | null
  onStationHover: (stationId: number | null) => void
}

/**
 * Component hiển thị danh sách các trạm sạc
 */
export const StationList: React.FC<StationListProps> = ({ stations, activeStation, onStationHover }) => {
  const navigate = useNavigate()

  return (
    <div className='station-list-section'>
      <h2 className='station-header'>Nearby Charging Stations</h2>
      <button className='location-btn' onClick={() => navigate('/charging-schedule')}>
        📍 View Booking Schedule
      </button>

      <div className='station-scroll'>
        {stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            isActive={activeStation === station.id}
            onMouseEnter={() => onStationHover(station.id)}
            onMouseLeave={() => onStationHover(null)}
          />
        ))}
      </div>
    </div>
  )
}
