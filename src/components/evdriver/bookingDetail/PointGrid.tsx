import React from 'react'
import { PointCard } from './PointCard'
import type { Point } from './types'

interface PointGridProps {
  points: Point[]
  selectedPointId: number | null
  onSelectPoint: (pointId: number) => void
}

/**
 * Component hiển thị lưới các điểm sạc
 */
export const PointGrid: React.FC<PointGridProps> = ({ points, selectedPointId, onSelectPoint }) => {
  return (
    <section className='station-grid'>
      <h3>Chọn Cổng Sạc</h3>
      <div className='grid-container'>
        {points.map((point) => (
          <PointCard
            key={point.PointId}
            point={point}
            isSelected={selectedPointId === point.PointId}
            onSelect={() => onSelectPoint(point.PointId)}
          />
        ))}
      </div>
    </section>
  )
}
