import React from 'react'
import { FaDollarSign } from 'react-icons/fa'

interface PaymentBoxProps {
  cost: number
}

/**
 * Payment box component when a session is completed
 */
export const PaymentBox: React.FC<PaymentBoxProps> = ({ cost }) => {
  return (
    <div className='payment-box'>
      <h3>
        <FaDollarSign /> Completed
      </h3>
      <p>The charging session has finished. The invoice will be paid via the postpaid wallet.</p>

      <div className='payment-total'>
        Total Cost: <strong>{cost.toLocaleString()}đ</strong>
      </div>
    </div>
  )
}
