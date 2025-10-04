// src/services/authService.ts

import { apiClient } from '../utils/api'
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  LoginResponse,
  User,
  ApiResponse,
  RegisterResponse,
  ChangePasswordReponse,
  UpdateProfilereq,
  UpdateProfilerep,
  AuthResponse
} from '../utils/types'

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', data)
    if (response.data.success) {
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('refreshToken', response.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return {
      user: response.data.user,
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      success: response.data.success,
      message: response.data.message
    }
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', data)
      return {
        message: response.data.message
      }
    } catch (error: any) {
      const message = error?.response?.data?.message
      throw new Error(message)
    }
  },

  async logout(): Promise<void> {
    await apiClient.delete('/auth/logout')
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      '/auth/refresh-token',
      { refreshToken }
    )
    return response.data.data!
  },

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordReponse> {
    const rep = await apiClient.put<ApiResponse<ChangePasswordReponse>>('/auth/change-password', data)
    return {
      message: rep.data.message
    }
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/profile')
    return response.data.data!.user
  },
  async updateProfile(data: UpdateProfilereq): Promise<UpdateProfilerep> {
    const response = await apiClient.put<ApiResponse<UpdateProfilerep>>('/auth/profile', data)
    return { message: response.data.message }
  },
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    return !!(token && user)
  },


  // ✅ Forgot Password
  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/forgot-password', { email })
    return response.data
  },

  // ✅ Reset Password
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/reset-password', {
      token,
      newPassword,
      confirmPassword
    })
    return response.data
  }
}
