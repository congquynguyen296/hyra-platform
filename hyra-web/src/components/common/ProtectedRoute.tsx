import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data } = useAuthStore();

  if (!data?.accessToken) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
