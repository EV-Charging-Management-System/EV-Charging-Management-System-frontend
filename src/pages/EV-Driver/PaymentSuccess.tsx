import React from 'react'
import { Link } from 'react-router-dom'

const PaymentSuccess: React.FC = () => {
  return (
    <div style={{ padding: 40, color: '#fff' }}>
      <h2>Thanh toán thành công 🎉</h2>
      <p>Cảm ơn bạn, thanh toán đã được xác nhận.</p>
      <p>
        <Link to="/booking-online-station">Quay về trang trạm</Link>
      </p>
    </div>
  )
}

export default PaymentSuccess
