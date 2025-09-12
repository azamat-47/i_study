// hooks/usePayments.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../API';
import { toast } from 'react-hot-toast';

// API funksiyalari

// Get all payments by branch
const getPaymentsByBranch = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/payments?branchId=${branchId}`);
  return response.data;
};

// Get payment by ID
const getPaymentById = async ({ queryKey }) => {
  const [, paymentId] = queryKey;
  const response = await API.get(`/payments/${paymentId}`);
  return response.data;
};

// Create Payment
const createPayment = async (payload) => {
  if (!payload.studentId || !payload.courseId || !payload.amount || !payload.branchId) {
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

// usePayments hook
export const usePayments = (branchId) => {
  const queryClient = useQueryClient();

  // Get all payments for a branch
  const paymentsQuery = useQuery({
    queryKey: ['payments', branchId],
    queryFn: getPaymentsByBranch,
    enabled: !!branchId,
  });

  // Get a single payment by ID
  const paymentByIdQuery = (paymentId) => useQuery({
    queryKey: ['payment', paymentId],
    queryFn: getPaymentById,
    enabled: !!paymentId,
  });

  // Create Payment
  const createPaymentMutation = useMutation({
    mutationFn: createPayment,
    onMutate: () => {
      toast.loading("To'lov qabul qilinmoqda...", { id: "createPayment" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments', branchId] });
      queryClient.invalidateQueries({ queryKey: ['student-payment-history', data.studentId] }); // Talabaning to'lov tarixini yangilash
      queryClient.invalidateQueries({ queryKey: ['students', branchId] }); // Talabalar ro'yxatini yangilash (to'lov holati o'zgargani uchun)
      queryClient.invalidateQueries({ queryKey: ['unpaid-students', branchId] }); // To'lanmagan talabalarni yangilash
      queryClient.invalidateQueries({ queryKey: ['financial-summary', branchId] }); // Moliyaviy xulosani yangilash
      queryClient.invalidateQueries({ queryKey: ['payment-reports', branchId] }); // To'lov hisobotlarini yangilash
      toast.success("To'lov muvaffaqiyatli qabul qilindi!", { id: "createPayment" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "To'lov qabul qilishda xatolik yuz berdi.", { id: "createPayment" });
    }
  });

  // Get Payments by Student
  const paymentsByStudentQuery = (studentId) => useQuery({
    queryKey: ['payments-by-student', studentId],
    queryFn: getPaymentsByStudent,
    enabled: !!studentId,
  });

  return {
    paymentsQuery,
    paymentByIdQuery,
    createPaymentMutation,
    paymentsByStudentQuery,
  };
};