import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import chargingSessionService from '../../../services/chargingSessionService'
import type { SessionState } from './types'

/**
 * Custom hook quản lý toàn bộ logic charging session
 */
export const useChargingSession = (bookingId?: number, bookingData?: any) => {
  const navigate = useNavigate()
  
  const [state, setState] = useState<SessionState>({
    battery: 45,
    time: 0,
    cost: 0,
    isCharging: false,
    finished: false,
    penaltyMinutes: 0,
    startTimestamp: null,
    sessionId: null
  })

  // ===== Timer cho time, battery, cost =====
  useEffect(() => {
    let interval: number | null = null

    if (state.isCharging && !state.finished) {
      interval = window.setInterval(() => {
        setState((prev) => ({
          ...prev,
          time: prev.time + 1,
          battery: prev.battery < 100 ? prev.battery + 1 : prev.battery,
          cost: prev.battery < 100 ? prev.cost + 10000 : prev.cost + 12000
        }))
      }, 1000)
    }

    return () => {
      if (interval) window.clearInterval(interval)
    }
  }, [state.isCharging, state.finished])

  // ===== Timer cho penalty khi battery >= 100% =====
  useEffect(() => {
    let penaltyInterval: number | null = null

    if (state.isCharging && !state.finished && state.battery >= 100) {
      console.log('⚠️ Pin đã đầy 100%! Bắt đầu đếm thời gian phạt...')
      
      penaltyInterval = window.setInterval(() => {
        setState((prev) => {
          const newPenalty = prev.penaltyMinutes + 1
          console.log(`⏱️ Thời gian quá 100%: ${newPenalty} giây (${newPenalty * 5000}đ)`)
          return { ...prev, penaltyMinutes: newPenalty }
        })
      }, 1000)
    }

    return () => {
      if (penaltyInterval) {
        console.log('🛑 Dừng đếm thời gian phạt')
        window.clearInterval(penaltyInterval)
      }
    }
  }, [state.isCharging, state.finished, state.battery])

  // ===== Hàm tạo battery ngẫu nhiên =====
  const getRandomBatteryPercentage = (): number => {
    return Math.floor(Math.random() * 100) + 1
  }

  // ===== Start Session =====
  const handleStart = async () => {
    if (!bookingId || !bookingData) {
      alert('Không tìm thấy thông tin booking. Vui lòng thử lại!')
      return
    }

    if (state.isCharging) {
      alert('Phiên sạc đã được bắt đầu!')
      return
    }

    if (state.sessionId) {
      alert('Đã có phiên sạc đang hoạt động!')
      return
    }

    try {
      const randomBattery = getRandomBatteryPercentage()
      
      const payload = {
        bookingId,
        stationId: bookingData.StationId,
        vehicleId: bookingData.VehicleId,
        pointId: bookingData.PointId,
        portId: bookingData.PortId,
        batteryPercentage: randomBattery
      }

      console.log('🚀 Starting session with payload:', payload)
      console.log('🔋 Random battery percentage:', randomBattery)
      
      const res = await chargingSessionService.startSession(payload)
      console.log('✅ Session started:', res)

      if (res.success && res.data) {
        setState((prev) => ({
          ...prev,
          sessionId: res.data!.sessionId,
          startTimestamp: res.data!.checkinTime || new Date().toISOString(),
          battery: randomBattery,
          isCharging: true
        }))
        
        alert(`✅ Phiên sạc đã bắt đầu!\n\n🔋 Pin hiện tại: ${randomBattery}%\n📍 Session ID: ${res.data.sessionId}\n\n⚠️ Lưu ý: Nếu sạc đến 100% mà không dừng, bạn sẽ bị tính phí phạt 5.000đ/giây!`)
      } else {
        alert('⚠️ Không thể bắt đầu phiên sạc: ' + (res.message || 'Lỗi không xác định'))
      }
    } catch (error: any) {
      console.error('❌ Start session error:', error)
      alert('❌ Lỗi khi bắt đầu phiên sạc: ' + (error?.message || 'Vui lòng thử lại!'))
    }
  }

  // ===== Stop Session =====
  const handleStop = async () => {
    if (!state.sessionId) {
      alert('Không tìm thấy phiên sạc. Vui lòng thử lại!')
      return
    }

    if (!state.isCharging) {
      alert('Phiên sạc chưa được bắt đầu!')
      return
    }

    try {
      // Step 1: END session
      console.log('🛑 Step 1: END session, sessionId:', state.sessionId)
      const endRes = await chargingSessionService.endSession(state.sessionId)
      console.log('✅ Session ended:', endRes)

      if (!endRes.success) {
        alert('⚠️ Không thể kết thúc phiên sạc: ' + (endRes.message || 'Lỗi không xác định'))
        return
      }

      // Dừng charging
      setState((prev) => ({
        ...prev,
        isCharging: false,
        finished: true
      }))

      // Step 2: Apply penalty if exists (PHẢI gọi TRƯỚC khi tạo invoice)
      if (state.penaltyMinutes > 0) {
        const calculatedPenaltyFee = state.penaltyMinutes * 5000
        console.log(`⚠️ Step 2: Áp dụng phí phạt: ${state.penaltyMinutes} giây x 5.000đ = ${calculatedPenaltyFee.toLocaleString()}đ`)
        
        try {
          const penaltyRes = await chargingSessionService.applyPenalty(state.sessionId, calculatedPenaltyFee)
          console.log('✅ Penalty applied:', penaltyRes)  
        } catch (penaltyError: any) {
          console.error('❌ Penalty API error:', penaltyError)
          alert('⚠️ Không thể áp dụng phí phạt. Vui lòng liên hệ hỗ trợ!')
        }
      } else {
        console.log('ℹ️ Step 2: Không có phí phạt (pin chưa đạt 100% hoặc dừng kịp thời)')
      }

      // Step 3: Create invoice (Backend đã có penalty từ Step 2)
      console.log('📄 Step 3: CREATE invoice...')
      const invoiceRes = await chargingSessionService.createInvoice(state.sessionId)
      console.log('✅ Invoice created:', invoiceRes)

      if (invoiceRes.success) {
        const backendSessionPrice = invoiceRes.data?.sessionPrice || 0
        const backendPenaltyFee = invoiceRes.data?.penaltyFee || 0
        const backendTotalAmount = invoiceRes.data?.totalAmount || (backendSessionPrice + backendPenaltyFee)
        
        console.log(`💰 Backend calculated costs:`)
        console.log(`   - Session Price: ${backendSessionPrice.toLocaleString()}đ`)
        console.log(`   - Penalty Fee: ${backendPenaltyFee.toLocaleString()}đ`)
        console.log(`   - Total Amount: ${backendTotalAmount.toLocaleString()}đ`)
        
        const penaltyText = backendPenaltyFee > 0 
          ? `\n- Phí phạt: ${backendPenaltyFee.toLocaleString()}đ` 
          : ''
        
        alert(`✅ Phiên sạc đã kết thúc!\n\n📄 Hóa đơn đã được tạo:\n- Mã hóa đơn: #${invoiceRes.data?.invoiceId || 'N/A'}\n- Chi phí sạc: ${backendSessionPrice.toLocaleString()}đ${penaltyText}\n- Tổng thanh toán: ${backendTotalAmount.toLocaleString()}đ\n- Thanh toán: Ví trả sau`)
        
        // Cập nhật cost từ backend để hiển thị chính xác
        setState((prev) => ({
          ...prev,
          cost: backendTotalAmount
        }))
      } else {
        alert('⚠️ Phiên sạc đã kết thúc nhưng không tạo được hóa đơn. Vui lòng liên hệ hỗ trợ!')
      }
      
      // Navigate after 2s
      setTimeout(() => {
        navigate('/charging-schedule')
      }, 2000)
    } catch (error: any) {
      console.error('❌ Stop session error:', error)
      alert('❌ Lỗi: ' + (error?.message || 'Vui lòng thử lại!'))
    }
  }

  return {
    state,
    handleStart,
    handleStop
  }
}
