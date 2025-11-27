import React from 'react'

interface PageHeaderProps {
  currentUser: any | null
}

/**
 * Component hiển thị header của trang booking
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ currentUser }) => {
  return (
    <div>
      <h1 className='booking-title'>Booking Online Station</h1>
      <p className='booking-subtitle'>“Choose a charging station near you and book now”</p>
      {currentUser && (
        <div className='user-greeting' style={{ color: '#7cffb2', marginBottom: 8 }}>
          Hello, {currentUser.fullName || currentUser.fullname || currentUser.email}
        </div>
      )}
    </div>
  )
}
