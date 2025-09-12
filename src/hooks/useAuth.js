// hooks/useAuth.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../API';
import { toast } from 'react-hot-toast';

// Login API funksiyasi
const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  const { accessToken, refreshToken, userId, username, role, branchId, branchName } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  // Boshqa foydalanuvchi ma'lumotlarini ham saqlashingiz mumkin
  localStorage.setItem('userId', userId);
  localStorage.setItem('username', username);
  localStorage.setItem('role', role);
  localStorage.setItem('branchId', branchId);
  localStorage.setItem('branchName', branchName);
  return response.data;
};

// Register API funksiyasi
const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

// Logout API funksiyasi
const logoutUser = async (userId) => {
  const response = await API.post(`/auth/logout?userId=${userId}`);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('branchId');
  localStorage.removeItem('branchName');
  return response.data;
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Login
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      toast.loading("Tizimga kirilmoqda...", { id: "login" });
    },
    onSuccess: (data) => {
      toast.success("Muvaffaqiyatli tizimga kirdingiz!", { id: "login" });
      // Kirishdan keyin ba'zi keshlar (masalan, foydalanuvchi ma'lumotlari)ni yangilashingiz mumkin
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Tizimga kirishda xatolik yuz berdi.", { id: "login" });
    }
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onMutate: () => {
      toast.loading("Ro'yxatdan o'tilmoqda...", { id: "register" });
    },
    onSuccess: () => {
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!", { id: "register" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Ro'yxatdan o'tishda xatolik yuz berdi.", { id: "register" });
    }
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onMutate: () => {
      toast.loading("Tizimdan chiqilmoqda...", { id: "logout" });
    },
    onSuccess: () => {
      toast.success("Muvaffaqiyatli tizimdan chiqdingiz!", { id: "logout" });
      // Barcha keshni tozalash foydalanuvchi tizimdan chiqqanda yaxshi amaliyot
      queryClient.clear();
      window.location.href = '/login'; // Login sahifasiga yo'naltirish
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Tizimdan chiqishda xatolik yuz berdi.", { id: "logout" });
    }
  });

  return { loginMutation, registerMutation, logoutMutation };
};