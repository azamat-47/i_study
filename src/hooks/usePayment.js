import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import toast from "react-hot-toast";

const Get_Payment = async () => {
  const response = await API.get("/payments");
  return response.data;
};

const Post_Payment = async (payload) => {
  if (
    !payload.amount ||
    !payload.studentId ||
    !payload.courseId ||
    !payload.paymentDate ||
    !payload.paymentMonth ||
    !payload.studentName ||
    !payload.courseName
  ) {
    throw new Error("Maydonlarni to'ldirish talab qilinadi!");
  }
  const response = await API.post("/payments", payload);
  return response.data;
};

const Get_Payment_ByMonth = async ({ queryKey }) => {
  const [_key, month] = queryKey;
  if (!month) throw new Error("Oy talab qilinadi!");
  const response = await API.get("/api/admin/payments/by-month", {
    params: { month },
  });
  return response.data;
};

const Get_Payment_All_Unpaid = async ({ queryKey }) => {
  const [_key, month] = queryKey;
  const response = await API.get("/api/admin/payments/all-unpaid", {
    params: { month },
  });
  return response.data;
};

const Delete_Payment = async (id) => {
  if (!id) throw new Error("Id talab qilinadi!");
  const response = await API.delete(`/payments/${id}`);
  return response.data;
};

const Get_Expenses = async () => {
  const response = await API.get("/api/admin/expenses");
  return response.data;
};

const Get_Expenses_By_Month = async ({ queryKey }) => {
  const [_key, month] = queryKey;
  if (!month) throw new Error("Oy talab qilinadi!");
  const response = await API.get("/api/admin/expenses/by-month", {
    params: { month },
  });
  return response.data;
};

const Post_Expense = async (payload) => {
  if (
    !payload.amount ||
    !payload.expenseDate ||
    !payload.name ||
    !payload.expenseMonth
  ) {
    throw new Error("Maydonlarni to'ldirish talab qilinadi!");
  }
  const response = await API.post("/api/admin/expenses", payload);
  return response.data;
};

const Post_Expense_Teacher_Salary_Full = async (payload) => {
  if (!payload.teacherId || !payload.month) {
    throw new Error("Maydonlarni to'ldirish talab qilinadi!");
  }
  const response = await API.post("/api/admin/pay-teacher-salary", payload);
  return response.data;
};

const Delete_Expense = async (id) => {
  if (!id) throw new Error("Id talab qilinadi!");
  const response = await API.delete(`/api/admin/expenses/${id}`);
  return response.data;
};

const Get_Financial_Summary = async ({ queryKey }) => {
  const [_key, month] = queryKey;
  if (!month) throw new Error("Oy talab qilinadi!");
  const response = await API.get("/api/admin/financial-summary", {
    params: { month },
  });
  return response.data;
};

const usePayment = (selectedMonth) => {
  const queryClient = useQueryClient();

  // Barcha to'lovlar
  const fetchPayment = useQuery({
    queryKey: ["payments"],
    queryFn: Get_Payment,
    staleTime: 5 * 60 * 1000,
  });

  // Oylik to'lovlar
  const fetchPaymentByMonth = useQuery({
    queryKey: ["payments-by-month", selectedMonth],
    queryFn: Get_Payment_ByMonth,
    enabled: !!selectedMonth,
    staleTime: 5 * 60 * 1000,
  });

  // Barcha to'lanmaganlar
  const fetchAllUnpaid = useQuery({
    queryKey: ["all-unpaid", selectedMonth],
    queryFn: Get_Payment_All_Unpaid,
    enabled: !!selectedMonth,
    staleTime: 5 * 60 * 1000,
  });

  // Xarajatlar
  const fetchExpenses = useQuery({
    queryKey: ["expenses"],
    queryFn: Get_Expenses,
    staleTime: 5 * 60 * 1000,
  });

  // Oylik xarajatlar
  const fetchExpensesByMonth = useQuery({
    queryKey: ["expenses-by-month", selectedMonth],
    queryFn: Get_Expenses_By_Month,
    enabled: !!selectedMonth,
    staleTime: 5 * 60 * 1000,
  });

  // Moliyaviy xulosalar
  const fetchFinancialSummary = useQuery({
    queryKey: ["financial-summary", selectedMonth],
    queryFn: Get_Financial_Summary,
    enabled: !!selectedMonth,
    staleTime: 5 * 60 * 1000,
  });

  // To'lov qo'shish
  const postPaymentMutation = useMutation({
    mutationFn: Post_Payment,
    onMutate: () => {
      toast.loading("To'lov qo'shilmoqda...", { id: "postPayment" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments-by-month"] });
      queryClient.invalidateQueries({ queryKey: ["all-unpaid"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      toast.success("To'lov muvaffaqiyatli qo'shildi!", { id: "postPayment" });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "To'lov qo'shishda xatolik yuz berdi!",
        { id: "postPayment" }
      );
    },
  });

  // To'lov o'chirish
  const deletePaymentMutation = useMutation({
    mutationFn: Delete_Payment,
    onMutate: () => {
      toast.loading("To'lov o'chirilmoqda...", { id: "deletePayment" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payments-by-month"] });
      queryClient.invalidateQueries({ queryKey: ["all-unpaid"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      toast.success("To'lov muvaffaqiyatli o'chirildi!", {
        id: "deletePayment",
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "To'lov o'chirishda xatolik yuz berdi!",
        { id: "deletePayment" }
      );
    },
  });

  // Xarajat qo'shish
  const postExpenseMutation = useMutation({
    mutationFn: Post_Expense,
    onMutate: () => {
      toast.loading("Xarajat qo'shilmoqda...", { id: "postExpense" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-by-month"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      toast.success("Xarajat muvaffaqiyatli qo'shildi!", {
        id: "postExpense",
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Xarajat qo'shishda xatolik yuz berdi!",
        { id: "postExpense" }
      );
    },
  });

  // O'qituvchi maoshi
  const postTeacherSalaryExpenseMutation = useMutation({
    mutationFn: Post_Expense_Teacher_Salary_Full,
    onMutate: () => {
      toast.loading("O'qituvchi maoshi to'lanmoqda...", {
        id: "teacherSalary",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-by-month"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      toast.success("O'qituvchi maoshi muvaffaqiyatli to'landi!", {
        id: "teacherSalary",
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "O'qituvchi maoshini to'lashda xatolik yuz berdi!",
        { id: "teacherSalary" }
      );
    },
  });

  // Xarajat o'chirish
  const deleteExpenseMutation = useMutation({
    mutationFn: Delete_Expense,
    onMutate: () => {
      toast.loading("Xarajat o'chirilmoqda...", { id: "deleteExpense" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-by-month"] });
      queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
      toast.success("Xarajat muvaffaqiyatli o'chirildi!", {
        id: "deleteExpense",
      });
    },
    onError: (error) => {
      toast.error(
        error.message || "Xarajat o'chirishda xatolik yuz berdi!",
        { id: "deleteExpense" }
      );
    },
  });

  // Ma'lumotlarni qayta yuklash
  const refetchPaymentData = () => {
    queryClient.invalidateQueries({ queryKey: ["payments"] });
    queryClient.invalidateQueries({ queryKey: ["payments-by-month"] });
    queryClient.invalidateQueries({ queryKey: ["all-unpaid"] });
    queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
  };

  const refetchExpenseData = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["expenses-by-month"] });
    queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
  };

  return {
    // Queries
    fetchPayment,
    fetchPaymentByMonth,
    fetchAllUnpaid,
    fetchExpenses,
    fetchExpensesByMonth,
    fetchFinancialSummary,

    // Mutations
    postPaymentMutation,
    deletePaymentMutation,
    postExpenseMutation,
    deleteExpenseMutation,
    postTeacherSalaryExpenseMutation,

    // Utils
    refetchPaymentData,
    refetchExpenseData,

    // Loading/Error
    isLoading:
      fetchPayment.isLoading ||
      fetchPaymentByMonth.isLoading ||
      fetchAllUnpaid.isLoading ||
      fetchExpenses.isLoading ||
      fetchExpensesByMonth.isLoading ||
      fetchFinancialSummary.isLoading,
    error:
      fetchPayment.error ||
      fetchPaymentByMonth.error ||
      fetchAllUnpaid.error ||
      fetchExpenses.error ||
      fetchExpensesByMonth.error ||
      fetchFinancialSummary.error,
  };
};

export default usePayment;
