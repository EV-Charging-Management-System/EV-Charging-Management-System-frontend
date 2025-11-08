import { useState, useEffect } from 'react'
import bookingService from '../../../services/bookingService'
import type { Point } from './types'

/**
 * Custom hook để load danh sách điểm sạc theo stationId
 */
export const usePoints = (stationId: number) => {
  const [points, setPoints] = useState<Point[]>([])
  const [loadingPoints, setLoadingPoints] = useState(false)
  const [pointsError, setPointsError] = useState<string | null>(null)

  useEffect(() => {
    if (!stationId || Number.isNaN(stationId)) return

    let mounted = true
    ;(async () => {
      setLoadingPoints(true)
      setPointsError(null)
      try {
        const res = await bookingService.getPoints(stationId)
        console.log('[usePoints] Points loaded:', res)
        if (mounted) setPoints(res)
      } catch (err: any) {
        console.error('❌ Lỗi load điểm sạc:', err)
        if (mounted) setPointsError(err?.message || 'Không thể tải điểm sạc')
      } finally {
        if (mounted) setLoadingPoints(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [stationId])

  return { points, loadingPoints, pointsError }
}
