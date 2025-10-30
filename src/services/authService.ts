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
  // ✅ LOGIN (Chuẩn khớp backend)
  async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const payload = {
      Email: data.email,          // backend nhận key "Email"
      PasswordHash: data.password // backend nhận key "PasswordHash"
    };

    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload
    );

    const resData = response.data;

    if (resData.success && resData.user) {
      // ✅ Chuẩn hóa role (in hoa)
      const userData = {
        ...resData.user,
        role: (resData.user.role || resData.user.roleName || "").toUpperCase(),
      };

      // ✅ Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem("accessToken", resData.accessToken);
      localStorage.setItem("refreshToken", resData.refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return {
      user: {
        ...resData.user,
        role: (resData.user.role || resData.user.roleName || "").toUpperCase(),
      },
      accessToken: resData.accessToken,
      refreshToken: resData.refreshToken,
      success: resData.success,
      message: resData.message,
    };
  },

  // ✅ Lấy thông tin user hiện tại
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      // 🔥 Ép role in hoa để không bị sai khi check
      user.role = (user.role || user.roleName || "").toUpperCase();
      return user;
    } catch {
      return null;
    }
  },

  // ✅ Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    return !!(token && user);
  },

  // ✅ Đăng xuất
  async logout(): Promise<void> {
    try {
      await apiClient.delete("/auth/logout");
    } catch {
      console.warn("⚠️ Logout API failed, clearing local data instead.");
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // ✅ REGISTER
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      data
    );
    // Return full API response so caller can inspect success/message/data
    return response.data;
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

  // UserInfo
  async getProfile(): Promise<User> {
    // Try several possible endpoints depending on backend
    const tryPaths = ["/auth/me"];
    for (const p of tryPaths) {
      try {
        const response = await apiClient.get<ApiResponse<{ user: User }>>(p);
        if (response?.data) return response.data.data?.user ?? response.data.user ?? response.data;
      } catch (e) {
        // try next
      }
    }

    throw new Error("Profile endpoint not found");
  },

  async updateProfile(data: UpdateProfilereq): Promise<UpdateProfilerep> {
    const response = await apiClient.put<ApiResponse<UpdateProfilerep>>(
      "/auth/profile",
      data
    );
    return { message: response.data.message };
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