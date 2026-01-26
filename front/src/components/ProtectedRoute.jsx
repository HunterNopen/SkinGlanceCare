import { Navigate, Outlet } from "react-router-dom";

import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    toast.info("Please log in to view this page", {
      toastId: "login-required",
    });
    return <Navigate to="/auth?mode=login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
