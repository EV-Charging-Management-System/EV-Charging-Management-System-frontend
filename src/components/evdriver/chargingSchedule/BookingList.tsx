import React from 'react'
import { Spinner } from 'react-bootstrap'
import { BookingCard } from './BookingCard'
import { EmptyState } from './EmptyState'
import type { FormattedBooking } from './types'

interface BookingListProps {
  bookings: FormattedBooking[]
  loading: boolean
  onStartCharging: (booking: FormattedBooking) => void
}

/**
 * Component hiển thị danh sách bookings với loading và empty state
 */
export const BookingList: React.FC<BookingListProps> = ({ bookings, loading, onStartCharging }) => {
  if (loading) {
    return (
      <div className='text-center mt-5'>
        <Spinner animation='border' variant='warning' />
        <p className='mt-2'>Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return <EmptyState />
  }

  return (
    <>
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} onStartCharging={onStartCharging} />
      ))}
    </>
  )
}
