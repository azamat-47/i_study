import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';
import { data } from 'react-router';
import dayjs from 'dayjs';

// API funksiyalari

// Get all courses by branch
const getCoursesByBranch = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/courses?branchId=${branchId}`);
  return response.data;
};

// Get course by ID
const getCourseById = async ({ queryKey }) => {
  const [, courseId] = queryKey;
  const response = await API.get(`/courses/${courseId}`);
  return response.data;
};

// Create Course
const createCourse = async (payload) => {
  if (!payload.name || !payload.price || !payload.branchId || !payload.durationMonths || !payload.description) {
    throw new Error("Kurs nomi, narxi va filiali majburiy.");
  }
  
  const response = await API.post('/courses', payload);
  return response.data;
};

// Update Course
const updateCourse = async ({ id, payload }) => {
  if (!payload.name || !payload.price || !payload.branchId) {
    throw new Error("Kurs nomi, narxi va filiali majburiy.");
  }
  const response = await API.put(`/courses/${id}`, payload);
  return response.data;
};

// Delete Course
const deleteCourse = async (id) => {
  const response = await API.delete(`/courses/${id}`);
  return response.data;
};

// Search Courses
const searchCourses = async ({ queryKey }) => {
  const [, { branchId, name }] = queryKey;
  const response = await API.get(`/courses/search?branchId=${branchId}&name=${name}`);
  return response.data;
};

// Get all groups by branch
const getGroupsByBranch = async ({ queryKey }) => {
  const [, branchId] = queryKey;
  const response = await API.get(`/groups?branchId=${branchId}`);
  return response.data;
};

// Get group by ID
const getGroupById = async ({ queryKey }) => {
  const [, groupId, year, month] = queryKey; // year va month ni queryKey dan olamiz
  // API chaqiruvida year va month parametrlarni qo'shamiz
  const response = await API.get(`/groups/${groupId}?year=${year || ''}&month=${month || ''}`);
  return response.data;
};

// Get groups by course ID
const getGroupsByCourse = async ({ queryKey }) => {
  const [, courseId, year, month] = queryKey;
  const response = await API.get(`/groups/by-course?courseId=${courseId}&year=${year || ''}&month=${month || ''}`);
  return response.data;
};

// Create Group
const createGroup = async (payload) => {
  if (!payload.name || !payload.courseId || !payload.teacherId || !payload.branchId || !payload.startTime || !payload.endTime) {
    throw new Error("Guruh nomi, kurs, o'qituvchi, filial, boshlanish va tugash vaqti majburiy.");
  }

  const body = {
    ...payload,
    studentIds: payload.studentIds || [],
    daysOfWeek: payload.daysOfWeek || []
  };

  const response = await API.post('/groups', body);
  return response.data;
};

// Update Group
const updateGroup = async ({ id, payload }) => {
  if (!payload.name || !payload.courseId || !payload.teacherId || !payload.branchId || !payload.startTime || !payload.endTime) {
    throw new Error("Guruh nomi, kurs, o'qituvchi, filial, boshlanish va tugash vaqti majburiy.");
  }

  const body = {
    ...payload,
    studentIds: payload.studentIds || [],
    daysOfWeek: payload.daysOfWeek || []
  };

  const response = await API.put(`/groups/${id}`, body);
  return response.data;
};

// Delete Group
const deleteGroup = async (id) => {
  const response = await API.delete(`/groups/${id}`);
  return response.data;
};

// Get Unpaid Students by Group
const getUnpaidStudentsByGroup = async ({ queryKey }) => {
  const [, groupId, year, month] = queryKey;
  const response = await API.get(`/groups/${groupId}/unpaid-students${year ? `?year=${year}` : ''}${month ? `&month=${month}` : ''}`);
  return response.data;
};


const postStudentForGroup = async ({ groupId, studentId }) => {
  const response = await API.post(`/groups/${groupId}/students/${studentId}`);
  return response.data;
}

const deleteStudentFromGroup = async ({ groupId, studentId }) => {
  const response = await API.delete(`/groups/${groupId}/students/${studentId}`);
  return response.data;
}



// useGroups hook - Birlashtirilgan
export const useCourse = (branchId, selectedMonthRaw) => {
  const queryClient = useQueryClient();
  const selectedMonth = dayjs(selectedMonthRaw);

  // Get all courses for a branch
  const coursesQuery = useQuery({
    queryKey: ['courses', branchId],
    queryFn: getCoursesByBranch,
    enabled: !!branchId,
  });

  // Get a single course by ID
  const courseByIdQuery = (courseId) => useQuery({
    queryKey: ['course', courseId],
    queryFn: getCourseById,
    enabled: !!courseId,
  });

  // Create Course
  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onMutate: () => {
      toast.loading("Kurs qo'shilmoqda...", { id: "createCourse" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', branchId] });
      toast.success("Kurs muvaffaqiyatli qo'shildi!", { id: "createCourse" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Kurs qo'shishda xatolik yuz berdi.", { id: "createCourse" });
    }
  });

  // Update Course
  const updateCourseMutation = useMutation({
    mutationFn: updateCourse,
    onMutate: () => {
      toast.loading("Kurs yangilanmoqda...", { id: "updateCourse" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses', branchId] });
      queryClient.invalidateQueries({ queryKey: ['course', data.id] });
      toast.success("Kurs muvaffaqiyatli yangilandi!", { id: "updateCourse" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Kursni yangilashda xatolik yuz berdi.", { id: "updateCourse" });
    }
  });

  // Delete Course
  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onMutate: () => {
      toast.loading("Kurs o'chirilmoqda...", { id: "deleteCourse" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', branchId] });
      toast.success("Kurs muvaffaqiyatli o'chirildi!", { id: "deleteCourse" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Kursni o'chirishda xatolik yuz berdi.", { id: "deleteCourse" });
    }
  });

  // Search Courses
  const searchCoursesQuery = (name) => useQuery({
    queryKey: ['courses-search', { branchId, name }],
    queryFn: searchCourses,
    enabled: !!branchId,
  });

  // Get all groups for a branch
  const groupsQuery = useQuery({
    queryKey: ['groups', branchId],
    queryFn: getGroupsByBranch,
    enabled: !!branchId,
  });

  // Get a single group by ID
  const groupByIdQuery = (groupId, year, month) => useQuery({ // year va month parametrlarni qabul qiladi
    queryKey: ['group', groupId, year, month], // queryKey ga year va month ni qo'shamiz
    queryFn: getGroupById,
    enabled: !!groupId,
  });



  // Get groups by course ID
  const groupsByCourseQuery = (courseId) => useQuery({ 
    queryKey: ['groups-by-course', courseId ],
    queryFn: getGroupsByCourse,
    enabled: !!courseId,
  });

  // Create Group
  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onMutate: () => {
      toast.loading("Guruh qo'shilmoqda...", { id: "createGroup" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['groups', branchId] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      // CourseById ni ham refetch qilish
      if (data.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['groups-by-course', data.courseId, selectedMonth.year(), selectedMonth.month() + 1],
        });
        queryClient.invalidateQueries({ queryKey: ['course', data.courseId] });
      }
      toast.success("Guruh muvaffaqiyatli qo'shildi!", { id: "createGroup" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Guruh qo'shishda xatolik yuz berdi.", { id: "createGroup" });
    }
  });

  // Update Group
  const updateGroupMutation = useMutation({
    mutationFn: updateGroup,
    onMutate: () => {
      toast.loading("Guruh yangilanmoqda...", { id: "updateGroup" });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['groups', branchId] });
      queryClient.invalidateQueries({ queryKey: ['group', data.id] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      // CourseById ni ham refetch qilish
      if (data.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['groups-by-course', data.courseId, selectedMonth.year(), selectedMonth.month() + 1],
        });
        queryClient.invalidateQueries({ queryKey: ['course', data.courseId] });
      }
      toast.success("Guruh muvaffaqiyatli yangilandi!", { id: "updateGroup" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Guruhni yangilashda xatolik yuz berdi.", { id: "updateGroup" });
    }
  });

  // Delete Group
  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onMutate: () => {
      toast.loading("Guruh o'chirilmoqda...", { id: "deleteGroup" });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups', branchId] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['groups-by-course', variables.courseId],
          exact: false,
        });
        queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      }
      toast.success("Guruh muvaffaqiyatli o'chirildi!", { id: "deleteGroup" });
    },
  
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Guruhni o'chirishda xatolik yuz berdi.", { id: "deleteGroup" });
    }
  });

  // useCourse.js ichida

// Studentni guruhga qo'shish
const postStudentForGroup = async ({ groupId, studentId }) => {
  const response = await API.post(`/groups/${groupId}/students/${studentId}`);
  return response.data;
};

// Studentni guruhdan o'chirish
const deleteStudentFromGroup = async ({ groupId, studentId }) => {
  const response = await API.delete(`/groups/${groupId}/students/${studentId}`);
  return response.data;
};


  // Studentni guruhga qo'shish
  const addStudentToGroupMutation = useMutation({
    mutationFn: postStudentForGroup,
    onMutate: () => {
      toast.loading("Talaba guruhga qo'shilmoqda...", { id: "addStudentToGroup" });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups', branchId] });
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      if (data.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', data.courseId] });
        queryClient.invalidateQueries({
          queryKey: ['groups-by-course', data.courseId, selectedMonth.year(), selectedMonth.month() + 1],
        });
      }
      toast.success("Talaba guruhga muvaffaqiyatli qo'shildi!", { id: "addStudentToGroup" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Talabani guruhga qo'shishda xatolik yuz berdi.", { id: "addStudentToGroup" });
    }
  });

  // Studentni guruhdan o'chirish
  const removeStudentFromGroupMutation = useMutation({
    mutationFn: deleteStudentFromGroup,
    onMutate: () => {
      toast.loading("Talaba guruhdan o'chirilmoqda...", { id: "removeStudentFromGroup" });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups', branchId] });
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['students', branchId] });
      if (data?.courseId) {
        queryClient.invalidateQueries({ queryKey: ['course', data.courseId] });
        queryClient.invalidateQueries({
          queryKey: ['groups-by-course', data.courseId, selectedMonth.year(), selectedMonth.month() + 1],
        });
      }
      toast.success("Talaba guruhdan muvaffaqiyatli o'chirildi!", { id: "removeStudentFromGroup" });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Talabani guruhdan o'chirishda xatolik yuz berdi.", { id: "removeStudentFromGroup" });
    }
  });


  // Get Unpaid Students by Group
  const unpaidStudentsByGroupQuery = (groupId, year, month) => useQuery({
    queryKey: ['unpaid-students-by-group', groupId, year, month],
    queryFn: getUnpaidStudentsByGroup,
    enabled: !!groupId,
  });

  return {
    // Course methods
    coursesQuery,
    courseByIdQuery,
    createCourseMutation,
    updateCourseMutation,
    deleteCourseMutation,
    searchCoursesQuery,
    // Group methods
    groupsQuery,
    groupByIdQuery,
    groupsByCourseQuery,
    createGroupMutation,
    updateGroupMutation,
    deleteGroupMutation,
    // Student-Group methods
    addStudentToGroupMutation,
    removeStudentFromGroupMutation,
    unpaidStudentsByGroupQuery,
  };
};