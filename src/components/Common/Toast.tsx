import React, { useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'
type ToastItem = { id: number; message: string; type: ToastType }

const Toast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail || {}
      const id = Date.now()
      const item: ToastItem = {
        id,
        message: detail.message || 'Info',
        type: detail.type || 'info'
      }
      setToasts((s) => [...s, item])
      // auto remove
      setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), 3500)
    }

    window.addEventListener('app:toast', handler as EventListener)
    return () => window.removeEventListener('app:toast', handler as EventListener)
  }, [])

  if (toasts.length === 0) return null

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.95)' }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.type === 'success' ? 'Thành công' : t.type === 'error' ? 'Lỗi' : ''}</div>
          <div style={{ fontSize: 14 }}>{t.message}</div>
        </div>
      ))}
    </div>
  )
}

export default Toast
