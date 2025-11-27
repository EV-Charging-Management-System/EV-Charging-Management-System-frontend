import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

/* ======================================================
   🌐 Backend BASE_URL Configuration
   ====================================================== */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 🪵 Debug: Log to console to ensure FE receives correct URL
console.debug("[api] ✅ Resolved API_BASE_URL ->", API_BASE_URL);

/* ======================================================
   ⚙️ Create main Axios instance
   ====================================================== */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================================================
   🧩 Request Interceptor: Automatically attach token
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
   🔄 Response Interceptor: Auto refresh token if 401
   ====================================================== */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as any;

    // 🚨 If no response -> network or CORS error
    if (!error.response) {
      console.error("[api] ❌ Network/CORS error:", error.message);
      return Promise.reject(
        new Error(
          "Network Error: Cannot connect to server. Check backend or CORS."
        )
      );
    }

    // 🧾 If token expired and not yet retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.warn("[api] ⚠️ No refreshToken, redirecting to login.");
          throw new Error("Missing refresh token");
        }

        console.log("[api] 🔁 Refreshing token...");
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = data;
        if (!accessToken) throw new Error("New accessToken not received");

        // Save new token
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        console.log("[api] ✅ New token issued, retrying request...");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("[api] ❌ Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Other errors
    return Promise.reject(error);
  }
);

/* ======================================================
  Default export
   ====================================================== */
export default apiClient;
