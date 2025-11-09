import React from 'react'
import { Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'
import { ScheduleHeader, BookingList, useBookings } from '../../components/evdriver/chargingSchedule'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../css/ChargingSchedule.css'

const ChargingSchedule: React.FC = () => {
  const navigate = useNavigate()
  const { bookings, loading } = useBookings()

  const handleStartCharging = (booking: any) => {
    navigate('/charging-session', { state: { booking } })
  }


  return (
    <div className='schedule-container bg-dark text-light min-vh-100'>
      <Header />
      <MenuBar />

      <Container className='py-4'>
        <ScheduleHeader />
        <BookingList bookings={bookings} loading={loading} onStartCharging={handleStartCharging} />
      </Container>

      <Footer />
    </div>
  )
}

export default ChargingSchedule
