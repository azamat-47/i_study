import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api";
import toast from "react-hot-toast";


const getStudents = async () => {
    const response = await API.get("/students");
    return response.data;
}

const getStudentById = async (id) => {
    if (!id) throw new Error("Id talab qilinadi!");
    const response = await API.get(`/students/${id}`);
    return response.data;
}

const postStudent = async (payload) => {
    if (!payload.name || !payload.phone || !payload.email || !payload.phone || !payload.enrollmentDate|| payload.courseIds.length===0 ) {
        throw new Error("Maydonlarni to'ldirish talab qilinadi!");
    }
    const response = await API.post("/students", payload);
    return response.data;
}

const putStudent = async (payload) => {
    if (!payload.id || !payload.name || !payload.phone || !payload.email || !payload.phone || !payload.enrollmentDate || payload.courseIds.length===0 ) {
        throw new Error("Maydonlarni to'ldirish talab qilinadi!");
    }
    const response = await API.put(`/students/${payload.id}`, payload);
    return response.data;
}

const deleteStudent = async (id) => {
    if (!id) throw new Error("Id talab qilinadi!");
    const response = await API.delete(`/students/${id}`);
    return response.data;
}

const useStudents = () => {
    const queryClient = useQueryClient();

    const GetStudents = useQuery({
        queryKey: ["students"],
        queryFn: getStudents
    });

    const GetStudentById = useQuery({
        queryKey: ["students", "studentById"],
        queryFn: getStudentById,
        onError: (err) => {
        console.error("GetStudentById error:", err);
        },
    });

    const PostStudent = useMutation({   
        mutationFn: postStudent,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["students"] });
          toast.success("Student qo'shildi!");
        },
        onError: (err) => {
          console.error("PostStudent error:", err);
          toast.error(err.message || "Student qo'shishda xatolik!");
        },
      });
      

    const PutStudent = useMutation({
        mutationFn: putStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
            toast.success("Student o'zgartirildi!");
        },
        onError: (err) => {
            console.error("PutStudent error:", err);
            toast.error(err.message || "Student o'zgartirishda xatolik!");
        },
    });

    const DeleteStudent = useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["students"] });
            toast.success("Student o'chirildi!");
        },
        onError: (err) => {
            console.error("DeleteStudent error:", err);
            toast.error(err.message || "Student o'chirishda xatolik!");
        },
    });

    return { GetStudents, GetStudentById, PostStudent, PutStudent, DeleteStudent };
    
}

export default useStudents;