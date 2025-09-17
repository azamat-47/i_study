import { useQuery, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import toast from 'react-hot-toast';

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

// Get Financial Summary Range (muddat oralig‘i bo‘yicha)
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

// useReports hook
const useReports = (branchId) => {
  const queryClient = useQueryClient();

  // Queries
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
    queryClient.invalidateQueries(['financial-summary']);
  const refreshFinancialSummaryRange = () =>
    queryClient.invalidateQueries(['financial-summary-range']);


  return {
    // queries
    financialSummaryQuery,
    financialSummaryRangeQuery,

    // refresh functions
    refreshFinancialSummary,
    refreshFinancialSummaryRange,
  };
};

export default useReports;
