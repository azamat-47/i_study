// hooks/useReports.js
import { useQuery } from '@tanstack/react-query';
import API from '../API';

// API funksiyalari

// Get Salary Range Report
const getSalaryRangeReport = async ({ queryKey }) => {
  const [, { branchId, startYear, startMonth, endYear, endMonth }] = queryKey;
  if (!branchId || !startYear || !startMonth || !endYear || !endMonth) {
    throw new Error("Barcha sana parametrlari va filial ID majburiy.");
  }
  const response = await API.get(`/reports/salaries/range?branchId=${branchId}&startYear=${startYear}&startMonth=${startMonth}&endYear=${endYear}&endMonth=${endMonth}`);
  return response.data;
};

// Get Monthly Salary Report
const getMonthlySalaryReport = async ({ queryKey }) => {
  const [, { branchId, year, month }] = queryKey;
  if (!branchId || !year || !month) {
    throw new Error("Yil, oy va filial ID majburiy.");
  }
  const response = await API.get(`/reports/salaries/monthly?branchId=${branchId}&year=${year}&month=${month}`);
  return response.data;
};

// Get Payment Range Report
const getPaymentRangeReport = async ({ queryKey }) => {
  const [, { branchId, startDate, endDate }] = queryKey;
  if (!branchId || !startDate || !endDate) {
    throw new Error("Boshlanish sanasi, tugash sanasi va filial ID majburiy.");
  }
  const response = await API.get(`/reports/payments/range?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

// Get Monthly Payment Report
const getMonthlyPaymentReport = async ({ queryKey }) => {
  const [, { branchId, year, month }] = queryKey;
  if (!branchId || !year || !month) {
    throw new Error("Yil, oy va filial ID majburiy.");
  }
  const response = await API.get(`/reports/payments/monthly?branchId=${branchId}&year=${year}&month=${month}`);
  return response.data;
};

// Get Daily Payment Report
const getDailyPaymentReport = async ({ queryKey }) => {
  const [, { branchId, date }] = queryKey;
  if (!branchId || !date) {
    throw new Error("Sana va filial ID majburiy.");
  }
  const response = await API.get(`/reports/payments/daily?branchId=${branchId}&date=${date}`);
  return response.data;
};

// Get Financial Summary
const getFinancialSummary = async ({ queryKey }) => {
  const [, { branchId, year, month }] = queryKey;
  if (!branchId || !year || !month) {
    throw new Error("Yil, oy va filial ID majburiy.");
  }
  const response = await API.get(`/reports/financial/summary?branchId=${branchId}&year=${year}&month=${month}`);
  return response.data;
};

// Get Financial Summary Range
const getFinancialSummaryRange = async ({ queryKey }) => {
  const [, { branchId, startDate, endDate }] = queryKey;
  if (!branchId || !startDate || !endDate) {
    throw new Error("Boshlanish sanasi, tugash sanasi va filial ID majburiy.");
  }
  const response = await API.get(`/reports/financial/summary-range?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

// Get Expense Range Report
const getExpenseRangeReport = async ({ queryKey }) => {
  const [, { branchId, startDate, endDate }] = queryKey;
  if (!branchId || !startDate || !endDate) {
    throw new Error("Boshlanish sanasi, tugash sanasi va filial ID majburiy.");
  }
  const response = await API.get(`/reports/expenses/range?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

// Get Monthly Expense Report
const getMonthlyExpenseReport = async ({ queryKey }) => {
  const [, { branchId, year, month }] = queryKey;
  if (!branchId || !year || !month) {
    throw new Error("Yil, oy va filial ID majburiy.");
  }
  const response = await API.get(`/reports/expenses/monthly?branchId=${branchId}&year=${year}&month=${month}`);
  return response.data;
};

// Get Daily Expense Report
const getDailyExpenseReport = async ({ queryKey }) => {
  const [, { branchId, date }] = queryKey;
  if (!branchId || !date) {
    throw new Error("Sana va filial ID majburiy.");
  }
  const response = await API.get(`/reports/expenses/daily?branchId=${branchId}&date=${date}`);
  return response.data;
};

// Get All Time Expense Report
const getAllTimeExpenseReport = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  if (!branchId) {
    throw new Error("Filial ID majburiy.");
  }
  const response = await API.get(`/reports/expenses/all-time?branchId=${branchId}`);
  return response.data;
};


// useReports hook
export const useReports = (branchId) => {
  // Get Salary Range Report
  const salaryRangeReportQuery = ({ startYear, startMonth, endYear, endMonth }) => useQuery({
    queryKey: ['salary-reports-range', { branchId, startYear, startMonth, endYear, endMonth }],
    queryFn: getSalaryRangeReport,
    enabled: !!branchId && !!startYear && !!startMonth && !!endYear && !!endMonth,
    onError: (err) => {
        // toast.error(err.message || "Ish haqi oralig'i hisobotini olishda xatolik yuz berdi.");
    }
  });

  // Get Monthly Salary Report
  const monthlySalaryReportQuery = ({ year, month }) => useQuery({
    queryKey: ['salary-reports-monthly', { branchId, year, month }],
    queryFn: getMonthlySalaryReport,
    enabled: !!branchId && !!year && !!month,
    onError: (err) => {
        // toast.error(err.message || "Oylik ish haqi hisobotini olishda xatolik yuz berdi.");
    }
  });

  // Get Payment Range Report
  const paymentRangeReportQuery = ({ startDate, endDate }) => useQuery({
    queryKey: ['payment-reports-range', { branchId, startDate, endDate }],
    queryFn: getPaymentRangeReport,
    enabled: !!branchId && !!startDate && !!endDate,
    onError: (err) => {
        // toast.error(err.message || "To'lov oralig'i hisobotini olishda xatolik yuz berdi.");
    }
  });

  // Get Monthly Payment Report
  const monthlyPaymentReportQuery = ({ year, month }) => useQuery({
    queryKey: ['payment-reports-monthly', { branchId, year, month }],
    queryFn: getMonthlyPaymentReport,
    enabled: !!branchId && !!year && !!month,
    onError: (err) => {
        // toast.error(err.message || "Oylik to'lov hisobotini olishda xatolik yuz berdi.");
    }
  });

  // Get Daily Payment Report
  const dailyPaymentReportQuery = ({ date }) => useQuery({
    queryKey: ['payment-reports-daily', { branchId, date }],
    queryFn: getDailyPaymentReport,
    enabled: !!branchId && !!date,
    onError: (err) => {
        // toast.error(err.message || "Kundalik to'lov hisobotini olishda xatolik yuz berdi.");
    }
  });

  // Get Financial Summary
  const financialSummaryQuery = ({ year, month }) => useQuery({
    queryKey: ['financial-summary', { branchId, year, month }],
    queryFn: getFinancialSummary,
    enabled: !!branchId && !!year && !!month,
    onError: (err) => {
        // toast.error(err.message || "Moliyaviy xulosani olishda xatolik yuz berdi.");
    }
  });

  // Get Financial Summary Range
  const financialSummaryRangeQuery = ({ startDate, endDate }) => useQuery({
    queryKey: ['financial-summary-range', { branchId, startDate, endDate }],
    queryFn: getFinancialSummaryRange,
    enabled: !!branchId && !!startDate && !!endDate,
    onError: (err) => {
        // toast.error(err.message || "Moliyaviy xulosa oralig'ini olishda xatolik yuz berdi.");
    }
  });

  // Get Expense Range Report
  const expenseRangeReportQuery = ({ startDate, endDate }) => useQuery({
    queryKey: ['expense-reports-range', { branchId, startDate, endDate }],
    queryFn: getExpenseRangeReport,
    enabled: !!branchId && !!startDate && !!endDate,
    onError: (err) => {
        // toast.error(err.message || "Xarajat oralig'i hisobotini olishda xatolik yuz berdi.");
    }
  });

  // Get Monthly Expense Report
  const monthlyExpenseReportQuery = ({ year, month }) => useQuery({
    queryKey: ['expense-reports-monthly', { branchId, year, month }],
    queryFn: getMonthlyExpenseReport,
    enabled: !!branchId && !!year && !!month,
    onError: (err) => {
        // toast.error(err.message || "Oylik xarajat hisobotini olishda xatolik yuz berdi.");
    }
  });

  // Get Daily Expense Report
  const dailyExpenseReportQuery = ({ date }) => useQuery({
    queryKey: ['expense-reports-daily', { branchId, date }],
    queryFn: getDailyExpenseReport,
    enabled: !!branchId && !!date,
    onError: (err) => {
        // toast.error(err.message || "Kundalik xarajat hisobotini olishda xatolik yuz berdi.");
    }
  });

  // Get All Time Expense Report
  const allTimeExpenseReportQuery = useQuery({
    queryKey: ['expense-reports-all-time', branchId],
    queryFn: getAllTimeExpenseReport,
    enabled: !!branchId,
    onError: (err) => {
        // toast.error(err.message || "Barcha vaqtlar uchun xarajat hisobotini olishda xatolik yuz berdi.");
    }
  });

  return {
    salaryRangeReportQuery,
    monthlySalaryReportQuery,
    paymentRangeReportQuery,
    monthlyPaymentReportQuery,
    dailyPaymentReportQuery,
    financialSummaryQuery,
    financialSummaryRangeQuery,
    expenseRangeReportQuery,
    monthlyExpenseReportQuery,
    dailyExpenseReportQuery,
    allTimeExpenseReportQuery,
  };
};