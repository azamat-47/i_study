
import axios from "axios";
import { toast } from "react-hot-toast";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, 
});

// Request interceptor: har bir requestga token qo‘shish
API.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem("accessToken"); 
        if (token) {
            req.headers["Authorization"] = `Bearer ${token}`;
        }
        return req;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: 401 va 403 xatolarini boshqarish
API.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token expired yoki noto‘g‘ri
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            toast.error("Session expired. Keyinroq urinib kuring.");
            setTimeout(() => {
                window.location.replace("/login");
            }, 500);
        }

        if (status === 403) {
            toast.error("Sizda bu amalni bajarish huquqi yo'q!");
        }

        return Promise.reject(error);
    }
);

export default API;
