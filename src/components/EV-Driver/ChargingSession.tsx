import React, { useEffect, useState } from 'react'
import '../../css//ChargingSession.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaInfoCircle, FaClock, FaDollarSign } from 'react-icons/fa'
import Header from '../../components/layouts/header'
import Footer from '../../components/layouts/footer'
interface Booking {
  id?: number
  stationName: string
  address?: string
  port: string
  power: string
  code: string
}

const ChargingSession: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const booking: Booking | undefined = location.state?.booking

  const [battery, setBattery] = useState<number>(45)
  const [time, setTime] = useState<number>(0)
  const [cost, setCost] = useState<number>(0)
  const [isCharging, setIsCharging] = useState<boolean>(false)
  const [finished, setFinished] = useState<boolean>(false)

  const [startTimestamp, setStartTimestamp] = useState<string | null>(null)

  useEffect(() => {
    let interval: number | null = null

    if (isCharging && !finished) {
      interval = window.setInterval(() => {
        setTime((prev) => prev + 1)
        setBattery((prev) => (prev < 100 ? prev + 1 : prev))
        setCost((prev) => {
          if (battery < 100) return prev + 10000
          else return prev + 12000
        })
      }, 1000)
    }

    return () => {
      if (interval) window.clearInterval(interval)
    }
  }, [isCharging, finished, battery])

  const handleStart = () => {
    setIsCharging(true)
    setStartTimestamp(new Date().toISOString())
  }

  const handleStop = () => {
    setIsCharging(false)
    setFinished(true)
  }

  const handleNavigateToPay = () => {
    const kwh = Math.max(0, (battery - 45) * 0.2)
    const endTimestamp = new Date().toISOString()

    const payload = {
      totalCost: cost,
      stationName: booking?.stationName || 'Trạm Sạc',
      address: booking?.address || '',
      port: booking?.port || '',
      power: booking?.power || '',
      code: booking?.code || '',
      durationMinutes: time,
      kwh,
      startTime: startTimestamp || endTimestamp,
      endTime: endTimestamp
    }

    navigate('/Pay', { state: payload })
  }

  const statusText = finished ? 'Đã hoàn tất' : isCharging ? 'Đang sạc' : 'Đang chờ sạc'
  const statusClass = finished ? 'done' : isCharging ? 'running' : 'waiting'

  return (
    <div className='session-container'>
      <Header />

      <main className='session-body'>
        <div className='session-header'>
          <div>
            <h1 className='session-title'>Phiên Sạc</h1>
            <p className='session-subtitle'>{booking ? booking.stationName : 'Trạm Sạc Trung Tâm Quận 1'}</p>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <div className={`status-pill ${statusClass}`}>{statusText}</div>
          </div>
        </div>

        <div className='charging-card'>
          <div className='top-line'>
            <p className='port-info-text'>
              Cổng {booking?.port || 'M'} – {booking?.power || '80kW'} – Mã:{' '}
              <strong>{booking?.code || 'ABC123'}</strong>
            </p>
          </div>

          {/* ✅ Thanh pin đã sửa đúng yêu cầu */}
          <div className='charge-progress'>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${battery}%` }} />
            </div>
            <span className='battery-level'>{battery}%</span>

            <div
              style={{
                marginTop: 20,
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {!isCharging && !finished && (
                <button className='start-btn' onClick={handleStart}>
                  ⚡ Bắt đầu sạc
                </button>
              )}

              {isCharging && !finished && (
                <button className='stop-btn' onClick={handleStop}>
                  ⏹️ Dừng phiên sạc
                </button>
              )}

              {finished && <span className='finished-text'>✅ Đã sạc xong</span>}
            </div>
          </div>

          <div className='session-info'>
            <div className='info-box'>
              <h3>
                <FaInfoCircle /> Thông Tin Sạc
              </h3>
              <p>
                Mức pin hiện tại: <strong>{battery}%</strong>
              </p>
              <p>
                Năng lượng tiêu thụ: <strong>{Math.max(0, (battery - 45) * 0.2)} kWh</strong>
              </p>
              <p>
                Công suất: <strong>{booking?.power || '80 kW'}</strong>
              </p>
            </div>

            <div className='info-box'>
              <h3>
                <FaClock /> Thời Gian & Chi Phí
              </h3>
              <p>
                Thời gian sạc: <strong>{time} phút</strong>
              </p>
              <p>
                Chi phí sạc: <strong>{cost.toLocaleString()}đ</strong>
              </p>
              {battery >= 100 && isCharging && <p style={{ color: 'red' }}>Phí quá giờ: +12.000đ/phút</p>}
            </div>
          </div>

          {finished && (
            <div className='payment-box'>
              <h3>
                <FaDollarSign /> Thanh Toán
              </h3>
              <p>Vui lòng thanh toán để hoàn tất phiên sạc</p>
              <div className='payment-total'>
                Tổng thanh toán: <strong>{cost.toLocaleString()}đ</strong>
              </div>
              <button className='pay-btn' onClick={handleNavigateToPay}>
                Thanh Toán Ngay
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ChargingSession
