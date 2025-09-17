import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

// API funksiyalari

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

// usePayments hook
const usePayment = ({ branchId, year, month }) => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['payments', branchId] });
      queryClient.invalidateQueries({ queryKey: ['student-payment-history', data.studentId] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      queryClient.invalidateQueries({ queryKey: ['unpaid-students', branchId, year, month] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary', branchId] });
      queryClient.invalidateQueries({ queryKey: ['payment-reports', branchId] });
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
      queryClient.invalidateQueries({ queryKey: ['payments', branchId] });
      queryClient.invalidateQueries({ queryKey: ['student-payment-history', data.studentId] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      queryClient.invalidateQueries({ queryKey: ['unpaid-students', branchId, year, month] });
      queryClient.invalidateQueries({ queryKey: ['financial-summary', branchId] });
      queryClient.invalidateQueries({ queryKey: ['payment-reports', branchId] });
      toast.success("To'lov muvaffaqiyatli o'chirildi!", { id: "deletePayment" });
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || err.message || "To'lov o'chirishda xatolik yuz berdi.",
        { id: "deletePayment" }
      );
    }
  });

  const getUnpaidStudentsQuery = useQuery({
    queryKey: ['unpaid-students', branchId, year, month],
    queryFn: getUnpaidStudents,
    enabled: !!branchId,
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

  return {
    paymentsQuery,
    createPaymentMutation,
    deletePaymentMutation,
    paymentsByStudentQuery,
    getUnpaidStudentsQuery,
    paymentsByMonthQuery
  };
};

export default usePayment;
