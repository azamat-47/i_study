import axios from 'axios';
import { toast } from 'react-hot-toast';


// .env fayldan o'qish (frontendda import.meta.env ishlatiladi)
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('istudyAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

    // Agar token muddati o'tgan bo'lsa (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('istudyRefreshToken');
        if (!refreshToken) {
          localStorage.removeItem('istudyAccessToken');
          localStorage.removeItem('istudyRefreshToken');
          window.location.href = '/login'; // To'g'ridan-to'g'ri sahifani yangilash orqali yo'naltirish
          return Promise.reject(error);
        }

        // Refresh qilish
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Yangi tokenlarni saqlash
        localStorage.setItem('istudyAccessToken', access_token);
        localStorage.setItem('istudyRefreshToken', newRefreshToken);

        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return API(originalRequest); // Retry
      } catch (refreshError) {
        console.error('Refresh token xatosi:', refreshError);
        localStorage.removeItem('istudyAccessToken');
        localStorage.removeItem('istudyRefreshToken');
        window.location.href = '/login'; // To'g'ridan-to'g'ri sahifani yangilash orqali yo'naltirish
        return Promise.reject(refreshError);
      }
    }

    // Xato habar ko‘rsatish
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

export default API;
