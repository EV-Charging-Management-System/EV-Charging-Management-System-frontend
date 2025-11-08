import React from 'react'
import type { Booking } from './types'

interface SessionHeaderProps {
  booking?: Booking
  status: 'waiting' | 'running' | 'done'
}

/**
 * Component header với title và status
 */
export const SessionHeader: React.FC<SessionHeaderProps> = ({ booking, status }) => {
  const statusText = status === 'done' ? 'Đã hoàn tất' : status === 'running' ? 'Đang sạc' : 'Đang chờ sạc'
  const statusClass = status

  return (
    <div className='session-header'>
      <div>
        <h1 className='session-title'>Phiên Sạc</h1>
        <p className='session-subtitle'>{booking ? booking.stationName : 'Trạm Sạc Trung Tâm Quận 1'}</p>
      </div>

      <div className='status-container'>
        <div className={`status-pill ${statusClass}`}>{statusText}</div>
      </div>
    </div>
  )
}
