import React, { useEffect, useState } from 'react'
import '../../css//ChargingSession.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaInfoCircle, FaClock, FaDollarSign } from 'react-icons/fa'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import bookingService from '../../services/bookingService'
import chargingSessionService from '../../services/chargingSessionService'

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
  const [sessionId, setSessionId] = useState<number | null>(null)
  const [bookingData, setBookingData] = useState<any>(null)

  // ===== Load booking data khi component mount =====
  useEffect(() => {
    const loadBookingData = async () => {
      if (!booking?.id) {
        console.warn("⚠️ Không có booking ID!");
        return;
      }

      try {
        const res = await bookingService.getBookingById(booking.id);
        console.log("📦 [ChargingSession] Booking data loaded:", res);
        setBookingData(res.data || res);
      } catch (error) {
        console.error("❌ Không thể tải thông tin booking:", error);
        alert("Không thể tải thông tin đặt lịch. Vui lòng thử lại!");
      }
    };

    loadBookingData();
  }, [booking?.id]);

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

  // ===== Hàm tạo battery percentage ngẫu nhiên từ 1-100 =====
  const getRandomBatteryPercentage = (): number => {
    return Math.floor(Math.random() * 100) + 1; // Random từ 1 đến 100
  }

  const handleStart = async () => {
    if (!booking?.id || !bookingData) {
      alert("Không tìm thấy thông tin booking. Vui lòng thử lại!");
      return;
    }

    try {
      const randomBattery = getRandomBatteryPercentage();
      
      const payload = {
        bookingId: booking.id,
        stationId: bookingData.StationId ,
        vehicleId: bookingData.VehicleId ,
        pointId: bookingData.PointId,
        portId: bookingData.PortId ,
        batteryPercentage: randomBattery,
      };

      console.log("🚀 [ChargingSession] Starting session with payload:", payload);
      console.log("🔋 Random battery percentage:", randomBattery);
      const res = await chargingSessionService.startSession(payload);
      console.log("✅ [ChargingSession] Session started:", res);

      if (res.success && res.data?.sessionId) {
        setSessionId(res.data.sessionId);
        setStartTimestamp(res.data.checkinTime || new Date().toISOString());
        setBattery(randomBattery); // Cập nhật UI với giá trị random
        setIsCharging(true);
        alert(`✅ Phiên sạc đã bắt đầu! Pin hiện tại: ${randomBattery}%`);
      } else {
        alert("⚠️ Không thể bắt đầu phiên sạc: " + (res.message || "Lỗi không xác định"));
      }
    } catch (error: any) {
      console.error("❌ [ChargingSession] Start session error:", error);
      alert("❌ Lỗi khi bắt đầu phiên sạc: " + (error?.message || "Vui lòng thử lại!"));
    }
  }

  const handleStop = async () => {
    if (!sessionId) {
      alert("Không tìm thấy phiên sạc. Vui lòng thử lại!");
      return;
    }

    try {
      console.log("🛑 [ChargingSession] Ending session, sessionId:", sessionId);
      const res = await chargingSessionService.endSession(sessionId);
      console.log("✅ [ChargingSession] Session ended:", res);

      if (res.success) {
        setIsCharging(false);
        setFinished(true);

        // ✅ Gọi API tạo invoice sau khi kết thúc phiên sạc
        // console.log("📄 [ChargingSession] Creating invoice...");
        // const invoiceRes = await chargingSessionService.createInvoice(sessionId);
        // console.log("✅ [ChargingSession] Invoice created:", invoiceRes);

        alert("✅ Phiên sạc đã kết thúc! Hóa đơn đã được tạo và sẽ được thanh toán qua ví trả sau.");
        
        // Chuyển về trang lịch sử hoặc dashboard
        setTimeout(() => {
          navigate("/charging-schedule");
        }, 2000);
      } else {
        alert("⚠️ Không thể kết thúc phiên sạc: " + (res.message || "Lỗi không xác định"));
      }
    } catch (error: any) {
      console.error("❌ [ChargingSession] End session error:", error);
      alert("❌ Lỗi: " + (error?.message || "Vui lòng thử lại!"));
    }
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

          <div className='status-container'>
            <div className={`status-pill ${statusClass}`}>{statusText}</div>
          </div>
        </div>

        <div className='charging-card'>
        

          {/* ✅ Thanh pin đã sửa đúng yêu cầu */}
          <div className='charge-progress'>
            <div className='progress-bar'>
              <div className='progress-fill' style={{ width: `${battery}%` }} />
            </div>
            <span className='battery-level'>{battery}%</span>

            <div className='charging-actions'>
              {!isCharging && !finished && (
                <button className='start-btn' onClick={handleStart}>
                  ⚡ Sạc
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
              {battery >= 100 && isCharging && <p className="overtime-fee">Phí quá giờ: +12.000đ/phút</p>
}
            </div>
          </div>

          {finished && (
            <div className='payment-box'>
              <h3>
                <FaDollarSign /> Hoàn Tất
              </h3>
              <p>Phiên sạc đã hoàn tất. Hóa đơn sẽ được thanh toán qua ví trả sau.</p>
              <div className='payment-total'>
                Tổng chi phí: <strong>{cost.toLocaleString()}đ</strong>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ChargingSession