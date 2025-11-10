import { useState, useEffect } from 'react'
import { authService } from '../../../services/authService'
import type { BookingFormData } from './types'

/**
 * Custom hook quản lý form data và load thông tin user
 */
export const useBookingForm = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    userId: '',
    email: '',
    carBrand: '',
    vehicleId: '',
    time: ''
  })

  useEffect(() => {
    ;(async () => {
      try {
        const profile = await authService.getProfile()
        const user = profile?.user || profile?.data || profile
        setFormData((prev) => ({
          ...prev,
          name: user?.fullName || '',
          userId: String(user?.userId || user?.id || ''),
          email: user?.email || ''
        }))
      } catch (e) {
        console.error('❌ Không thể load profile:', e)
      }
    })()
  }, [])

  return { formData, setFormData }
}
