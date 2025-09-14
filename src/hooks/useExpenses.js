// hooks/useExpenses.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

// API funksiyalari

// Get all expenses by branch
const getExpensesByBranch = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/expenses?branchId=${branchId}`);
  return response.data;
};

// Get expense by ID
const getExpenseById = async ({ queryKey }) => {
  const [, expenseId] = queryKey;
  const response = await API.get(`/expenses/${expenseId}`);
  return response.data;
};

// Create Expense
const createExpense = async (payload) => {
  if (!payload.amount || !payload.category || !payload.branchId) {
    throw new Error("Miqdor, kategoriya va filial majburiy.");
  }
  const response = await API.post('/expenses', payload);
  return response.data;
};

// Update Expense
const updateExpense = async ({ id, payload }) => {
  if (!payload.amount || !payload.category || !payload.branchId) {
    throw new Error("Miqdor, kategoriya va filial majburiy.");
  }
  const response = await API.put(`/expenses/${id}`, payload);
  return response.data;
};

// Delete Expense
const deleteExpense = async (id) => {
  const response = await API.delete(`/expenses/${id}`);
  return response.data;
};

// useExpenses hook
const useExpenses = (branchId) => {
  const queryClient = useQueryClient();

  // Get all expenses for a branch
  const expensesQuery = useQuery({
    queryKey: ['expenses', branchId],
    queryFn: getExpensesByBranch,
    enabled: !!branchId,
  });

  // Get a single expense by ID
  const expenseByIdQuery = (expenseId) => useQuery({
    queryKey: ['expense', expenseId],
    queryFn: getExpenseById,
    enabled: !!expenseId,
  });

  // Create Expense
  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onMutate: () => {
      toast.loading("Xarajat qo'shilmoqda...", { id: "createExpense" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', branchId] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary', branchId] }); // Moliyaviy xulosani yangilash
      queryClient.invalidateQueries({ queryKey: ['expense-reports', branchId] }); // Xarajat hisobotlarini yangilash
      toast.success("Xarajat muvaffaqiyatli qo'shildi!", { id: "createExpense" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Xarajat qo'shishda xatolik yuz berdi.", { id: "createExpense" });
    }
  });

  // Update Expense
  const updateExpenseMutation = useMutation({
    mutationFn: updateExpense,
    onMutate: () => {
      toast.loading("Xarajat yangilanmoqda...", { id: "updateExpense" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', branchId] });
      queryClient.invalidateQueries({ queryKey: ['expense', data.id] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary', branchId] });
      queryClient.invalidateQueries({ queryKey: ['expense-reports', branchId] });
      toast.success("Xarajat muvaffaqiyatli yangilandi!", { id: "updateExpense" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Xarajatni yangilashda xatolik yuz berdi.", { id: "updateExpense" });
    }
  });

  // Delete Expense
  const deleteExpenseMutation = useMutation({
    mutationFn: deleteExpense,
    onMutate: () => {
      toast.loading("Xarajat o'chirilmoqda...", { id: "deleteExpense" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', branchId] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary', branchId] });
      queryClient.invalidateQueries({ queryKey: ['expense-reports', branchId] });
      toast.success("Xarajat muvaffaqiyatli o'chirildi!", { id: "deleteExpense" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Xarajatni o'chirishda xatolik yuz berdi.", { id: "deleteExpense" });
    }
  });

  return {
    expensesQuery,
    expenseByIdQuery,
    createExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation,
  };
};

export default useExpenses;