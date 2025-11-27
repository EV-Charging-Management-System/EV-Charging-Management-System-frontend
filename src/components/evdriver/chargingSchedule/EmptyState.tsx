import React from 'react'

/**
 * Component displayed when there are no bookings
 */
export const EmptyState: React.FC = () => {
  return (
    <p className='text-center text-muted mt-5'>
      There are currently no active charging schedules.
    </p>
  )
}
