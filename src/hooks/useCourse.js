import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { toast } from 'react-hot-toast';

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

  console.log("useCourse p",payload)
  
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
  const response = await API.get(`/courses/search?branchId=${branchId}${name ? `&name=${name}` : ''}`);
  return response.data;
};

// useCourses hook
 const useCourse = (branchId) => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: ['courses', branchId] }); // Barcha kurslar keshini yangilash
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
      queryClient.invalidateQueries({ queryKey: ['course', data.id] }); // Aynan shu kurs keshini yangilash
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
    enabled: !!branchId, // Faqat branchId mavjud bo'lsa ishlatilsin
  });


  return {
    coursesQuery,
    courseByIdQuery,
    createCourseMutation,
    updateCourseMutation,
    deleteCourseMutation,
    searchCoursesQuery,
  };
};

export default useCourse;