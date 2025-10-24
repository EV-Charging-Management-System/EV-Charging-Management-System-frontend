import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ProfileStaff from '../../Customhooks/ProfileStaff'
import '../../css/ChargingProcessStaff.css'
import StaffSidebar from '../../components/layouts/staffSidebar'

interface Session {
  id: number
  stationName: string
  chargerName: string
  power: string
  customer: string
  phone: string
  carBrand: string
  status: 'pending' | 'charging' | 'completed'
}

const ChargingProcessStaff: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [session, setSession] = useState<Session | null>(null)
  const [battery, setBattery] = useState<number>(Math.floor(Math.random() * 40) + 20)
  const [status, setStatus] = useState<'waiting' | 'charging' | 'done'>('waiting')
  const [time, setTime] = useState<number>(0)
  const [cost, setCost] = useState<number>(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)

  // Lấy session từ localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('offlineSessions') || '[]')
    const found = stored.find((s: Session) => s.id === Number(id))
    setSession(found || null)
  }, [id])

  // Simulate charging
  useEffect(() => {
    let interval: number
    if (status === 'charging' && battery < 100) {
      interval = window.setInterval(() => {
        setBattery((prev) => (prev < 100 ? prev + 1 : prev))
        setTime((t) => t + 1)
        setCost((c) => c + 5000)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status, battery])

  const handleStart = () => {
    setStatus('charging')
    setStartTime(new Date())
  }

  const handleStop = () => {
    setStatus('done')
    const now = new Date()
    setEndTime(now)

    // update localStorage
    const stored = JSON.parse(localStorage.getItem('offlineSessions') || '[]')
    const updated = stored.map((s: Session) => (s.id === Number(id) ? { ...s, status: 'completed' } : s))
    localStorage.setItem('offlineSessions', JSON.stringify(updated))
  }

  const handlePayment = () => {
    // Lưu dữ liệu session vừa thanh toán để Invoice đọc
    const invoiceData = {
      sessionId: session?.id,
      customer: session?.customer,
      phone: session?.phone,
      carBrand: session?.carBrand,
      startTime,
      endTime,
      cost,
      stationName: session?.stationName,
      chargerName: session?.chargerName,
      power: session?.power
    }
    localStorage.setItem('currentInvoice', JSON.stringify(invoiceData))

    // Chuyển sang trang Invoice
    navigate(`/staff/invoice/`)
  }

  const statusText = status === 'waiting' ? 'Đang chờ sạc' : status === 'charging' ? 'Đang sạc' : 'Đã sạc xong'

  const formatDateTime = (date: Date | null) =>
    date
      ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      : '--/--/---- --:--'

  return (
    <div className='charging-wrapper'>
      <StaffSidebar />

      {/* ===== MAIN CONTENT ===== */}
      <div className='charging-main-wrapper fade-in'>
        <header className='charging-header'>
          <h1>Optimising your journey, Powering your life</h1>
          <div className='charging-header-actions'>
            <ProfileStaff />
          </div>
        </header>

        <main className='charging-body'>
          <h2 className='charging-title'>Phiên Sạc</h2>
          <p className='charging-subtitle'>{session?.stationName || 'Trạm sạc'}</p>
          <div className={`status-pill ${status}`}>{statusText}</div>

          <div className='charging-card'>
            <div className='charge-progress'>
              <div className='progress-bar'>
                <div className='progress-fill' style={{ width: `${battery}%` }} />
              </div>
              <span className='battery-level'>{battery}%</span>
              <div className='charging-buttons'>
                {status === 'waiting' && (
                  <button className='start-btn' onClick={handleStart}>
                    ⚡ Bắt đầu sạc
                  </button>
                )}
                {status === 'charging' && (
                  <button className='stop-btn' onClick={handleStop}>
                    ⏹️ Kết thúc phiên sạc
                  </button>
                )}
                {status === 'done' && <span className='finished-text'>✅ Đã sạc xong</span>}
              </div>
            </div>

            <div className='session-info'>
              <div className='info-box'>
                <h3>Thông tin trạm sạc</h3>
                <p>
                  Cổng: <strong>{session?.chargerName}</strong>
                </p>
                <p>
                  Công suất: <strong>{session?.power}</strong>
                </p>
              </div>

              <div className='info-box'>
                <h3>Thời gian & Chi phí</h3>
                <p>
                  Thời gian: <strong>{time} phút</strong>
                </p>
                <p>
                  Chi phí: <strong>{cost.toLocaleString()}đ</strong>
                </p>
                <p>
                  Bắt đầu: <strong>{formatDateTime(startTime)}</strong>
                </p>
                <p>
                  Kết thúc: <strong>{formatDateTime(endTime)}</strong>
                </p>
              </div>
            </div>
          </div>

          {status === 'done' && (
            <div className='payment-card'>
              <h3>Thanh Toán Phiên Sạc</h3>
              <p>
                Khách hàng: <strong>{session?.customer}</strong>
              </p>
              <p>
                Điện thoại: <strong>{session?.phone}</strong>
              </p>
              <p>
                Xe: <strong>{session?.carBrand}</strong>
              </p>
              <p>
                Bắt đầu: <strong>{formatDateTime(startTime)}</strong>
              </p>
              <p>
                Kết thúc: <strong>{formatDateTime(endTime)}</strong>
              </p>
              <p>
                Tổng chi phí: <strong>{cost.toLocaleString()}đ</strong>
              </p>
              <button className='start-btn' onClick={handlePayment}>
                💳 Thanh toán ngay
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ChargingProcessStaff
