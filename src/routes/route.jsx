import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../pages/auth/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Main from "../pages/main/Main";
import Payment from "../pages/main/Payment";
import Students from "../pages/main/Students";
import App from "../App";
import Teachers from "../pages/main/Teachers";
import Sayt_Haqida from "../pages/main/Sayt_Haqida";
import CourseDetail from "../pages/main/CourseDetail";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <AuthLayout />,
        children: [
            { index: true, element: <Login /> },
            { path: "register", element: <Register /> }
        ]
    },
    {
        path: "/",
        element: <ProtectedRoute />,
        children: [
            {
                path: "/",
                element: <App />,
                children: [
                    { index: true, element: <Main /> },
                    { path: "/tolovlar", element: <Payment /> },
                    { path: "/uquvchilar", element: <Students /> },
                    { path: "/uqituvchilar", element: <Teachers /> },
                    { path: "/sayt_haqida", element: <Sayt_Haqida /> },
                    { path: "/kurs/:id", element: <CourseDetail /> },
                ]
            }
        ]
    }
]);

export default router;
