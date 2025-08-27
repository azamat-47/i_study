import { useMutation } from "@tanstack/react-query"
import API from "../services/api"
import { useNavigate } from "react-router"
import toast from "react-hot-toast"

const Login = async ({username, password}) => {
    const response = await API.post("/api/auth/login", {username, password})
    
    if (response.status === 200) {
        return response.data
    }

    throw new Error("Kirishda xatolik mavjud!")
}


const useAuth = () => {
    const navigate = useNavigate()

    const loginMutation = useMutation({
        mutationFn: Login,
        onSuccess(data){
            const {accessToken, refreshToken} = data
            localStorage.setItem("istudyAccessToken", accessToken)
            toast.success("Tizimga kirildi!")
            navigate("/")
        },
        onError() {
            console.log("Errorrsss!");
            toast.error("Xatolik mavjud ")
        }
    })

    const logout = () => {
        localStorage.removeItem("istudyAccessToken");
        navigate("/login")
    }

    return {loginMutation, logout}
}

export default useAuth