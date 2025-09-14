// hooks/useTeachers.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

// API funksiyalari

// Get all teachers by branch
const getTeachersByBranch = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/teachers?branchId=${branchId}`);
  return response.data;
};

// Get teacher by ID
const getTeacherById = async ({ queryKey }) => {
  const [, teacherId] = queryKey;
  const response = await API.get(`/teachers/${teacherId}`);
  return response.data;
};

// Create Teacher
const createTeacher = async (payload) => {
  if (!payload.firstName || !payload.lastName || !payload.salaryType || !payload.branchId) {
    throw new Error("Ism, familiya, ish haqi turi va filial majburiy.");
  }
  const response = await API.post('/teachers', payload);
  return response.data;
};

// Update Teacher
const updateTeacher = async ({ id, payload }) => {
  if (!payload.firstName || !payload.lastName || !payload.salaryType || !payload.branchId) {
    throw new Error("Ism, familiya, ish haqi turi va filial majburiy.");
  }
  const response = await API.put(`/teachers/${id}`, payload);
  return response.data;
};

// Delete Teacher
const deleteTeacher = async (id) => {
  const response = await API.delete(`/teachers/${id}`);
  return response.data;
};

// Search Teachers
const searchTeachers = async ({ queryKey }) => {
  const [, { branchId, name }] = queryKey;
  const response = await API.get(`/teachers/search?branchId=${branchId}${name ? `&name=${name}` : ''}`);
  return response.data;
};

// Get Teachers by Salary Type
const getTeachersBySalaryType = async ({ queryKey }) => {
  const [, { branchId, salaryType }] = queryKey;
  const response = await API.get(`/teachers/by-salary-type?branchId=${branchId}&salaryType=${salaryType}`);
  return response.data;
};


// useTeachers hook
const useTeacher = (branchId) => {
  const queryClient = useQueryClient();

  // Get all teachers for a branch
  const teachersQuery = useQuery({
    queryKey: ['teachers', branchId],
    queryFn: getTeachersByBranch,
    enabled: !!branchId,
  });

  // Get a single teacher by ID
  const teacherByIdQuery = (teacherId) => useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: getTeacherById,
    enabled: !!teacherId,
  });

  // Create Teacher
  const createTeacherMutation = useMutation({
    mutationFn: createTeacher,
    onMutate: () => {
      toast.loading("O'qituvchi qo'shilmoqda...", { id: "createTeacher" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers', branchId] });
      toast.success("O'qituvchi muvaffaqiyatli qo'shildi!", { id: "createTeacher" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "O'qituvchi qo'shishda xatolik yuz berdi.", { id: "createTeacher" });
    }
  });

  // Update Teacher
  const updateTeacherMutation = useMutation({
    mutationFn: updateTeacher,
    onMutate: () => {
      toast.loading("O'qituvchi yangilanmoqda...", { id: "updateTeacher" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teachers', branchId] });
      queryClient.invalidateQueries({ queryKey: ['teacher', data.id] });
      toast.success("O'qituvchi muvaffaqiyatli yangilandi!", { id: "updateTeacher" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "O'qituvchini yangilashda xatolik yuz berdi.", { id: "updateTeacher" });
    }
  });

  // Delete Teacher
  const deleteTeacherMutation = useMutation({
    mutationFn: deleteTeacher,
    onMutate: () => {
      toast.loading("O'qituvchi o'chirilmoqda...", { id: "deleteTeacher" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers', branchId] });
      toast.success("O'qituvchi muvaffaqiyatli o'chirildi!", { id: "deleteTeacher" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "O'qituvchini o'chirishda xatolik yuz berdi.", { id: "deleteTeacher" });
    }
  });

  // Search Teachers
  const searchTeachersQuery = (name) => useQuery({
    queryKey: ['teachers-search', { branchId, name }],
    queryFn: searchTeachers,
    enabled: !!branchId,
  });

  // Get Teachers by Salary Type
  const teachersBySalaryTypeQuery = (salaryType) => useQuery({
    queryKey: ['teachers-by-salary-type', { branchId, salaryType }],
    queryFn: getTeachersBySalaryType,
    enabled: !!branchId && !!salaryType,
  });

  return {
    teachersQuery,
    teacherByIdQuery,
    createTeacherMutation,
    updateTeacherMutation,
    deleteTeacherMutation,
    searchTeachersQuery,
    teachersBySalaryTypeQuery,
  };
};

export default useTeacher;