import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

// ============== EXPENSE API FUNCTIONS ==============

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

// ============== PAYMENT API FUNCTIONS ==============

// Get all payments by branch
const getPaymentsByBranch = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/payments?branchId=${branchId}`);
  return response.data;
};

// Create Payment
const createPayment = async (payload) => {
  if (!payload.studentId || !payload.groupId || !payload.amount || !payload.branchId) {
    throw new Error("Talaba, kurs, miqdor va filial majburiy.");
  }
  const response = await API.post('/payments', payload);
  return response.data;
};

// Get Payments by Student
const getPaymentsByStudent = async ({ queryKey }) => {
  const [, studentId] = queryKey;
  const response = await API.get(`/payments/student/${studentId}`);
  return response.data;
};

const getPaymentByMonth = async (payload) => {
  if (!payload.branchId || !payload.year || !payload.month) {
    throw new Error("Branch ID, yil va oy majburiy");
  }
  const response = await API.get(
    `/payments/by-month?branchId=${payload.branchId}&year=${payload.year}&month=${payload.month}`
  );
  return response.data;
};

// Get Unpaid Students
const getUnpaidStudents = async ({ queryKey }) => {
  const [, branchId, year, month] = queryKey;
  const response = await API.get(
    `/payments/unpaid?branchId=${branchId}${year ? `&year=${year}` : ''}${month ? `&month=${month}` : ''}`
  );
  return response.data;
};

const deletePayment = async (paymentId) => {
  const response = await API.delete(`/payments/${paymentId}`);
  return response.data;
};

// ============== REPORTS API FUNCTIONS ==============

// Get Financial Summary (oylik)
const getFinancialSummary = async ({ queryKey }) => {
  const [, { branchId, year, month }] = queryKey;
  if (!branchId || !year || !month) {
    throw new Error("Yil, oy va filial ID majburiy.");
  }
  const response = await API.get(
    `/reports/financial/summary?branchId=${branchId}&year=${year}&month=${month}`
  );
  return response.data;
};

// Get Financial Summary Range (muddat oralig'i bo'yicha)
const getFinancialSummaryRange = async ({ queryKey }) => {
  const [, { branchId, startDate, endDate }] = queryKey;
  if (!branchId || !startDate || !endDate) {
    throw new Error("Boshlanish sanasi, tugash sanasi va filial ID majburiy.");
  }
  const response = await API.get(
    `/reports/financial/summary-range?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};

// ============== COMBINED FINANCE HOOK ==============

const useFinance = ({ branchId, year, month }) => {
  const queryClient = useQueryClient();

  // Helper function to invalidate all related queries
  const invalidateAllQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['expenses', branchId] });
    queryClient.invalidateQueries({ queryKey: ['payments', branchId] });
    queryClient.invalidateQueries({ queryKey: ['unpaid-students'] }); // Barcha unpaid-students querylarini tozalash
    queryClient.invalidateQueries({ queryKey: ['payments-by-month'] });
    queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
    queryClient.invalidateQueries({ queryKey: ['financial-summary-range'] });
    queryClient.invalidateQueries({ queryKey: ['payment-reports', branchId] });
    queryClient.invalidateQueries({ queryKey: ['expense-reports', branchId] });
    queryClient.invalidateQueries({ queryKey: ['students', branchId] });
    
    // Eski unpaid-students cache'larini tozalash
    queryClient.removeQueries({ 
      queryKey: ['unpaid-students'], 
      exact: false 
    });
  };

  // ============== EXPENSE QUERIES AND MUTATIONS ==============

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
      invalidateAllQueries();
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
      invalidateAllQueries();
      queryClient.invalidateQueries({ queryKey: ['expense', data.id] });
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
      invalidateAllQueries();
      toast.success("Xarajat muvaffaqiyatli o'chirildi!", { id: "deleteExpense" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Xarajatni o'chirishda xatolik yuz berdi.", { id: "deleteExpense" });
    }
  });

  // ============== PAYMENT QUERIES AND MUTATIONS ==============

  // Get all payments for a branch
  const paymentsQuery = useQuery({
    queryKey: ['payments', branchId],
    queryFn: getPaymentsByBranch,
    enabled: !!branchId,
  });

  // Create Payment
  const createPaymentMutation = useMutation({
    mutationFn: createPayment,
    onMutate: () => {
      toast.loading("To'lov qabul qilinmoqda...", { id: "createPayment" });
    },
    onSuccess: (data) => {
      invalidateAllQueries();
      queryClient.invalidateQueries({ queryKey: ['student-payment-history', data.studentId] });
      toast.success("To'lov muvaffaqiyatli qabul qilindi!", { id: "createPayment" });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "To'lov qabul qilishda xatolik yuz berdi.",
        { id: "createPayment" }
      );
    }
  });

  const deletePaymentMutation = useMutation({
    mutationFn: deletePayment,
    onMutate: () => {
      toast.loading("To'lov o'chirilmoqda...", { id: "deletePayment" });
    },
    onSuccess: (data) => {
      invalidateAllQueries();
      queryClient.invalidateQueries({ queryKey: ['student-payment-history', data?.studentId] });
      toast.success("To'lov muvaffaqiyatli o'chirildi!", { id: "deletePayment" });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "To'lov o'chirishda xatolik yuz berdi.",
        { id: "deletePayment" }
      );
    }
  });

  const unpaidStudentsQuery = useQuery({
    queryKey: ['unpaid-students', branchId, year, month],
    queryFn: getUnpaidStudents,
    enabled: !!branchId && !!year && !!month,
    staleTime: 0, // Ma'lumotlar darhol eskiradi
    cacheTime: 0, // Cache'da saqlanmaydi
    keepPreviousData: false, // Oldingi ma'lumotlarni saqlamaydi
  });

  // Get Payments by Student
  const paymentsByStudentQuery = (studentId) =>
    useQuery({
      queryKey: ['payments-by-student', studentId],
      queryFn: getPaymentsByStudent,
      enabled: !!studentId,
    });

  const paymentsByMonthQuery = ({ branchId, year, month }) =>
    useQuery({
      queryKey: ['payments-by-month', { branchId, year, month }],
      queryFn: () => getPaymentByMonth({ branchId, year, month }),
      enabled: !!branchId && !!year && !!month,
    });

  // ============== REPORTS QUERIES ==============

  const financialSummaryQuery = ({ year, month }) =>
    useQuery({
      queryKey: ['financial-summary', { branchId, year, month }],
      queryFn: getFinancialSummary,
      enabled: !!branchId && !!year && !!month,
    });

  const financialSummaryRangeQuery = ({ startDate, endDate }) =>
    useQuery({
      queryKey: ['financial-summary-range', { branchId, startDate, endDate }],
      queryFn: getFinancialSummaryRange,
      enabled: !!branchId && !!startDate && !!endDate,
    });

  // Refresh functions
  const refreshFinancialSummary = () =>
    queryClient.invalidateQueries({ queryKey: ['financial-summary'] });
  
  const refreshFinancialSummaryRange = () =>
    queryClient.invalidateQueries({ queryKey: ['financial-summary-range'] });

  const refreshAllData = () => {
    // Barcha cache'ni tozalash
    queryClient.removeQueries({ 
      queryKey: ['unpaid-students'], 
      exact: false 
    });
    
    invalidateAllQueries();
  };

  return {
    // Expense queries and mutations
    expensesQuery,
    expenseByIdQuery,
    createExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation,
    
    // Payment queries and mutations
    paymentsQuery,
    createPaymentMutation,
    deletePaymentMutation,
    paymentsByStudentQuery,
    unpaidStudentsQuery,
    paymentsByMonthQuery,
    
    // Report queries
    financialSummaryQuery,
    financialSummaryRangeQuery,
    
    // Refresh functions
    refreshFinancialSummary,
    refreshFinancialSummaryRange,
    refreshAllData,
  };
};

export default useFinance;