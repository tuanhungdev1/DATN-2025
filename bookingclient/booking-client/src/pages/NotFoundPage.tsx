/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Home } from "lucide-react";
import { ROUTES } from "@/constants/routes/routeConstants";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
        py: { xs: 6, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          {/* 404 with Two Circle Zeros */}
          <Box
            sx={{
              mb: 5,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
              flexWrap: "nowrap",
            }}
          >
            {/* Số 4 đầu tiên */}
            <Typography
              sx={{
                fontSize: { xs: "100px", sm: "160px", md: "200px" },
                fontWeight: 900,
                color: "grey.300",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              4
            </Typography>

            {/* Số 0 thứ hai - Hình tròn có icon nhà */}
            <Box
              sx={{
                position: "relative",
                width: { xs: "100px", sm: "160px", md: "200px" },
                height: { xs: "100px", sm: "160px", md: "200px" },
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
                  border: "8px solid white",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <Home
                  size={isMobile ? 44 : 70}
                  color="white"
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
                />
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "110%",
                  height: "110%",
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  opacity: 0.15,
                  filter: "blur(20px)",
                  zIndex: 1,
                }}
              />
            </Box>

            {/* Số 4 cuối cùng */}
            <Typography
              sx={{
                fontSize: { xs: "100px", sm: "160px", md: "200px" },
                fontWeight: 900,
                color: "grey.300",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              4
            </Typography>
          </Box>

          {/* Main Message */}
          <Typography
            variant="h3"
            sx={{
              color: "text.primary",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
            }}
          >
            Oops! Trang không tồn tại
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 6,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
            không khả dụng. Hãy quay lại trang chủ để khám phá những homestay
            tuyệt vời!
          </Typography>

          {/* Single Action Button */}
          <Button
            variant="contained"
            size="large"
            startIcon={<Home size={22} />}
            onClick={handleGoHome}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              px: { xs: 4, md: 6 },
              py: 1.8,
              fontSize: "1.1rem",
              fontWeight: 600,
              borderRadius: "16px",
              textTransform: "none",
              boxShadow: "0 8px 28px rgba(0, 0, 0, 0.12)",
              "&:hover": {
                bgcolor: "primary.dark",
                transform: "translateY(-4px)",
                boxShadow: "0 14px 35px rgba(0, 0, 0, 0.2)",
              },
              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Về trang chủ
          </Button>

          {/* Decorative Elements */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              right: "5%",
              width: "140px",
              height: "140px",
              bgcolor: "primary.main",
              borderRadius: "50%",
              opacity: 0.06,
              filter: "blur(50px)",
              display: { xs: "none", md: "block" },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "12%",
              left: "6%",
              width: "180px",
              height: "180px",
              bgcolor: "secondary.main",
              borderRadius: "50%",
              opacity: 0.06,
              filter: "blur(60px)",
              display: { xs: "none", md: "block" },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
