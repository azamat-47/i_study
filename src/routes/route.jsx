import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../pages/auth/AuthLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import Main from "../pages/main/Main";
import Payment from "../pages/main/Payment";
import Students from "../pages/main/Students";
import App from "../App";
import Settings from "../pages/main/Settings";

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
                    { path: "/payment", element: <Payment /> },
                    { path: "/students", element: <Students /> },
                    { path: "/settings", element: <Settings /> }
                ]
            }
        ]
    }
]);

export default router;
