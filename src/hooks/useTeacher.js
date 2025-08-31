import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../services/api"
import toast from "react-hot-toast";


const Add_Teacher = async( {username, password, name, email, phone, salary} ) => {
    if (!username || !password || !name || !email || !phone || salary === undefined || salary === null) {
        throw new Error("Maydonlarni to'ldirish talab qilinadi!");
      }
    console.log("Add_Teacher", {username, password, name, email, phone, salary});
    
    const response = await API.post("/api/admin/teachers", {username, password, name, email, phone, salary})
    console.log("response {post}", response);
    
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
        id: userId,        // teacher.user.id ni yuboramiz
        username: username // username ni yangilash mumkin
      }
    });
  
    return response.data;
  };
  
  

const Delete_Teacher = async (id) => {
    if (!id) throw new Error("Id talab Qilinadida!");

    console.log("Delete_Teacher id:", id);
    
    
    const response = await API.delete(`/api/admin/teachers/${id}`);
    

    return response.data;
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
            console.log("Delete_Teacher error:", error);            
            toast.error(error.message || "Xatolik yuz berdi!");
        }
    });

    const updateTeacherMutation = useMutation({
        mutationFn: Put_Teacher,
        onSuccess: () => {
          toast.success("Teacher muvaffaqiyatli yangilandi!");
          queryClient.invalidateQueries({ queryKey: ["teachers"] });
        },
        onError: (error) => {
          toast.error(error.message || "Xatolik yuz berdi!");
        },
      });
    

    return {addTeacherMutation, deleteTeacherMutation, getTeachers, updateTeacherMutation};
}

export default useTeacher