import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api"
import toast from "react-hot-toast";

const Add_Teacher = async({username, password, name, email, phone, salary}) => {
    if (!username || !password || !name || !email || !phone || salary === undefined || salary === null) {
        throw new Error("Maydonlarni to'ldirish talab qilinadi!");
    }
    const response = await API.post("/api/admin/teachers", {username, password, name, email, phone, salary})
    return response.data;
}

const Fetch_Teachers = async () => {
    const response = await API.get("/api/teachers")
    return response.data;
}

const Put_Teacher = async ({ id, username, name, email, phone, salary, userId }) => {
    if (!id || !userId || !username || !name || !email || !phone || salary === undefined || salary === null) {
      throw new Error("Maydonlarni to'ldirish talab qilinadi!");
    }
  
    const response = await API.put(`/api/admin/teachers/${id}`, {
      id,
      name,
      email,
      phone,
      salary,
      user: {
        id: userId,
        username: username
      }
    });
    return response.data;
};
  
const Delete_Teacher = async (id) => {
    if (!id) throw new Error("Id talab qilinadi!");
    const response = await API.delete(`/api/admin/teachers/${id}`);
    return response.data;
}


const useTeacher = () => {
    const queryClient = useQueryClient();

    const addTeacherMutation = useMutation({
        mutationFn: Add_Teacher,
        onMutate: () => {
            toast.loading("Ustoz qo'shilmoqda...", { id: "addTeacher" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            toast.success("Ustoz muvaffaqiyatli qo'shildi!", { id: "addTeacher" });
        },
        onError: (err) => {
            toast.error(err.message || "Ustoz qo'shishda xatolik yuz berdi.", { id: "addTeacher" });
        }
    });

    const getTeachers = useQuery({
        queryKey: ["teachers"],
        queryFn: Fetch_Teachers
    });

    const deleteTeacherMutation = useMutation({
        mutationFn: Delete_Teacher,
        onMutate: () => {
            toast.loading("Teacher o'chirilmoqda...", { id: "deleteTeacher" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            toast.success("Teacher muvaffaqiyatli o'chirildi!", { id: "deleteTeacher" });
        },
        onError: (err) => {
            toast.error(err.message || "O'chirishda xatolik yuz berdi.", { id: "deleteTeacher" });
        }
    });

    const updateTeacherMutation = useMutation({
        mutationFn: Put_Teacher,
        onMutate: () => {
            toast.loading("Teacher yangilanmoqda...", { id: "updateTeacher" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
            toast.success("Teacher muvaffaqiyatli yangilandi!", { id: "updateTeacher" });
        },
        onError: (err) => {
            toast.error(err.message || "Yangilashda xatolik yuz berdi.", { id: "updateTeacher" });
        }
    });

    return { addTeacherMutation, deleteTeacherMutation, getTeachers, updateTeacherMutation };
}

export default useTeacher;