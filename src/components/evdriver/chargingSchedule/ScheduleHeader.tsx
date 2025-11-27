import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

/**
 * Header component with title and new booking button
 */
export const ScheduleHeader: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='d-flex justify-content-between align-items-center mb-4'>
      <div>
        <h2 className='fw-bold text-warning mb-1'>Charging Schedule</h2>
        <p className='text-secondary'>Monitor and manage your charging bookings</p>
      </div>
      <Button variant='warning' onClick={() => navigate('/booking-online-station')}>
        + New Booking
      </Button>
    </div>
  )
}
