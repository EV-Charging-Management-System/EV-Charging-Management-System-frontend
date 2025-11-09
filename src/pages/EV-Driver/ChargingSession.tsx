import React from 'react'
import '../../css//ChargingSession.css'
import { useLocation } from 'react-router-dom'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import {
  SessionHeader,
  BatteryProgress,
  SessionControls,
  SessionInfo,
  PaymentBox,
  useBookingData,
  useChargingSession,
  type Booking
} from '../../components/evdriver/chargingSession'

const ChargingSession: React.FC = () => {
  const location = useLocation()
  const booking: Booking | undefined = location.state?.booking

  // ===== CUSTOM HOOKS =====
  const { bookingData } = useBookingData(booking?.id)
  const { state, handleStart, handleStop } = useChargingSession(booking?.id, bookingData)

  const statusClass = state.finished ? 'done' : state.isCharging ? 'running' : 'waiting'

  return (
    <div className='session-container'>
      <Header />

      <main className='session-body'>
        <SessionHeader booking={booking} status={statusClass} />

        <div className='charging-card'>
          <BatteryProgress battery={state.battery} />
          
          <SessionControls
            isCharging={state.isCharging}
            finished={state.finished}
            onStart={handleStart}
            onStop={handleStop}
          />

          <SessionInfo
            booking={booking}
            bookingData={bookingData}
            battery={state.battery}
            time={state.time}
            cost={state.cost}
            isCharging={state.isCharging}
            penaltyMinutes={state.penaltyMinutes}
          />

          {state.finished && <PaymentBox cost={state.cost} />}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ChargingSession
