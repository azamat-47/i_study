// hooks/useUsers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

// API funksiyalari

// Get all users
const getAllUsers = async () => {
  const response = await API.get('/users');
  return response.data;
};

// Get user by ID
const getUserById = async ({ queryKey }) => {
  const [, userId] = queryKey;
  const response = await API.get(`/users/${userId}`);
  return response.data;
};

// Create User (Authdagi registerdan farqli, admin uchun bo'lishi mumkin)
const createUser = async (payload) => {
  if (!payload.username || !payload.password) {
    throw new Error("Foydalanuvchi nomi va paroli majburiy.");
  }
  const response = await API.post('/users', payload);
  return response.data;
};

// Delete User
const deleteUser = async (id) => {
  const response = await API.delete(`/users/${id}`);
  return response.data;
};

// Get Users by Branch
const getUsersByBranch = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/users/branch/${branchId}`);
  return response.data;
};

// useUsers hook
const useUsers = (branchId) => {
  const queryClient = useQueryClient();

  // Get all users
  const allUsersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  // Get a single user by ID
  const userByIdQuery = (userId) => useQuery({
    queryKey: ['user', userId],
    queryFn: getUserById,
    enabled: !!userId,
  });

  // Create User
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onMutate: () => {
      toast.loading("Foydalanuvchi qo'shilmoqda...", { id: "createUser" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-by-branch', branchId] }); // Filial bo'yicha foydalanuvchilar keshini yangilash
      toast.success("Foydalanuvchi muvaffaqiyatli qo'shildi!", { id: "createUser" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Foydalanuvchi qo'shishda xatolik yuz berdi.", { id: "createUser" });
    }
  });

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onMutate: () => {
      toast.loading("Foydalanuvchi o'chirilmoqda...", { id: "deleteUser" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users-by-branch', branchId] });
      toast.success("Foydalanuvchi muvaffaqiyatli o'chirildi!", { id: "deleteUser" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Foydalanuvchini o'chirishda xatolik yuz berdi.", { id: "deleteUser" });
    }
  });

  // Get Users by Branch
  const usersByBranchQuery = useQuery({
    queryKey: ['users-by-branch', branchId],
    queryFn: getUsersByBranch,
    enabled: !!branchId,
  });

  return {
    allUsersQuery,
    userByIdQuery,
    createUserMutation,
    deleteUserMutation,
    usersByBranchQuery,
  };
};

export default useUsers;