import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // const token = localStorage.getItem('token');
  const token  = true

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
