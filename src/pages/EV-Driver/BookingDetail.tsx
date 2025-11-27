import React, { useState, useEffect } from 'react'
import '../../css/BookingDetail.css'
import { useParams } from 'react-router-dom'
import Header from '../../pages/layouts/header'
import Footer from '../../pages/layouts/footer'
import MenuBar from '../../pages/layouts/menu-bar'
import bookingService from '../../services/bookingService'
import {
  MapSection,
  BookingForm,
  PointGrid,
  useBookingForm,
  usePoints,
  usePorts,
  useVehicles
} from '../../components/evdriver/bookingDetail'

import { SlotPicker } from '../../components/evdriver/bookingDetail/SlotPicker'
import { apiClient } from '../../utils/api'

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const stationId = Number(id)

  const [selectedPointId, setSelectedPointId] = useState<number | null>(null)
  const [selectedPortId, setSelectedPortId] = useState<number | null>(null)
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null)
  const [bookedSlots, setBookedSlots] = useState<number[]>([])

  const [payLoading, setPayLoading] = useState(false)

  // ===== CUSTOM HOOKS =====
  const { formData, setFormData } = useBookingForm()
  const { points } = usePoints(stationId)
  const { ports } = usePorts(selectedPointId)
  const { vehicles, loading: vehiclesLoading } = useVehicles(formData.userId)

  // 🟦 Fetch slot when port changes
  useEffect(() => {
    if (selectedPortId) fetchBookedSlots(selectedPortId)
  }, [selectedPortId])

  const fetchBookedSlots = async (portId: number) => {
    try {
      const res = await apiClient.get(`/booking/port/${portId}/slots`)
      const slotIds = res.data?.data?.map((x: any) => x.SlotId) || []
      setBookedSlots(slotIds)
    } catch (err) {
      console.error("Error fetching slots:", err)
    }
  }

  // 🟦 Auto select available port
  useEffect(() => {
    if (ports.length > 0) {
      const firstAvailable = ports.find((p: any) => (p.PortStatus || '').toUpperCase() === 'AVAILABLE')
      if (firstAvailable) setSelectedPortId(firstAvailable.PortId)
    }
  }, [ports])

  // =================== SUBMIT ===================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPointId || !selectedPortId) return alert("⚠ Chưa chọn cổng sạc!")
    if (!selectedSlotId) return alert("⚠ Chưa chọn khung giờ!")
    if (!formData.vehicleId) return alert("⚠ Chưa chọn xe!")

    const vnpayTab = window.open('', '_blank')

    try {
      setPayLoading(true)

      const vnpayPayload = {
        userId: Number(formData.userId),
        amount: 30000
      }

      const res = await bookingService.createVnpay(vnpayPayload)
      const paymentUrl = res?.data?.url
      const txnRef = res?.data?.txnRef

      if (!paymentUrl) {
        vnpayTab?.close()
        return alert("Không nhận được URL thanh toán!")
      }

      const bookingData = {
        stationId,
        pointId: selectedPointId,
        portId: selectedPortId,
        vehicleId: Number(formData.vehicleId),
        slotId: selectedSlotId,
        bookingDay: new Date().toISOString().split("T")[0],
        depositAmount: 30000,
        userId: Number(formData.userId),
        carBrand: formData.carBrand,
        qr: txnRef
      }

      localStorage.setItem("bookingPayload", JSON.stringify(bookingData))
      localStorage.setItem("paymentType", "booking")

      vnpayTab!.location.href = paymentUrl
    } catch (err: any) {
      console.error(err)
      vnpayTab?.close()
      alert("Lỗi khi tạo thanh toán!")
    } finally {
      setPayLoading(false)
    }
  }

  return (
    <div className='booking-container'>
      <Header />
      <MenuBar />

      <main className='booking-detail-body'>
        <div className='detail-layout'>
          <MapSection />

          {/* form */}
          <BookingForm
            formData={formData}
            ports={ports}
            vehicles={vehicles}
            selectedPortId={selectedPortId}
            payLoading={payLoading}
            vehiclesLoading={vehiclesLoading}
            onFormDataChange={(data) => setFormData({ ...formData, ...data })}
            onPortChange={setSelectedPortId}
            onSubmit={handleSubmit}
          />
        </div>

        {/* SlotPicker */}
        {selectedPortId && (
          <SlotPicker
            bookedSlots={bookedSlots}
            selectedSlot={selectedSlotId}
            onSelectSlot={setSelectedSlotId}
          />
        )}

        {/* Danh sách point */}
        <PointGrid
          points={points}
          selectedPointId={selectedPointId}
          onSelectPoint={setSelectedPointId}
        />
      </main>

      <Footer />
    </div>
  )
}

export default BookingDetail
