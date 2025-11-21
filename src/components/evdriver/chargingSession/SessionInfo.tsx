import React, { useEffect, useState } from 'react'
import { FaInfoCircle, FaClock } from 'react-icons/fa'
import type { Booking } from './types'
import bookingService from '../../../services/bookingService'

interface SessionInfoProps {
  booking?: Booking
  bookingData?: any
  battery: number
  time: number
  cost: number
  isCharging: boolean
  penaltyMinutes: number
}

/**
 * Component hiển thị thông tin sạc và thời gian/chi phí
 */
export const SessionInfo: React.FC<SessionInfoProps> = ({ booking, bookingData, battery, time, cost, isCharging, penaltyMinutes }) => {
  const [portTypeOfKwh, setPortTypeOfKwh] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPortDetails = async () => {
      // Lấy portId từ bookingData hoặc booking
      const portId = bookingData?.PortId || booking?.portId
      
      if (!portId) {
        console.warn('⚠️ Không có portId để lấy thông tin công suất')
        return
      }

      try {
        setLoading(true)
        const portData = await bookingService.getPortById(portId)
        console.log('📦 [SessionInfo] Port data loaded:', portData)
        setPortTypeOfKwh(portData.PortTypeOfKwh || null)
      } catch (error) {
        console.error('❌ Không thể tải thông tin cổng sạc:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPortDetails()
  }, [bookingData, booking?.portId])

  return (
    <div className='session-info'>
      <div className='info-box'>
        <h3>
          <FaInfoCircle /> Thông Tin Sạc
        </h3>
        <p>
          Mức pin hiện tại: <strong>{battery}%</strong>
        </p>
        <p>
          Năng lượng tiêu thụ: <strong>{Math.max(0, (battery - 45) * 0.2).toFixed(2)} kWh</strong>
        </p>
      
      </div>

      <div className='info-box'>
        <h3>
          <FaClock /> Thời Gian & Chi Phí
        </h3>
        <p>
          Thời gian sạc: <strong>{time} phút</strong>
        </p>
        {/* <p>
          Chi phí sạc: <strong>{cost.toLocaleString()}đ</strong>
        </p> */}
        {battery >= 100 && isCharging && (
          <>
            <p className='overtime-fee'>⚠️ Phí quá giờ: +5.000đ/giây</p>
            <p className='penalty-warning' style={{ color: '#ff4444', fontWeight: 'bold' }}>
              🚨 Đã áp dụng phí phạt: {penaltyMinutes} giây x 5.000đ = {(penaltyMinutes * 5000).toLocaleString()}đ
            </p>
          </>
        )}
      </div>
    </div>
  )
}
