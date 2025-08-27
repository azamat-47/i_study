import { Toaster } from 'react-hot-toast';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // const token = localStorage.getItem('token');
  const token = localStorage.getItem("istudyAccessToken")

  return token ? <>
    <Toaster
      position="top-center"
      reverseOrder={false}
    />
    <Outlet />
  </> : <Navigate to="/login" />;
};

export default ProtectedRoute;
