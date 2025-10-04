// src/context/AuthContext.tsx

import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import type { LoginRequest, RegisterRequest, ChangePasswordRequest, User, RegisterResponse } from '../utils/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
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
    if (currentUser && authService.isAuthenticated()) {
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
      setUser(response.user)

      // Navigate based on role
      const role = response.user.role
      switch (role) {
        case 'Admin':
          navigate('/admin/dashboard')
          break
        case 'Manager':
          navigate('/manager/dashboard')
          break
        case 'Staff':
          navigate('/staff/dashboard')
          break
        case 'Customer':
        default:
          navigate('/customer/dashboard')
          break
      }
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
      navigate('/login')
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
