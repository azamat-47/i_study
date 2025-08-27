import { customAlphabet } from "nanoid";
import API from "../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { use } from "react";


// Create
const Add_Course = async (payload) => {
  if (!payload.name || !payload.description || payload.fee === undefined || !payload.teachers) {
    throw new Error("Maydonlarni to'ldirish talab qilinadi!");
  }
//   const numericId = customAlphabet("0123456789", 10); // uzunligi 10 ta raqam
//   // id agar backendda avtomatik berilmasa
//   if (!payload.id) {
//     payload.id = numericId();
//   }
  console.log("Add_Course payload:", payload);
  
  const response = await API.post("/courses", payload);
  return response.data;
};

// Read (all)
const Fetch_Courses = async () => {
  const response = await API.get("/courses");
  return response.data;
};

// Read (by id)
const Fetch_Course_By_Id = async (id) => {
  if (!id) throw new Error("Id talab qilinadi!");
  const response = await API.get(`/courses/${id}`);
  return response.data;
};

// read students
const Fetch_Students_By_Course_Id = async (id) => {
  if (!id) throw new Error("Id talab qilinadi!");
  const response = await API.get(`/courses/${id}/students`);
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

  const addCourseMutation = useMutation({
    mutationFn: Add_Course,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Kurs qo'shildi!");
    },
    onError: (error) => {
      toast.error(error.message || "Kurs qo'shishda xatolik!");
    }
  });

  const getCourses = useQuery({
    queryKey: ["courses"],
    queryFn: Fetch_Courses
  });

  const getStudentsByCourseId = (id) => useQuery({
    queryKey: ["courses", id, "students"],
    queryFn: () => Fetch_Students_By_Course_Id(id),
    enabled: !!id
  });

  const getCourseById = (id) =>
    useQuery({
      queryKey: ["course", id],
      queryFn: () => Fetch_Course_By_Id(id),
      enabled: !!id
    });

  const putCourseMutation = useMutation({
    mutationFn: Put_Course,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Kurs yangilandi!");
    },
    onError: (error) => {
      toast.error(error.message || "Kursni yangilashda xatolik!");
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: Delete_Course,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Kurs o'chirildi!");
    },
    onError: (error) => {
      toast.error(error.message || "Kursni o'chirishda xatolik!");
    }
  });

  return {
    addCourseMutation,
    getCourses,
    putCourseMutation,
    deleteCourseMutation,
    getCourseById,
    getStudentsByCourseId
  };
};

export default useCourse;
