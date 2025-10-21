// src/context/AuthContext.tsx

import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import type { LoginRequest, RegisterRequest, ChangePasswordRequest, User, RegisterResponse, LoginResponse } from '../utils/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: LoginRequest) => Promise<LoginResponse>
  register: (data: RegisterRequest) => Promise<RegisterResponse>
  logout: () => Promise<void>
  changePassword: (data: ChangePasswordRequest) => Promise<void>
  refreshUserData: () => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  isManager: boolean
  isStaff: boolean
  isCustomer: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already authenticated on app start
    const currentUser = authService.getCurrentUser()
    // If we have a user saved locally, set it as current user.
    // This allows an offline/demo session when accessToken is not present.
    if (currentUser) {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data)

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      // Set user data
      if (response.user) {
        setUser(response.user)
      } else if (response.accessToken) {
        // If backend returned tokens but not user, try fetching profile
        try {
          const profile = await authService.getProfile()
          setUser(profile)
          localStorage.setItem('user', JSON.stringify(profile))
        } catch (e) {
          console.error('Failed to fetch profile after login:', e)
        }
      }

      // Do not navigate here; let caller decide where to go
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data)
      return response // ✅ Trả về để componxent sử dụng message
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      localStorage.removeItem('role')
      setUser(null)
      // Navigate to login
      navigate('/login')
      // Emit a small toast notification for successful logout
      try {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Đăng xuất thành công', type: 'success' } }))
      } catch (e) {
        // ignore if CustomEvent not supported
      }
    }
  }

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      await authService.changePassword(data)
    } catch (error) {
      console.error('Change password error:', error)
      throw error
    }
  }

  const refreshUserData = async () => {
    try {
      const userData = await authService.getProfile()
      setUser(userData)
    } catch (error) {
      console.error('Refresh user data error:', error)
      throw error
    }
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'Admin'
  const isManager = user?.role === 'Manager'
  const isStaff = user?.role === 'Staff'
  const isCustomer = user?.role === 'Customer'

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    changePassword,
    refreshUserData,
    isAuthenticated,
    isAdmin,
    isManager,
    isStaff,
    isCustomer
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
