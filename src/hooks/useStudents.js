import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

// API funksiyalari

// Get all students by branch
const getStudentsByBranch = async ({ queryKey }) => {
  const [, branchId, year, month] = queryKey;
  const response = await API.get(`/students?branchId=${branchId}${year ? `&year=${year}` : ''}${month ? `&month=${month}` : ''}`);
  return response.data;
};

// Get student by ID
const getStudentById = async ({ queryKey }) => {
  const [, studentId, year, month] = queryKey;
  const response = await API.get(`/students/${studentId}${year ? `?year=${year}` : ''}${month ? `&month=${month}` : ''}`);
  return response.data;
};

// Create Student
const createStudent = async (payload) => {
  if (!payload.firstName || !payload.lastName || !payload.branchId || !payload.phoneNumber || payload.groupIds.length === 0) {
    throw new Error("Ism, familiya va filial majburiy.");
  }
  const response = await API.post('/students', payload);
  return response.data;
};

// Update Student
const updateStudent = async ({ id, payload }) => {
  if (!payload.firstName || !payload.lastName || !payload.branchId || !payload.phoneNumber || payload.groupIds.length === 0) {
    throw new Error("Ism, familiya va filial majburiy.");
  }
  const response = await API.put(`/students/${id}`, payload);
  return response.data;
};

// Delete Student
const deleteStudent = async (id) => {
  const response = await API.delete(`/students/${id}`);
  return response.data;
};

// Get Student Payment History
const getStudentPaymentHistory = async ({ queryKey }) => {
  const [, studentId] = queryKey;
  const response = await API.get(`/students/${studentId}/payment-history`);
  return response.data;
};

// Get Student Groups
const getStudentGroups = async ({ queryKey }) => {
  const [, studentId] = queryKey;
  const response = await API.get(`/students/${studentId}/groups`);
  return response.data;
};


// Get Student Statistics
const getStudentStatistics = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/students/statistics?branchId=${branchId}`);
  return response.data;
};

// Search Students
const searchStudents = async ({ queryKey }) => {
  const [, { branchId, name, year, month }] = queryKey;
  const response = await API.get(`/students/search?branchId=${branchId}${name ? `&name=${name}` : ''}${year ? `&year=${year}` : ''}${month ? `&month=${month}` : ''}`);
  return response.data;
};

// Get Recent Students
const getRecentStudents = async ({ queryKey }) => {
  const [, branchId, limit] = queryKey;
  const response = await API.get(`/students/recent?branchId=${branchId}${limit ? `&limit=${limit}` : ''}`);
  return response.data;
};

// Get Students by Payment Status
const getStudentsByPaymentStatus = async ({ queryKey }) => {
  const [, { branchId, paymentStatus, year, month }] = queryKey;
  const response = await API.get(`/students/by-payment-status?branchId=${branchId}&paymentStatus=${paymentStatus}${year ? `&year=${year}` : ''}${month ? `&month=${month}` : ''}`);
  return response.data;
};



// useStudents hook
const useStudents = (branchId) => {
  const queryClient = useQueryClient();

  // Get all students for a branch
  const studentsQuery = (year, month) => useQuery({
    queryKey: ['students', branchId, year, month],
    queryFn: getStudentsByBranch,
    enabled: !!branchId,
  });

  // Get a single student by ID
  const studentByIdQuery = (studentId, year, month) => useQuery({
    queryKey: ['student', studentId, year, month],
    queryFn: getStudentById,
    enabled: !!studentId,
  });

  // Create Student
  const createStudentMutation = useMutation({
    mutationFn: createStudent,
    onMutate: () => {
      toast.loading("Talaba qo'shilmoqda...", { id: "createStudent" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      queryClient.invalidateQueries({ queryKey: ['students-statistics', branchId] }); // Statistikalarni yangilash
      queryClient.invalidateQueries({ queryKey: ['recent-students', branchId] }); // Yaqinda qo'shilganlarni yangilash
      toast.success("Talaba muvaffaqiyatli qo'shildi!", { id: "createStudent" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Talaba qo'shishda xatolik yuz berdi.", { id: "createStudent" });
    }
  });

  // Update Student
  const updateStudentMutation = useMutation({
    mutationFn: updateStudent,
    onMutate: () => {
      toast.loading("Talaba yangilanmoqda...", { id: "updateStudent" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      queryClient.invalidateQueries({ queryKey: ['student', data.id] });
      queryClient.invalidateQueries({ queryKey: ['students-statistics', branchId] });
      queryClient.invalidateQueries({ queryKey: ['recent-students', branchId] });
      toast.success("Talaba muvaffaqiyatli yangilandi!", { id: "updateStudent" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Talabani yangilashda xatolik yuz berdi.", { id: "updateStudent" });
    }
  });

  // Delete Student
  const deleteStudentMutation = useMutation({
    mutationFn: deleteStudent,
    onMutate: () => {
      toast.loading("Talaba o'chirilmoqda...", { id: "deleteStudent" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      queryClient.invalidateQueries({ queryKey: ['unpaid-students', branchId] });
      queryClient.invalidateQueries({ queryKey: ['students-statistics', branchId] });
      queryClient.invalidateQueries({ queryKey: ['recent-students', branchId] });
      toast.success("Talaba muvaffaqiyatli o'chirildi!", { id: "deleteStudent" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Talabani o'chirishda xatolik yuz berdi.", { id: "deleteStudent" });
    }
  });

  

  // Get Student Payment History
  const studentPaymentHistoryQuery = (studentId) => useQuery({
    queryKey: ['student-payment-history', studentId],
    queryFn: getStudentPaymentHistory,
    enabled: !!studentId,
  });

  // Get Student Groups
  const studentGroupsQuery = (studentId) => useQuery({
    queryKey: ['student-groups', studentId],
    queryFn: getStudentGroups,
    enabled: !!studentId,
  });


  // Get Student Statistics
  const studentStatisticsQuery = useQuery({
    queryKey: ['students-statistics', branchId],
    queryFn: getStudentStatistics,
    enabled: !!branchId,
  });

  // Search Students
  const searchStudentsQuery = (name, year, month) => useQuery({
    queryKey: ['students-search', { branchId, name, year, month }],
    queryFn: searchStudents,
    enabled: !!branchId,
  });

  // Get Recent Students
  const recentStudentsQuery = (limit = 10) => useQuery({
    queryKey: ['recent-students', branchId, limit],
    queryFn: getRecentStudents,
    enabled: !!branchId,
  });

  // Get Students by Payment Status
  const studentsByPaymentStatusQuery = (paymentStatus, year, month) => useQuery({
    queryKey: ['students-by-payment-status', { branchId, paymentStatus, year, month }],
    queryFn: getStudentsByPaymentStatus,
    enabled: !!branchId && !!paymentStatus,
  });

  return {
    studentsQuery,
    studentByIdQuery,
    createStudentMutation,
    updateStudentMutation,
    deleteStudentMutation,
    studentPaymentHistoryQuery,
    studentGroupsQuery,
    studentStatisticsQuery,
    searchStudentsQuery,
    recentStudentsQuery,
    studentsByPaymentStatusQuery,
  };
};

export default useStudents;