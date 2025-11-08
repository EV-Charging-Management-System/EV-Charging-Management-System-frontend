import { useState, useEffect } from 'react'
import bookingService from '../../../services/bookingService'
import { authService } from '../../../services/authService'
import type { FormattedBooking, RawBooking } from './types'

/**
 * Custom hook để fetch và format danh sách bookings của user
 */
export const useBookings = () => {
  const [bookings, setBookings] = useState<FormattedBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError(null)

        const profile = await authService.getProfile()
        const user = profile?.data || profile?.user || profile
        const userId = user?.id || user?.userId

        if (!userId) {
          console.warn('⚠️ Không tìm thấy userId!')
          setLoading(false)
          return
        }

        const res = await bookingService.getBookingByUser(userId)
        let list: RawBooking[] = res?.data || []

        // ✅ Lọc chỉ những booking có Status = "ACTIVE"
        list = list.filter((b: RawBooking) => b.Status === 'ACTIVE')

        const formatted: FormattedBooking[] = list.map((b: RawBooking) => ({
          id: b.BookingId,
          stationName: b.StationName || 'Trạm Sạc',
          startTime: new Date(b.StartTime).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          vehicle: b.VehicleName || 'Chưa cập nhật',
          plate: b.LicensePlate || 'N/A',
          deposit: (b.DepositAmount?.toLocaleString('vi-VN') || '0') + ' ₫',
          qr: b.QR?.substring(0, 8) || 'N/A',
          status: 'Đã xác nhận'
        }))

        setBookings(formatted)
      } catch (err: any) {
        console.error('❌ Lỗi tải danh sách booking:', err)
        setError(err?.message || 'Không thể tải danh sách booking')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return { bookings, loading, error }
}
