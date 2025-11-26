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
 * Component displaying charging info, time, and cost
 */
export const SessionInfo: React.FC<SessionInfoProps> = ({
  booking,
  bookingData,
  battery,
  time,
  cost,
  isCharging,
  penaltyMinutes
}) => {
  const [portTypeOfKwh, setPortTypeOfKwh] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPortDetails = async () => {
      const portId = bookingData?.PortId || booking?.portId

      if (!portId) {
        console.warn('⚠️ No portId available to load power information')
        return
      }

      try {
        setLoading(true)
        const portData = await bookingService.getPortById(portId)
        console.log('📦 [SessionInfo] Port data loaded:', portData)
        setPortTypeOfKwh(portData.PortTypeOfKwh || null)
      } catch (error) {
        console.error('❌ Unable to load charging port information:', error)
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
          <FaInfoCircle /> Charging Information
        </h3>

        <p>
          Current battery level: <strong>{battery}%</strong>
        </p>

        <p>
          Energy consumed:{' '}
          <strong>{Math.max(0, (battery - 45) * 0.2).toFixed(2)} kWh</strong>
        </p>

        <p>
          Power:{' '}
          <strong>
            {loading
              ? 'Loading...'
              : portTypeOfKwh
              ? `${portTypeOfKwh} kW`
              : booking?.power || '80 kW'}
          </strong>
        </p>
      </div>

      <div className='info-box'>
        <h3>
          <FaClock /> Time & Cost
        </h3>

        <p>
          Charging time: <strong>{time} minutes</strong>
        </p>

        {/* Penalty when fully charged but still occupying the station */}
        {battery >= 100 && isCharging && (
          <>
            <p className='overtime-fee'>⚠️ Overtime fee: +5,000đ/second</p>
            <p
              className='penalty-warning'
              style={{ color: '#ff4444', fontWeight: 'bold' }}
            >
              🚨 Penalty applied: {penaltyMinutes} sec x 5,000đ ={' '}
              {(penaltyMinutes * 5000).toLocaleString()}đ
            </p>
          </>
        )}
      </div>
    </div>
  )
}
