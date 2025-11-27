import React from 'react'
import type { Booking } from './types'

interface SessionHeaderProps {
  booking?: Booking
  status: 'waiting' | 'running' | 'done'
}

/**
 * Header component with title and status
 */
export const SessionHeader: React.FC<SessionHeaderProps> = ({ booking, status }) => {
  const statusText = status === 'done' ? 'Completed' : status === 'running' ? 'Charging' : 'Waiting to charge'
  const statusClass = status

  return (
    <div className='session-header'>
      <div>
        <h1 className='session-title'>Charging Session</h1>
        <p className='session-subtitle'>{booking ? booking.stationName : 'Trạm Sạc Trung Tâm Quận 1'}</p>
      </div>

      <div className='status-container'>
        <div className={`status-pill ${statusClass}`}>{statusText}</div>
      </div>
    </div>
  )
}
