import React from 'react'
import { FaDollarSign } from 'react-icons/fa'

interface PaymentBoxProps {
  cost: number
}

/**
 * Component payment box khi hoàn tất
 */
export const PaymentBox: React.FC<PaymentBoxProps> = ({ cost }) => {
  return (
    <div className='payment-box'>
      <h3>
        <FaDollarSign /> Hoàn Tất
      </h3>
      <p>Phiên sạc đã hoàn tất. Hóa đơn sẽ được thanh toán qua ví trả sau.</p>
      <div className='payment-total'>
        Tổng chi phí: <strong>{cost.toLocaleString()}đ</strong>
      </div>
    </div>
  )
}
