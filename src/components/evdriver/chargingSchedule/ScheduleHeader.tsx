import React from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

/**
 * Component header với title và nút đặt lịch mới
 */
export const ScheduleHeader: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='d-flex justify-content-between align-items-center mb-4'>
      <div>
        <h2 className='fw-bold text-warning mb-1'>Lịch Đặt Sạc</h2>
        <p className='text-secondary'>Theo dõi và quản lý lịch đặt sạc của bạn</p>
      </div>
      <Button variant='warning' onClick={() => navigate('/booking-online-station')}>
        + Đặt Lịch Mới
      </Button>
    </div>
  )
}
