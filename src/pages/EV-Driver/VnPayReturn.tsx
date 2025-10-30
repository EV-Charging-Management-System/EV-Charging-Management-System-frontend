import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import bookingService from '../../services/bookingService'

const VnPayReturn: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true)
        // forward the query string to backend return handler
        const res = await bookingService.verifyVnPay(location.search)
        // expecting { success: boolean, message?: string }
        if (res?.success) {
          navigate('/payment-success')
        } else {
          setMessage(res?.message || 'Payment not successful')
          // redirect to failed page after 2s
          setTimeout(() => navigate('/payment-failed'), 2000)
        }
      } catch (err: any) {
        setMessage(err?.message || 'Error verifying payment')
        setTimeout(() => navigate('/payment-failed'), 2000)
      } finally {
        setLoading(false)
      }
    }

    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ padding: 40, color: '#fff' }}>
      {loading ? <h3>Đang kiểm tra giao dịch...</h3> : <h3>{message}</h3>}
    </div>
  )
}

export default VnPayReturn
