import { AuthFooter } from "@/components/footer";
import AuthHeader from "@/components/header/AuthHeader";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* Auth Header */}
      <AuthHeader />
      {children || <Outlet />}

      {/* Auth Footer */}

      <AuthFooter />
    </Box>
  );
};

export default AuthLayout;
