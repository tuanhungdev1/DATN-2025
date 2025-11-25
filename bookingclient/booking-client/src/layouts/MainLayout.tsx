import { MainFooter } from "@/components/footer";
import { MainHeader } from "@/components/header";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <Box
        sx={{
          bgcolor: "primary.main",
        }}
      >
        <MainHeader />
      </Box>

      {children || <Outlet />}

      <Box
        sx={{
          bgcolor: "primary.main",
        }}
      >
        <MainFooter />
      </Box>
    </>
  );
};

export default MainLayout;
