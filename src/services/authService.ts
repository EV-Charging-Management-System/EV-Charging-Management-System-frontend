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
  // ✅ LOGIN (Chuẩn backend)
  async login(data: { email: string; password: string }): Promise<LoginResponse> {
    const payload = {
      Email: data.email,
      PasswordHash: data.password,
    };

    const response = await apiClient.post<ApiResponse<LoginResponse>>("/auth/login", payload);
    const resData = response.data;

    if (resData.success) {
      // ✅ chỉ lưu token, không lưu user
      localStorage.setItem("accessToken", resData.accessToken);
      localStorage.setItem("refreshToken", resData.refreshToken);

      // ✅ gọi /auth/me để lấy thông tin user đầy đủ
      try {
        const userRes = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
        const user = userRes.data.user;

        const normalizedUser = {
          ...user,
          role: (user.role || "").toUpperCase(),
          fullName: user.fullName || user.FullName || "",
        };

        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("userId", String(normalizedUser.userId || normalizedUser.UserId));
      } catch (err) {
        console.warn("⚠️ Cannot load user information after login:", err);
      }
    }

    return {
      success: resData.success,
      message: resData.message,
      accessToken: resData.accessToken,
      refreshToken: resData.refreshToken,
      user: resData.user, // backend có thể trả user rút gọn (cũng được)
    };
  },


  // ✅ Lấy user hiện tại từ localStorage
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;

      const user = JSON.parse(userStr);
      user.role = (user.role || user.roleName || "").toUpperCase();
      return user;
    } catch {
      return null;
    }
  },

  // ✅ Kiểm tra đăng nhập
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
      console.warn("⚠️ Logout API failed, clearing local data.");
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  },

  // ✅ Đăng ký tài khoản thường
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>("/auth/register", data);
    return response.data;
  },

  // ✅ Làm mới token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<
      ApiResponse<{ accessToken: string; refreshToken: string }>
    >("/auth/refresh-token", { refreshToken });
    return response.data.data!;
  },

  // ✅ Lấy hồ sơ người dùng (luôn mới nhất)
  async getProfile(options?: { noCache?: boolean }): Promise<User> {
    try {
      // ⚙️ lấy token từ local
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Not logged in");

      // ✅ gọi API để luôn lấy user mới nhất
      const response = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
      const user = response.data.user;

      if (!user) throw new Error("Cannot get user information");

      const normalizedUser = {
        ...user,
        role: (user.role || "").toUpperCase(),
        fullName: user.fullName || user.FullName || "",
      };

      // ✅ lưu vào localStorage (vì đây là dữ liệu backend chuẩn)
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("userId", String(normalizedUser.userId || normalizedUser.UserId));

      return normalizedUser;
    } catch (err) {
      console.error("⚠️ getProfile error:", err);
      throw err;
    }
  },



  // ✅ Cập nhật hồ sơ
  async updateProfile(data: UpdateProfilereq): Promise<UpdateProfilerep> {
    const response = await apiClient.put<ApiResponse<UpdateProfilerep>>("/auth/profile", data);
    return { message: response.data.message };
  },

  // ✅ Đổi mật khẩu
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordReponse> {
    const response = await apiClient.post<ApiResponse<ChangePasswordReponse>>(
      "/auth/change-password",
      data
    );
    return response.data;
  },

  // ✅ Quên mật khẩu
  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  // ✅ Đặt lại mật khẩu
  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/reset-password", {
      token,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};
