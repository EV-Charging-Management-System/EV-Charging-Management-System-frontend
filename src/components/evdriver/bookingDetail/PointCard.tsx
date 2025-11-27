import React from 'react'
import type { Point } from './types'

interface PointCardProps {
  point: Point
  isSelected: boolean
  onSelect: () => void
}

/**
 * Card component for each charging point
 */
export const PointCard: React.FC<PointCardProps> = ({ point, isSelected, onSelect }) => {
  const status = (point.ChargingPointStatus || '').toUpperCase()
  const isAvailable = status === 'AVAILABLE'
  const cls = isAvailable ? 'available' : 'booked'

  return (
    <div
      className={`station-box ${cls} ${isSelected ? 'active' : ''}`}
      onClick={() => {
        if (!isAvailable) return
        onSelect()
      }}
      style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
    >
      <h4>#{point.PointId}</h4>
      <p>{isAvailable ? "Available" : "Booked / Maintenance"}</p>
    </div>
  )
}
