import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


// Login API funksiyasi
const loginUser = async (credentials) => {
  const response = await API.post('/auth/login', credentials);
  const { accessToken, refreshToken, userId, username, branchId, branchName } = response.data;
  console.log(response.data);
  
  localStorage.setItem('istudyAccessToken', accessToken);
  localStorage.setItem('istudyRefreshToken', refreshToken);
  localStorage.setItem('userId', userId);
  localStorage.setItem('username', username);
  localStorage.setItem('branchId', branchId);
  localStorage.setItem('branchName', branchName);

  return response.data;
};


// Logout API funksiyasi
const logoutUser = async (userId) => {
  const response = await API.post(`/auth/logout?userId=${userId}`);
  localStorage.removeItem('istudyAccessToken');
  localStorage.removeItem('istudyRefreshToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('branchId');
  localStorage.removeItem('branchName');
  return response.data;
};

const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // navigate hook

  // Login
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      toast.loading("Tizimga kirilmoqda...", { id: "login" });
    },
    onSuccess: (data) => {
      toast.success("Muvaffaqiyatli tizimga kirdingiz!", { id: "login" });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/"); // react-router orqali yo'naltirish
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Tizimga kirishda xatolik yuz berdi.", 
        { id: "login" }
      );
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
      queryClient.clear();
      navigate("/login");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "Tizimdan chiqishda xatolik yuz berdi.", 
        { id: "logout" }
      );
    }
  });

  return { loginMutation, logoutMutation };
};

export default useAuth;
