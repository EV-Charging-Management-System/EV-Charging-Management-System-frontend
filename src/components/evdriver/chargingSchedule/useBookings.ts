import { useState, useEffect } from 'react'
import bookingService from '../../../services/bookingService'
import { authService } from '../../../services/authService'
import type { FormattedBooking, RawBooking } from './types'

/**
 * Custom hook to fetch and format the user's bookings list
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
          console.warn('⚠️ User ID not found!')
          setLoading(false)
          return
        }

        const res = await bookingService.getBookingByUser(userId)
        let list: RawBooking[] = res?.data || []

        // ✅ Filter only bookings with Status = "ACTIVE"
        list = list.filter((b: RawBooking) => b.Status === 'ACTIVE')

        const formatted: FormattedBooking[] = list.map((b: RawBooking) => ({
          id: b.BookingId,
          stationName: b.StationName || 'Charging Station',
          startTime: new Date(b.StartTime).toLocaleString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          vehicle: b.VehicleName || 'Not updated',
          deposit: (b.DepositAmount?.toLocaleString('en-US') || '0') + ' ₫',
          qr: b.QR || 'N/A', // ✅ Show full txnRef (QR code)
          status: 'Confirmed'
        }))

        setBookings(formatted)
      } catch (err: any) {
        console.error('❌ Failed to load booking list:', err)
        setError(err?.message || 'Unable to load booking list')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  return { bookings, loading, error }
}
