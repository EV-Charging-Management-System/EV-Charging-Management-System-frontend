import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import chargingSessionService from '../../../services/chargingSessionService'
import type { SessionState } from './types'

/**
 * Custom hook to manage all charging session logic
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

  // ===== Timer for time, battery, cost =====
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

  // ===== Timer for penalty when battery >= 100% =====
  useEffect(() => {
    let penaltyInterval: number | null = null

    if (state.isCharging && !state.finished && state.battery >= 100) {
      console.log('⚠️ Battery is fully charged (100%)! Starting penalty timer…')
      
      penaltyInterval = window.setInterval(() => {
        setState((prev) => {
          const newPenalty = prev.penaltyMinutes + 1
          console.log(`⏱️ Time Over 100%: ${newPenalty} seconds (${newPenalty * 5000}đ)`)
          return { ...prev, penaltyMinutes: newPenalty }
        })
      }, 1000)
    }

    return () => {
      if (penaltyInterval) {
        console.log('🛑 Stop Penalty Timer')
        window.clearInterval(penaltyInterval)
      }
    }
  }, [state.isCharging, state.finished, state.battery])

  // ===== Function to generate random battery percentage =====
  const getRandomBatteryPercentage = (): number => {
    return Math.floor(Math.random() * 100) + 1
  }

  // ===== Start Session =====
  const handleStart = async () => {
    if (!bookingId || !bookingData) {
      alert('Booking information not found. Please try again!')
      return
    }

    if (state.isCharging) {
      alert('The charging session has already started!')
      return
    }

    if (state.sessionId) {
      alert('There is already an active charging session!')
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
        
        alert(`✅ Charging session started!\n\n🔋 Current battery: ${randomBattery}%\n📍 Session ID: ${res.data.sessionId}\n\n⚠️ Note: If you reach 100% and do not stop the session, a penalty of 5,000đ/second will be applied!`)

      } else {
        alert('⚠️ Unable to start charging session: ' + (res.message || 'Unknown error'))
      }
    } catch (error: any) {
      console.error('❌ Start session error:', error)
      alert('❌ Error while starting session: ' + (error?.message || 'Please try again!'))
    }
  }

  // ===== Stop Session =====
  const handleStop = async () => {
    if (!state.sessionId) {
      alert('Charging session not found. Please try again!')
      return
    }

    if (!state.isCharging) {
      alert('The charging session has not started yet!')
      return
    }

    try {
      // Step 1: END session
      console.log('🛑 Step 1: END session, sessionId:', state.sessionId)
      const endRes = await chargingSessionService.endSession(state.sessionId)
      console.log('✅ Session ended:', endRes)

      if (!endRes.success) {
        alert('⚠️ Unable to end charging session: ' + (endRes.message || 'Unknown error'))
        return
      }

      // Stop charging
      setState((prev) => ({
        ...prev,
        isCharging: false,
        finished: true
      }))

      // Step 2: Apply penalty if exists (MUST call BEFORE creating invoice)
      if (state.penaltyMinutes > 0) {
        const calculatedPenaltyFee = state.penaltyMinutes * 5000
        console.log('ℹ️ Step 2: Penalty applied')
        try {
          const penaltyRes = await chargingSessionService.applyPenalty(state.sessionId, calculatedPenaltyFee)
          console.log('✅ Penalty applied:', penaltyRes)  
        } catch (penaltyError: any) {
          console.error('❌ Penalty API error:', penaltyError)
          alert('⚠️ Cannot apply penalty fee. Please contact support!')
        }
      } else {
        console.log('ℹ️ Step 2: No penalty applied (battery not full or session stopped in time)')
      }

      // Step 3: Create invoice (Backend already has penalty from Step 2)
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
          ? `\n- Penalty Fee: ${backendPenaltyFee.toLocaleString()}đ` 
          : ''
        
        alert(`✅ Charging session has ended!\n\n📄 Invoice has been created:\n- Invoice ID: #${invoiceRes.data?.invoiceId || 'N/A'}\n- Charging Cost: ${backendSessionPrice.toLocaleString()}đ${penaltyText}\n- Total Amount: ${backendTotalAmount.toLocaleString()}đ\n- Payment Method: Postpaid Wallet`)
        
        // Update cost from backend for accurate display
        setState((prev) => ({
          ...prev,
          cost: backendTotalAmount
        }))
      } else {
       alert('⚠️ The charging session has ended, but the invoice could not be created. Please contact support!')
      }
      
      // Navigate after 2s
      setTimeout(() => {
        navigate('/charging-schedule')
      }, 2000)
    } catch (error: any) {
      console.error('❌ Stop session error:', error)
      alert('❌ Error: ' + (error?.message || 'Please try again!'))
    }
  }

  return {
    state,
    handleStart,
    handleStop
  }
}
