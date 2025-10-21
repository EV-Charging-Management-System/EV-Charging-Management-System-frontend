import React, { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

const Logout: React.FC = () => {
  const { logout } = useAuth()

  useEffect(() => {
    ;(async () => {
      try {
        await logout()
      } catch (err) {
        console.error('Logout failed:', err)
      }
    })()
  }, [logout])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Signing out...</p>
      </div>
    </div>
  )
}

export default Logout
