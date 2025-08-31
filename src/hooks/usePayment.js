import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import toast from "react-hot-toast";

const Get_Payment = async () => {
    const response = await API.get("/payments");
    return response.data;
}

const Post_Payment = async (payload) => {
    if (!payload.amount || !payload.studentId || !payload.courseId || !payload.paymentDate || !payload.paymentMonth || !payload.studentName || !payload.courseName) {
        throw new Error("Maydonlarni to'ldirish talab qilinadi!");
    }
    
    const response = await API.post("/payments", payload);
    return response.data;
}

const Get_Payment_ByMonth = async ({ queryKey }) => {
    const [_key, month] = queryKey;
    if (!month) throw new Error("Oy talab qilinadi!");
    const response = await API.get("/api/admin/payments/by-month", { params: { month } });
    return response.data;
}

const Get_Payment_All_Unpaid = async ({ queryKey }) => {
    const [_key, month] = queryKey;
    const response = await API.get("/api/admin/payments/all-unpaid", { params: { month } });
    return response.data;
}

const Delete_Payment = async (id) => {
    if (!id) throw new Error("Id talab qilinadi!");
    const response = await API.delete(`/payments/${id}`);
    return response.data;
}

const Get_Expenses = async () => {
    const response = await API.get("/api/admin/expenses");
    return response.data;
}

const Get_Expenses_By_Month = async ({ queryKey }) => {
    const [_key, month] = queryKey;
    if (!month) throw new Error("Oy talab qilinadi!");
    const response = await API.get("/api/admin/expenses/by-month", { params: { month } });
    return response.data;
}

const Post_Expense = async (payload) => {
    if (!payload.amount || !payload.expenseDate || !payload.name || !payload.expenseMonth) {
        throw new Error("Maydonlarni to'ldirish talab qilinadi!");
    }
    const response = await API.post("/api/admin/expenses", payload);
    return response.data;
}

const Post_Expense_Teacher_Salary_Full = async (payload) => {
    if (!payload.teacherId || !payload.month ) {
        throw new Error("Maydonlarni to'ldirish talab qilinadi!");
    }
    const response = await API.post("/api/admin/pay-teacher-salary", payload);
    return response.data;
}


const Delete_Expense = async (id) => {
    if (!id) throw new Error("Id talab qilinadi!");
    const response = await API.delete(`/api/admin/expenses/${id}`);
    return response.data;
}

const Get_Financial_Summary = async ({ queryKey }) => {
    const [_key, month] = queryKey;
    if (!month) throw new Error("Oy talab qilinadi!");
    const response = await API.get("/api/admin/financial-summary", { params: { month } });
    return response.data;
}

const usePayment = (selectedMonth, selectedCourseId) => {
    const queryClient = useQueryClient();

    // Barcha to'lovlar
    const fetchPayment = useQuery({
        queryKey: ["payments"],
        queryFn: Get_Payment,
        staleTime: 5 * 60 * 1000, // 5 daqiqa
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

    // To'lov qo'shish mutation
    const postPaymentMutation = useMutation({
        mutationFn: Post_Payment,
        onSuccess: () => {
            // Barcha tegishli cache'larni yangilash
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["payments-by-month"] });
            queryClient.invalidateQueries({ queryKey: ["all-unpaid"] });
            queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
            toast.success("To'lov muvaffaqiyatli qo'shildi!");
        },
        onError: (error) => {
            toast.error(error.response.data.message);
            
        }
    });

    // To'lov o'chirish mutation
    const deletePaymentMutation = useMutation({
        mutationFn: Delete_Payment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["payments-by-month"] });
            queryClient.invalidateQueries({ queryKey: ["all-unpaid"] });
            queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
            toast.success("To'lov muvaffaqiyatli o'chirildi!");
        },
        onError: (error) => {
            toast.error(error.message || "To'lov o'chirishda xatolik yuz berdi!");
        }
    });

    // Xarajat qo'shish mutation
    const postExpenseMutation = useMutation({
        mutationFn: Post_Expense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            queryClient.invalidateQueries({ queryKey: ["expenses-by-month"] });
            queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
            toast.success("Xarajat muvaffaqiyatli qo'shildi!");
        },
        onError: (error) => {
            toast.error(error.message || "Xarajat qo'shishda xatolik yuz berdi!");
        }
    });

    // Xarajat o'qituvchi maoshini to'lash mutation
    const postTeacherSalaryExpenseMutation = useMutation({
        mutationFn: Post_Expense_Teacher_Salary_Full,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            queryClient.invalidateQueries({ queryKey: ["expenses-by-month"] });
            queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
            toast.success("O'qituvchi maoshi muvaffaqiyatli to'landi!");
        },
        onError: (error) => {
            toast.error(error.message || "O'qituvchi maoshini to'lashda xatolik yuz berdi!");
        }
    });

    // Xarajat o'chirish mutation
    const deleteExpenseMutation = useMutation({
        mutationFn: Delete_Expense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            queryClient.invalidateQueries({ queryKey: ["expenses-by-month"] });
            queryClient.invalidateQueries({ queryKey: ["financial-summary"] });
            toast.success("Xarajat muvaffaqiyatli o'chirildi!");
        },
        onError: (error) => {
            toast.error(error.message || "Xarajat o'chirishda xatolik yuz berdi!");
        }
    });

    // Ma'lumotlarni qayta yuklash funksiyalari
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
        
        // Utility functions
        refetchPaymentData,
        refetchExpenseData,
        
        // Loading states
        isLoading: fetchPayment.isLoading || 
                  fetchPaymentByMonth.isLoading || 
                  fetchAllUnpaid.isLoading || 
                  fetchExpenses.isLoading ||
                  fetchExpensesByMonth.isLoading ||
                  fetchFinancialSummary.isLoading,
                  
        // Error states
        error: fetchPayment.error || 
               fetchPaymentByMonth.error || 
               fetchAllUnpaid.error || 
               fetchExpenses.error ||
               fetchExpensesByMonth.error ||
               fetchFinancialSummary.error
    };
}

export default usePayment;