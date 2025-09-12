// API.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = axios.create({
  baseURL: 'http://istudy-production.up.railway.app/api', // Sizning server manzilingiz
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Tokenni localStorage dan oling
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Agar 401 Unauthorized xatosi bo'lsa va bu allaqachon qayta urinilmagan bo'lsa
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Refresh token mavjud emas, foydalanuvchini tizimdan chiqarish
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Login sahifasiga yo'naltirish
          return Promise.reject(error);
        }

        const response = await axios.post('http://istudy-production.up.railway.app/api/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        API.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return API(originalRequest); // Asl so'rovni qayta urinish
      } catch (refreshError) {
        console.error('Refresh token xatosi:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Login sahifasiga yo'naltirish
        return Promise.reject(refreshError);
      }
    }
    // Boshqa xatoliklar
    if (error.response?.data?.message) {
        toast.error(error.response.data.message);
    } else if (error.message) {
        toast.error(error.message);
    }
    return Promise.reject(error);
  }
);


export default API;