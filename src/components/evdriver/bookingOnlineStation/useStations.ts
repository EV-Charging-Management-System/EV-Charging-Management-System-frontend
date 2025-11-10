import { useState, useEffect } from 'react'
import bookingService from '../../../services/bookingService'
import type { StationData } from './types'

/**
 * Custom hook để quản lý việc fetch và map dữ liệu stations
 */
export const useStations = () => {
  const [stations, setStations] = useState<StationData[]>([])
  const [loadingStations, setLoadingStations] = useState(false)
  const [stationsError, setStationsError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const fetchStations = async () => {
      setLoadingStations(true)
      setStationsError(null)
      try {
        const data = await bookingService.getAllStations()
        // Map backend response to UI fields
        const mapped = (data || []).map((s: any, idx: number) => {
          const id = s.StationId ?? s.id ?? idx + 1
          const name = s.StationName ?? s.name ?? 'Trạm Sạc'
          const address = s.Address ?? s.address ?? ''
          const total = s.ChargingPointTotal ?? s.total ?? 4
          const empty = s.AvailableSlots ?? s.empty ?? Math.max(0, Math.floor(total * 0.5))

          let lat = s.Latitude ?? s.lat
          let lng = s.Longitude ?? s.lng
          if (!lat || !lng) {
            // fallback coordinates nearby center
            const offset = (idx % 10) * 0.002
            lat = 10.776 + offset
            lng = 106.7 + Math.floor(idx / 10) * 0.002
          }

          const status = (s.StationStatus || '').toLowerCase()
          const color = status.includes('active') ? 'green' : status.includes('maint') ? 'gray' : 'orange'

          return {
            id,
            name,
            address,
            lat: Number(lat),
            lng: Number(lng),
            empty,
            total,
            color,
            raw: s,
          } as StationData
        })

        if (mounted) setStations(mapped)
      } catch (err: any) {
        console.error('Failed to load stations', err)
        if (mounted) setStationsError(err?.message || 'Không thể lấy danh sách trạm')
      } finally {
        if (mounted) setLoadingStations(false)
      }
    }

    fetchStations()
    return () => {
      mounted = false
    }
  }, [])

  return { stations, loadingStations, stationsError }
}
