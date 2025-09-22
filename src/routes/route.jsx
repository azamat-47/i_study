import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../pages/auth/AuthLayout";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Payment from "../pages/main/Payment";
import Students from "../pages/main/Students";
import App from "../App";
import Teachers from "../pages/main/Teachers";
import Sayt_Haqida from "../pages/main/Sayt_Haqida";
import GroupDetail from "../components/details/group/GroupDetail.jsx";
import Groups from "../pages/main/Groups.jsx";
import Courses from "../pages/main/Courses.jsx";
import CoursesDetail from "../components/details/course/CoursesDetail.jsx";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <AuthLayout />,
        children: [
            { index: true, element: <Login /> },
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
                    { index: true, element: < Courses /> },
                    { path: "/guruhlar", element: < Groups/> },
                    { path: "/tolovlar", element: <Payment /> },
                    { path: "/uquvchilar", element: <Students /> },
                    { path: "/uqituvchilar", element: <Teachers /> },
                    { path: "/sayt_haqida", element: <Sayt_Haqida /> },
                    { path: "/groups/:id", element: <GroupDetail />},
                    { path: "/kurslar/:id", element: <CoursesDetail />},
                ]
            }
        ]
    }
]);

export default router;
