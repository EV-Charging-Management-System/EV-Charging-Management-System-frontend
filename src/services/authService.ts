// src/services/authService.ts
import { apiClient } from "../utils/api";
import type {
  LoginResponse,
  User,
  ApiResponse,
  RegisterRequest,
  RegisterResponse,
  ChangePasswordRequest,
  ChangePasswordReponse,
  UpdateProfilereq,
  UpdateProfilerep,
  AuthResponse,
} from "../utils/types";

export const authService = {
  // ✅ LOGIN
  async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      data
    );

    if (response.data.success) {
      // Chuẩn hóa roleName -> role
      const userData = {
        ...response.data.user,
        role: response.data.user.role || response.data.user.roleName,
      };

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return {
      user: {
        ...response.data.user,
        role: response.data.user.role || response.data.user.roleName,
      },
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      success: response.data.success,
      message: response.data.message,
    };
  },

  // ✅ REGISTER
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      data
    );
    return { message: response.data.message };
  },

  // ✅ LOGOUT
  async logout(): Promise<void> {
    try {
      await apiClient.delete("/auth/logout");
    } catch (e) {
      console.warn("Logout API failed, clearing local data instead.");
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // ✅ REFRESH TOKEN
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const response = await apiClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >("/auth/refresh-token", { refreshToken });
    return response.data.data!;
  },

  // ✅ PROFILE
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      "/auth/profile"
    );
    return response.data.data!.user;
  },

  async updateProfile(data: UpdateProfilereq): Promise<UpdateProfilerep> {
    const response = await apiClient.put<ApiResponse<UpdateProfilerep>>(
      "/auth/profile",
      data
    );
    return { message: response.data.message };
  },

  // ✅ CURRENT USER
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  // ✅ PASSWORD RESET
  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  },

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/reset-password",
      { token, newPassword, confirmPassword }
    );
    return response.data;
  },
};
