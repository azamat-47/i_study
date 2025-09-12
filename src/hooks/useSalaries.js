// hooks/useSalaries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../API';
import { toast } from 'react-hot-toast';

// API funksiyalari

// Calculate Teacher Salary
const calculateTeacherSalary = async ({ teacherId, payload }) => {
  if (!payload.year || !payload.month) {
    throw new Error("Yil va oy majburiy.");
  }
  const response = await API.post(`/salaries/calculate/teacher/${teacherId}`, payload);
  return response.data;
};

// Calculate Salaries for Branch
const calculateSalariesForBranch = async ({ branchId, payload }) => {
  if (!payload.year || !payload.month) {
    throw new Error("Yil va oy majburiy.");
  }
  const response = await API.post(`/salaries/calculate/branch/${branchId}`, payload);
  return response.data;
};

// Mark Salary As Paid
const markSalaryAsPaid = async (calculationId) => {
  const response = await API.put(`/salaries/${calculationId}/mark-paid`);
  return response.data;
};

// Get Teacher Salary History
const getTeacherSalaryHistory = async ({ queryKey }) => {
  const [, teacherId] = queryKey;
  const response = await API.get(`/salaries/history/teacher/${teacherId}`);
  return response.data;
};

// Get Salary History for Branch
const getSalaryHistoryForBranch = async ({ queryKey }) => {
  const [, branchId, year, month] = queryKey;
  const response = await API.get(`/salaries/history/branch/${branchId}?year=${year}&month=${month}`);
  return response.data;
};

// useSalaries hook
export const useSalaries = (branchId) => {
  const queryClient = useQueryClient();

  // Calculate Teacher Salary
  const calculateTeacherSalaryMutation = useMutation({
    mutationFn: calculateTeacherSalary,
    onMutate: () => {
      toast.loading("O'qituvchi ish haqi hisoblanmoqda...", { id: "calculateTeacherSalary" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-salary-history', data.teacherId] });
      queryClient.invalidateQueries({ queryKey: ['salary-history-branch', branchId] });
      queryClient.invalidateQueries({ queryKey: ['salary-reports', branchId] }); // Hisobotlarni yangilash
      toast.success("O'qituvchi ish haqi muvaffaqiyatli hisoblandi!", { id: "calculateTeacherSalary" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Ish haqi hisoblashda xatolik yuz berdi.", { id: "calculateTeacherSalary" });
    }
  });

  // Calculate Salaries for Branch
  const calculateSalariesForBranchMutation = useMutation({
    mutationFn: calculateSalariesForBranch,
    onMutate: () => {
      toast.loading("Filial ish haqlari hisoblanmoqda...", { id: "calculateBranchSalaries" });
    },
    onSuccess: (data) => {
      // Har bir o'qituvchi uchun tarixni yangilash
      data.forEach(salary => queryClient.invalidateQueries({ queryKey: ['teacher-salary-history', salary.teacherId] }));
      queryClient.invalidateQueries({ queryKey: ['salary-history-branch', branchId] });
      queryClient.invalidateQueries({ queryKey: ['salary-reports', branchId] });
      toast.success("Filial ish haqlari muvaffaqiyatli hisoblandi!", { id: "calculateBranchSalaries" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Filial ish haqlari hisoblashda xatolik yuz berdi.", { id: "calculateBranchSalaries" });
    }
  });

  // Mark Salary As Paid
  const markSalaryAsPaidMutation = useMutation({
    mutationFn: markSalaryAsPaid,
    onMutate: () => {
      toast.loading("Ish haqi to'landi deb belgilanmoqda...", { id: "markSalaryPaid" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-salary-history', data.teacherId] });
      queryClient.invalidateQueries({ queryKey: ['salary-history-branch', branchId] });
      queryClient.invalidateQueries({ queryKey: ['salary-reports', branchId] });
      toast.success("Ish haqi muvaffaqiyatli to'landi deb belgilandi!", { id: "markSalaryPaid" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Ish haqi to'landi deb belgilashda xatolik yuz berdi.", { id: "markSalaryPaid" });
    }
  });

  // Get Teacher Salary History
  const teacherSalaryHistoryQuery = (teacherId) => useQuery({
    queryKey: ['teacher-salary-history', teacherId],
    queryFn: getTeacherSalaryHistory,
    enabled: !!teacherId,
  });

  // Get Salary History for Branch
  const salaryHistoryForBranchQuery = (year, month) => useQuery({
    queryKey: ['salary-history-branch', branchId, year, month],
    queryFn: getSalaryHistoryForBranch,
    enabled: !!branchId && !!year && !!month,
  });

  return {
    calculateTeacherSalaryMutation,
    calculateSalariesForBranchMutation,
    markSalaryAsPaidMutation,
    teacherSalaryHistoryQuery,
    salaryHistoryForBranchQuery,
  };
};