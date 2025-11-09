import { useState, useEffect } from 'react'
import bookingService from '../../../services/bookingService'
import type { Port } from './types'

/**
 * Custom hook để load danh sách cổng sạc theo pointId
 */
export const usePorts = (selectedPointId: number | null) => {
  const [ports, setPorts] = useState<Port[]>([])
  const [loadingPorts, setLoadingPorts] = useState(false)
  const [portsError, setPortsError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedPointId) {
      setPorts([])
      return
    }

    let mounted = true
    ;(async () => {
      setLoadingPorts(true)
      setPortsError(null)
      try {
        const res = await bookingService.getPorts(selectedPointId)
        console.log('[usePorts] Ports loaded:', res)
        if (mounted) setPorts(res)
      } catch (err: any) {
        console.error('❌ Lỗi load port:', err)
        if (mounted) setPortsError(err?.message || 'Không thể tải cổng sạc')
      } finally {
        if (mounted) setLoadingPorts(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [selectedPointId])

  return { ports, loadingPorts, portsError }
}
