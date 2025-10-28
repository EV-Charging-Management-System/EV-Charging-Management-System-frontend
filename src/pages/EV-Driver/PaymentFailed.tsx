import React from 'react'
import { Link } from 'react-router-dom'

const PaymentFailed: React.FC = () => {
  return (
    <div style={{ padding: 40, color: '#fff' }}>
      <h2>Thanh toán không thành công</h2>
      <p>Giao dịch chưa hoàn tất. Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
      <p>
        <Link to="/booking-online-station">Quay về trang trạm</Link>
      </p>
    </div>
  )
}

export default PaymentFailed
