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

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const stationId = Number(id)

  const [selectedPointId, setSelectedPointId] = useState<number | null>(null)
  const [selectedPortId, setSelectedPortId] = useState<number | null>(null)
  const [payLoading, setPayLoading] = useState(false)

  // ===== CUSTOM HOOKS =====
  const { formData, setFormData } = useBookingForm()
  const { points } = usePoints(stationId)
  const { ports } = usePorts(selectedPointId)
  const { vehicles, loading: vehiclesLoading } = useVehicles(formData.userId)

  // ✅ Tự động chọn port đầu tiên available khi load ports
  useEffect(() => {
    if (ports.length > 0) {
      const firstAvailable = ports.find((p: any) => (p.PortStatus || '').toUpperCase() === 'AVAILABLE')
      if (firstAvailable) setSelectedPortId(firstAvailable.PortId)
    }
  }, [ports])

  // ✅ Gửi booking → mở VNPay
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPointId || !selectedPortId) {
      alert('⚠️ Vui lòng chọn cổng sạc!')
      return
    }
    if (!formData.userId) {
      alert('⚠️ Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!')
      return
    }
    if (!formData.vehicleId) {
      alert('⚠️ Vui lòng chọn xe của bạn!')
      return
    }

    // 👉 Mở tab mới ngay khi user click
    const vnpayTab = window.open('', '_blank')

    try {
      setPayLoading(true)

      // Gọi API VNPay tạo URL thanh toán
      const vnpayPayload = {
        userId: Number(formData.userId),
        amount: 30000
      }

      console.log('[BookingDetail] Payload gửi VNPay:', vnpayPayload)
      const res = await bookingService.createVnpay(vnpayPayload)
      console.log('[BookingDetail] VNPay response:', res)

      const paymentUrl = res?.data?.url || res?.url
      const txnRef = res?.data?.txnRef || res?.txnRef // ✅ Lấy txnRef từ response

      if (!paymentUrl) {
        alert('Không nhận được URL thanh toán từ hệ thống!')
        vnpayTab?.close()
        return
      }

      if (!txnRef) {
        console.warn('⚠️ Không có txnRef từ VNPay response')
      }

      // 💾 Chuẩn bị bookingPayload với txnRef
      const todayStr = new Date().toISOString().split('T')[0]
      const startTime = formData.time ? new Date(`${todayStr}T${formData.time}`).toISOString() : new Date().toISOString()

      const bookingData = {
        stationId,
        pointId: selectedPointId,
        portId: selectedPortId,
        vehicleId: Number(formData.vehicleId),
        startTime,
        depositAmount: 30000,
        userId: Number(formData.userId),
        carBrand: formData.carBrand,
        qr: txnRef // ✅ Thêm txnRef vào payload
      }

      // 💾 Lưu localStorage để tạo booking sau khi thanh toán thành công
      localStorage.setItem('bookingPayload', JSON.stringify(bookingData))
      console.log('[BookingDetail] bookingPayload saved with txnRef:', bookingData)

      // Mở VNPay
      vnpayTab!.location.href = paymentUrl
    } catch (error: any) {
      console.error('❌ Lỗi khi tạo thanh toán:', error)
      alert(error?.message || 'Không thể tạo thanh toán!')
      vnpayTab?.close()
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
          {/* ==== MAP SECTION ==== */}
          <MapSection />

          {/* ==== BOOKING FORM ==== */}
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

        {/* ==== DANH SÁCH CỔNG SẠC ==== */}
        <PointGrid points={points} selectedPointId={selectedPointId} onSelectPoint={setSelectedPointId} />
      </main>

      <Footer />
    </div>
  )
}

export default BookingDetail
