import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api"
import toast from "react-hot-toast";


const Add_Teacher = async( {username, password, name, email, phone, salary} ) => {
    if (!username || !password || !name || !email || !phone || !salary) {
        throw new Error("Maydonlarni to'ldirish talab qilinadi!");
    }
    const response = await API.post("/admin/teachers", {username, password, name, email, phone, salary})
    console.log(response);
    
    return response.data;

}

const Fetch_Teachers = async () => {
    const response = await API.get("/teachers")
    console.log(response);
    
    return response.data;
}

const Delete_Teacher = async (id) => {
    if (!id) throw new Error("Id talab Qilinadida!")
    const response = API.delete(`/api/admin/teachers/${id}`)
    return response.data
}

const useTeacher = () => {
    // queryClient ni chaqirib olish bu ruyxatlarni yangilash uchun kerak
    const queryClient = useQueryClient();

    const addTeacherMutation = useMutation({
        mutationFn: Add_Teacher,
        onSuccess: (data) => {
            toast.success("Ustoz muvaffaqiyatli qo'shildi!");
            // Teacherlar ro'yxatini yangilash
            queryClient.invalidateQueries({ queryKey: ["teachers"] });           
            
        },
        onError: (error) => {
            toast.error(error.message || "Xatolik yuz berdi!");
        }
    })

    const getTeachers = useQuery({
        queryKey: ["teachers"],
        queryFn: Fetch_Teachers
    })

    const deleteTeacherMutation = useMutation({
        mutationFn: Delete_Teacher,
        onSuccess: () => {
            toast.success("Teacher muvaffaqiyatli o'chirildi!");
            queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
        onError: (error) => {
            toast.error(error.message || "Xatolik yuz berdi!");
        }
    });

    return {addTeacherMutation, deleteTeacherMutation, getTeachers};
}

export default useTeacher