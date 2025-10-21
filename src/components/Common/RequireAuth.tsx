import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const auth = useAuth()
  console.log('[RequireAuth] auth loading:', auth.loading, 'isAuthenticated:', auth.isAuthenticated, 'user:', auth.user)
  if (auth.loading) return null
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default RequireAuth
