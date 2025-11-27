import { useState, useEffect } from 'react'
import api from '../../../utils/api'

export interface Vehicle {
  VehicleId: number
  UserId: number
  CompanyId: number
  VehicleName: string
  VehicleType: string
  LicensePlate: string
  Battery: number
}

/**
 * Custom hook to fetch the user's vehicle list
 */
export const useVehicles = (userId: string | undefined) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!userId) {
        setVehicles([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/vehicle/user/${userId}`)
        
        if (response.data.success && Array.isArray(response.data.data)) {
          setVehicles(response.data.data)
        } else {
          setVehicles([])
        }
      } catch (err: any) {
        console.error('❌ Error loading vehicle list:', err)
        setError(err.message || 'Unable to load vehicle list')
        setVehicles([])
      } finally {
        setLoading(false)
      }
    }

    fetchVehicles()
  }, [userId])

  return { vehicles, loading, error }
}
