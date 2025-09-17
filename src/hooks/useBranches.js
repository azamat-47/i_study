// hooks/useBranches.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

// API funksiyalari

// Get all branches
const getAllBranches = async () => {
  const response = await API.get('/branches');
  return response.data;
};

// Get branch by ID
const getBranchById = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/branches/${branchId}`);
  return response.data;
};

// Create Branch
const createBranch = async (payload) => {
  if (!payload.name) {
    throw new Error("Filial nomi majburiy.");
  }
  const response = await API.post('/branches', payload);
  return response.data;
};

// Update Branch
const updateBranch = async ({ id, payload }) => {
  if (!payload.name) {
    throw new Error("Filial nomi majburiy.");
  }
  const response = await API.put(`/branches/${id}`, payload);
  return response.data;
};

// Delete Branch
const deleteBranch = async (id) => {
  const response = await API.delete(`/branches/${id}`);
  return response.data;
};

// useBranches hook
const useBranches = () => {
  const queryClient = useQueryClient();

  // Get all branches
  const branchesQuery = useQuery({
    queryKey: ['branches'],
    queryFn: getAllBranches,
  });

  // Get a single branch by ID
  const branchByIdQuery = (branchId) => useQuery({
    queryKey: ['branch', branchId],
    queryFn: getBranchById,
    enabled: !!branchId,
  });

  // Create Branch
  const createBranchMutation = useMutation({
    mutationFn: createBranch,
    onMutate: () => {
      toast.loading("Filial qo'shilmoqda...", { id: "createBranch" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] }); // Barcha filiallar keshini yangilash
      toast.success("Filial muvaffaqiyatli qo'shildi!", { id: "createBranch" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Filial qo'shishda xatolik yuz berdi.", { id: "createBranch" });
    }
  });

  // Update Branch
  const updateBranchMutation = useMutation({
    mutationFn: updateBranch,
    onMutate: () => {
      toast.loading("Filial yangilanmoqda...", { id: "updateBranch" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branch', data.id] });
      // Filial nomi o'zgargan bo'lishi mumkin, shuning uchun boshqa filialga bog'liq keshlar ham yangilanishi kerak
      // Masalan, foydalanuvchilar, o'qituvchilar, talabalar va boshqalar
      // Lekin barchasini invalidate qilish o'rniga, faqat tegishlilarini yangilash yaxshiroq
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      // ... va boshqalar
      toast.success("Filial muvaffaqiyatli yangilandi!", { id: "updateBranch" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Filialni yangilashda xatolik yuz berdi.", { id: "updateBranch" });
    }
  });

  // Delete Branch
  const deleteBranchMutation = useMutation({
    mutationFn: deleteBranch,
    onMutate: () => {
      toast.loading("Filial o'chirilmoqda...", { id: "deleteBranch" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success("Filial muvaffaqiyatli o'chirildi!", { id: "deleteBranch" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Filialni o'chirishda xatolik yuz berdi.", { id: "deleteBranch" });
    }
  });

  return {
    branchesQuery,
    branchByIdQuery,
    createBranchMutation,
    updateBranchMutation,
    deleteBranchMutation,
  };
};


export default useBranches;