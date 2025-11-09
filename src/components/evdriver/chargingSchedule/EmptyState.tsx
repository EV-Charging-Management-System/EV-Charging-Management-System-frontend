import React from 'react'

/**
 * Component hiển thị khi không có booking nào
 */
export const EmptyState: React.FC = () => {
  return (
    <p className='text-center text-muted mt-5'>
      Hiện chưa có lịch sạc nào đang hoạt động.
    </p>
  )
}
