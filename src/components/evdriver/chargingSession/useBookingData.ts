import { useState, useEffect } from 'react'
import bookingService from '../../../services/bookingService'

/**
 * Custom hook để fetch booking data
 */
export const useBookingData = (bookingId?: number) => {
  const [bookingData, setBookingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBookingData = async () => {
      if (!bookingId) {
        console.warn('⚠️ Không có booking ID!')
        return
      }

      try {
        setLoading(true)
        setError(null)
        const res = await bookingService.getBookingById(bookingId)
        console.log('📦 [useBookingData] Booking data loaded:', res)
        setBookingData(res.data || res)
      } catch (err: any) {
        console.error('❌ Không thể tải thông tin booking:', err)
        setError(err?.message || 'Không thể tải thông tin booking')
      } finally {
        setLoading(false)
      }
    }

    loadBookingData()
  }, [bookingId])

  return { bookingData, loading, error }
}
