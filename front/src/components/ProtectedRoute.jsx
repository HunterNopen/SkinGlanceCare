import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
