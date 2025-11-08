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
  const [penaltyMinutes, setPenaltyMinutes] = useState<number>(0)

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

  // ===== Đếm số giây khi pin đạt 100% (1 giây = 5000đ phạt) =====
  useEffect(() => {
    let penaltyCountInterval: number | null = null;

    if (isCharging && !finished && battery >= 100) {
      console.log(`⚠️ [ChargingSession] Pin đã đầy 100%! Bắt đầu đếm thời gian phạt (1s = 5000đ)...`);
      
      // Đếm mỗi 1 giây
      penaltyCountInterval = window.setInterval(() => {
        setPenaltyMinutes((prev) => {
          const newCount = prev + 1;
          console.log(`⏱️ [ChargingSession] Thời gian quá 100%: ${newCount} giây (${newCount * 5000}đ)`);
          return newCount;
        });
      }, 1000); // 1000ms = 1 giây
    }

    return () => {
      if (penaltyCountInterval) {
        console.log("🛑 [ChargingSession] Dừng đếm thời gian phạt");
        window.clearInterval(penaltyCountInterval);
      }
    };
  }, [isCharging, finished, battery]);

  // ===== Hàm tạo battery percentage ngẫu nhiên từ 1-100 =====
  const getRandomBatteryPercentage = (): number => {
    return Math.floor(Math.random() * 100) + 1; // Random từ 1 đến 100
  }

  const handleStart = async () => {
    if (!booking?.id || !bookingData) {
      alert("Không tìm thấy thông tin booking. Vui lòng thử lại!");
      return;
    }

    if (isCharging) {
      alert("Phiên sạc đã được bắt đầu!");
      return;
    }

    if (sessionId) {
      alert("Đã có phiên sạc đang hoạt động!");
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

      console.log("🚀 [ChargingSession] Step 1: Starting session with payload:", payload);
      console.log("🔋 Random battery percentage:", randomBattery);
      
      // ✅ Bước 1: Bắt đầu phiên sạc
      const res = await chargingSessionService.startSession(payload);
      console.log("✅ [ChargingSession] Session started:", res);

      if (res.success && res.data?.sessionId) {
        setSessionId(res.data.sessionId);
        setStartTimestamp(res.data.checkinTime || new Date().toISOString());
        setBattery(randomBattery);
        setIsCharging(true);
        
        alert(`✅ Phiên sạc đã bắt đầu!\n\n🔋 Pin hiện tại: ${randomBattery}%\n📍 Session ID: ${res.data.sessionId}\n\n⚠️ Lưu ý: Nếu sạc đến 100% mà không dừng, bạn sẽ bị tính phí phạt 5.000đ/giây!`);
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

    if (!isCharging) {
      alert("Phiên sạc chưa được bắt đầu!");
      return;
    }

    try {
      // ✅ Bước 1: END session trước
      console.log("🛑 [ChargingSession] Step 1: END session, sessionId:", sessionId);
      const endRes = await chargingSessionService.endSession(sessionId);
      console.log("✅ [ChargingSession] Session ended:", endRes);

      if (!endRes.success) {
        alert("⚠️ Không thể kết thúc phiên sạc: " + (endRes.message || "Lỗi không xác định"));
        return;
      }

      // Dừng trạng thái sạc ngay lập tức
      setIsCharging(false);
      setFinished(true);

      // ⚠️ Bước 2: PENALTY sau END (nếu có)
      if (penaltyMinutes > 0) {
        const calculatedPenaltyFee = penaltyMinutes * 5000;
        console.log(`💰 [ChargingSession] Step 2: Áp dụng phí phạt: ${penaltyMinutes} giây x 5.000đ = ${calculatedPenaltyFee}đ`);
        console.log(`⚠️ [ChargingSession] API PENALTY gọi 1 LẦN DUY NHẤT: penaltyFee = ${calculatedPenaltyFee}`);
        
        try {
          const penaltyRes = await chargingSessionService.applyPenalty(sessionId, calculatedPenaltyFee);
          console.log("✅ [ChargingSession] Penalty applied:", penaltyRes);
        } catch (penaltyError: any) {
          console.error("❌ [ChargingSession] Penalty API error:", penaltyError);
          // Không block flow, vẫn tiếp tục tạo invoice
        }
      } else {
        console.log("ℹ️ [ChargingSession] Step 2: Không có phí phạt (pin chưa đạt 100%)");
      }

      // ✅ Bước 3: CREATE INVOICE cuối cùng
      console.log("📄 [ChargingSession] Step 3: CREATE invoice...");
      const invoiceRes = await chargingSessionService.createInvoice(sessionId);
      console.log("✅ [ChargingSession] Invoice created:", invoiceRes);
      
      if (penaltyMinutes > 0) {
        console.log(`📊 Invoice có: penaltyFee = ${penaltyMinutes * 5000}`);
      }

      if (invoiceRes.success) {
        const penaltyText = penaltyMinutes > 0 ? `\n- Phí phạt: ${(penaltyMinutes * 5000).toLocaleString()}đ (${penaltyMinutes} giây)` : '';
        alert(`✅ Phiên sạc đã kết thúc!\n\n📄 Hóa đơn đã được tạo:\n- Mã hóa đơn: #${invoiceRes.data?.invoiceId || 'N/A'}\n- Tổng chi phí: ${invoiceRes.data?.sessionPrice?.toLocaleString() || cost.toLocaleString()}đ${penaltyText}\n- Thanh toán: Ví trả sau`);
      } else {
        alert("⚠️ Phiên sạc đã kết thúc nhưng không tạo được hóa đơn. Vui lòng liên hệ hỗ trợ!");
      }
      
      // Chuyển về trang lịch sử sau 2 giây
      setTimeout(() => {
        navigate("/charging-schedule");
      }, 2000);
    } catch (error: any) {
      console.error("❌ [ChargingSession] Stop session error:", error);
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
              {battery >= 100 && isCharging && (
                <>
                  <p className="overtime-fee">⚠️ Phí quá giờ: +5.000đ/giây</p>
                  <p className="penalty-warning" style={{color: '#ff4444', fontWeight: 'bold'}}>
                    🚨 Đã áp dụng phí phạt: {penaltyMinutes} giây x 5.000đ = {(penaltyMinutes * 5000).toLocaleString()}đ
                  </p>
                </>
              )}
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