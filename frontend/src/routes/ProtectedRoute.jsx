import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/user/UserContext";
export function ProtectedRoute() {
  const { loggedInUser } = useAuth();
  if (!loggedInUser) return <Navigate to="/login" replace />;
  if (loggedInUser.role === "hotel_manager")
    return <Navigate to="/manager/dashboard" replace />;
  if (loggedInUser.role === "admin")
    return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
}

export function AdminRoute() {
  const { loggedInUser } = useAuth();
  if (!loggedInUser) return <Navigate to="/login" replace />;
  if (loggedInUser.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}

export function ManagerRoute() {
  const { loggedInUser } = useAuth();
  if (!loggedInUser) return <Navigate to="/login" replace />;
  if (loggedInUser.role !== "hotel_manager") return <Navigate to="/" replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const { loggedInUser } = useAuth();
  if (loggedInUser?.role === "admin")
    return <Navigate to="/admin/dashboard" replace />;
  if (loggedInUser?.role === "hotel_manager")
    return <Navigate to="/manager/dashboard" replace />;
  if (loggedInUser) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function PublicRoute() {
  const { loggedInUser } = useAuth();
  if (loggedInUser?.role === "admin")
    return <Navigate to="/admin/dashboard" replace />;
  if (loggedInUser?.role === "hotel_manager")
    return <Navigate to="/manager/dashboard" replace />;
  return <Outlet />;
}

export function NoManagerRoute() {
  const { loggedInUser } = useAuth();
  if (loggedInUser?.role === "hotel_manager")
    return <Navigate to="/manager/dashboard" replace />;
  return <Outlet />;
}
