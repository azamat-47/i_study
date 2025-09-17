import axios from "axios";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // React (Vite) uchun
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("istudyAccessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization; // Token bo‘lmasa yubormasin
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 yoki 403 bo‘lsa refresh qilish
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("istudyRefreshToken");
        if (!refreshToken) {
          localStorage.removeItem("istudyAccessToken");
          localStorage.removeItem("istudyRefreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Refresh API
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Yangi tokenlarni saqlash
        localStorage.setItem("istudyAccessToken", accessToken);
        localStorage.setItem("istudyRefreshToken", newRefreshToken);

        // Headerlarni yangilash
        API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return API(originalRequest); // Retry
      } catch (refreshError) {
        console.error("Refresh token xatosi:", refreshError);
        localStorage.removeItem("istudyAccessToken");
        localStorage.removeItem("istudyRefreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // 403 yoki boshqa xatolar
    if (error.response?.status === 403) {
      toast.error("Ruxsat etilmagan amal (403)");
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
