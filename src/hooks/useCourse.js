import API from "../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Create
const Add_Course = async (payload) => {
  if (!payload.name || !payload.description || payload.fee === undefined || !payload.teachers) {
    throw new Error("Maydonlarni to'ldirish talab qilinadi!");
  }
  const response = await API.post("/courses", payload);
  return response.data;
};

// Update
const Put_Course = async (payload) => {
  if (!payload.id || !payload.name || !payload.description || payload.fee === undefined || !payload.teachers) {
    throw new Error("Maydonlarni to'ldirish talab qilinadi!");
  }
  const response = await API.put(`/courses/${payload.id}`, payload);
  return response.data;
};

// Delete
const Delete_Course = async (id) => {
  if (!id) throw new Error("Id talab qilinadi!");
  const response = await API.delete(`/courses/${id}`);
  return response.data;
};

const useCourse = () => {
  const queryClient = useQueryClient();

  // Add Course
  const addCourseMutation = useMutation({
    mutationFn: Add_Course,
    onMutate: () => {
      toast.loading("Kurs qo'shilmoqda...", { id: "addCourse" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Kurs muvaffaqiyatli qo'shildi!", { id: "addCourse" });
    },
    onError: (err) => {
      toast.error(err.message || "Kurs qo'shishda xatolik yuz berdi.", { id: "addCourse" });
    }
  });

  // Update Course
  const putCourseMutation = useMutation({
    mutationFn: Put_Course,
    onMutate: () => {
      toast.loading("Kurs yangilanmoqda...", { id: "putCourse" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Kurs muvaffaqiyatli yangilandi!", { id: "putCourse" });
    },
    onError: (err) => {
      toast.error(err.message || "Kursni yangilashda xatolik yuz berdi.", { id: "putCourse" });
    }
  });

  // Delete Course
  const deleteCourseMutation = useMutation({
    mutationFn: Delete_Course,
    onMutate: () => {
      toast.loading("Kurs o'chirilmoqda...", { id: "deleteCourse" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Kurs muvaffaqiyatli o'chirildi!", { id: "deleteCourse" });
    },
    onError: (err) => {
      toast.error(err.message || "Kursni o'chirishda xatolik yuz berdi.", { id: "deleteCourse" });
    }
  });

  return {
    addCourseMutation,     // aynan shu nomda qaytyapti
    putCourseMutation,
    deleteCourseMutation,

    getCourses: useQuery({
      queryKey: ["courses"],
      queryFn: async () => (await API.get("/courses")).data
    }),

    getCourseById: (id) =>
      useQuery({
        queryKey: ["course", id],
        queryFn: async () => (await API.get(`/courses/${id}`)).data,
        enabled: !!id
      }),

    getStudentsByCourseId: (id) =>
      useQuery({
        queryKey: ["courses", id, "students"],
        queryFn: async () => (await API.get(`/courses/${id}/students`)).data,
        enabled: !!id
      })
  };
};

export default useCourse;
