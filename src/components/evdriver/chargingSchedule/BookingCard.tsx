import React from 'react'
import { Card, Button, Badge } from 'react-bootstrap'
import { FaCalendarAlt, FaCar, FaMoneyBill, FaHashtag, FaMapMarkerAlt } from 'react-icons/fa'
import type { FormattedBooking } from './types'

interface BookingCardProps {
  booking: FormattedBooking
  onStartCharging: (booking: FormattedBooking) => void
}

/**
 * Component card hiển thị thông tin 1 booking
 */
export const BookingCard: React.FC<BookingCardProps> = ({ booking, onStartCharging }) => {
  return (
    <Card className='mb-4 shadow-sm bg-secondary bg-opacity-10 border border-warning'>
      <Card.Body className='d-flex justify-content-between flex-wrap'>
        <div>
          <Card.Title className='text-warning mb-3'>
            <FaMapMarkerAlt className='me-2' />
            {booking.stationName}
          </Card.Title>

          <p className='mb-1'>
            <FaCalendarAlt className='me-2' /> {booking.startTime}
          </p>

          <p className='mb-1'>
            <FaCar className='me-2' /> {booking.vehicle} – {booking.plate}
          </p>

          <p className='mb-1'>
            <FaMoneyBill className='me-2' /> {booking.deposit}
          </p>

          <p className='mb-0'>
            <FaHashtag className='me-2' /> Mã đặt: <strong>#{booking.qr}</strong>
          </p>
        </div>

        <div className='text-end mt-3 mt-md-0'>
          <Badge bg='success' text='light' className='mb-2'>
            {booking.status}
          </Badge>

          <div className='d-flex gap-2 justify-content-end'>
            <Button size='sm' variant='warning' onClick={() => onStartCharging(booking)}>
              Bắt đầu sạc
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
