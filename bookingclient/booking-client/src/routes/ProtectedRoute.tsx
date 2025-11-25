import { PageLoading } from "@/components/loading";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAuthenticated === undefined) {
    return <PageLoading />;
  }
  if (!isAuthenticated || !user) {
    const loginRoute = isAdminRoute ? ROUTES.ADMIN_LOGIN : ROUTES.AUTH_LOGIN;

    return <Navigate to={loginRoute} state={{ from: location }} replace />;
  }
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = user.roles.some((role) =>
      allowedRoles.includes(role)
    );
    if (!hasRequiredRole) {
      return <Navigate to={ROUTES.AUTH_LOGIN} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
