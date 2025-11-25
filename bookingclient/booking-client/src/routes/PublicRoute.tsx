import PublicLayout from "@/layouts/PublicLayout";

interface PublicRouteProps {
  restricted?: boolean;
  children: React.ReactNode;
}

const PublicRoute = ({ restricted = false, children }: PublicRouteProps) => {
  //   const { isAuthenticated } = useAuth();

  // Nếu người dùng đã đăng nhập và route giới hạn (như login page)
  // thì chuyển hướng đến dashboard
  //   if (isAuthenticated && restricted) {
  //     return <Navigate to={ROUTES.DASHBOARD} replace />;
  //   }

  return <PublicLayout>{children}</PublicLayout>;
};

export default PublicRoute;
