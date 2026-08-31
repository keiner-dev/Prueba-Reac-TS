import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import type { Role } from "@/types/user";

interface ProtectedRouteProps {
  requireAuth?: boolean;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ requireAuth = false, allowedRoles }: ProtectedRouteProps) {
  const { user, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="p-8 text-center text-[#536a2d]">Cargando…</div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
