import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

/* ======================================================
   🌐 Cấu hình BASE_URL backend
   ====================================================== */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 🪵 Debug: In ra console để chắc chắn FE nhận đúng URL
console.debug("[api] ✅ Resolved API_BASE_URL ->", API_BASE_URL);

/* ======================================================
   ⚙️ Tạo instance Axios chính
   ====================================================== */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 giây timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================================================
   🧩 Request Interceptor: Tự động gắn token
   ====================================================== */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================================================
   🔄 Response Interceptor: Tự động refresh token nếu 401
   ====================================================== */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as any;

    // 🚨 Nếu không có phản hồi -> lỗi mạng hoặc CORS
    if (!error.response) {
      console.error("[api] ❌ Network/CORS error:", error.message);
      return Promise.reject(
        new Error(
          "Network Error: Không thể kết nối đến máy chủ. Kiểm tra backend hoặc CORS."
        )
      );
    }

    // 🧾 Nếu token hết hạn và chưa retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.warn("[api] ⚠️ Không có refreshToken, chuyển hướng đăng nhập.");
          throw new Error("Missing refresh token");
        }

        console.log("[api] 🔁 Đang refresh token...");
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = data;
        if (!accessToken) throw new Error("Không nhận được accessToken mới");

        // ✅ Lưu token mới
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        console.log("[api] ✅ Token mới đã được cấp, retry request...");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("[api] ❌ Refresh token thất bại:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 🚫 Các lỗi khác
    return Promise.reject(error);
  }
);

/* ======================================================
   📦 Export mặc định
   ====================================================== */
export default apiClient;
