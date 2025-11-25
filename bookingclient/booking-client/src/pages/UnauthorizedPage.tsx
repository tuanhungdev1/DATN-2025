// src/pages/error/UnauthorizedPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
} from "@mui/material";
import { ShieldAlert, Home, ArrowLeft, LogIn } from "lucide-react";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useAppSelector } from "@/store/hooks";

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleGoHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogin = () => {
    navigate(ROUTES.AUTH_LOGIN);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: "24px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "120px", sm: "160px" },
              height: { xs: "120px", sm: "160px" },
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              mb: 4,
              position: "relative",
              boxShadow: "0 10px 40px rgba(245, 87, 108, 0.3)",
              "&::before": {
                content: '""',
                position: "absolute",
                inset: "-10px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                opacity: 0.2,
                filter: "blur(20px)",
              },
            }}
          >
            <ShieldAlert size={isMobile ? 60 : 80} color="white" />
          </Box>

          {/* Main Message */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            403 - Truy cập bị từ chối
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 3,
              fontSize: { xs: "1rem", sm: "1.25rem" },
              fontWeight: 500,
            }}
          >
            {isAuthenticated
              ? "Bạn không có quyền truy cập trang này"
              : "Bạn cần đăng nhập để truy cập trang này"}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            {isAuthenticated
              ? "Trang này yêu cầu quyền truy cập đặc biệt mà tài khoản của bạn không có. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là một lỗi."
              : "Để tiếp tục, vui lòng đăng nhập vào tài khoản của bạn. Nếu bạn chưa có tài khoản, hãy đăng ký ngay!"}
          </Typography>

          {/* Reason Cards */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              mb: 4,
              px: { xs: 2, sm: 4 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                bgcolor: "#fff3f3",
                borderRadius: "12px",
                border: "1px solid #ffd6d6",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#d32f2f", fontWeight: 600 }}
              >
                {isAuthenticated
                  ? "✗ Quyền truy cập bị giới hạn"
                  : "✗ Chưa đăng nhập"}
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                bgcolor: "#fff3f3",
                borderRadius: "12px",
                border: "1px solid #ffd6d6",
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#d32f2f", fontWeight: 600 }}
              >
                {isAuthenticated
                  ? "✗ Vai trò không phù hợp"
                  : "✗ Cần xác thực tài khoản"}
              </Typography>
            </Paper>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {!isAuthenticated && (
              <Button
                variant="contained"
                size="large"
                startIcon={<LogIn size={20} />}
                onClick={handleLogin}
                sx={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "0 4px 20px rgba(245, 87, 108, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 25px rgba(245, 87, 108, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Đăng nhập
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              startIcon={<Home size={20} />}
              onClick={handleGoHome}
              sx={{
                borderColor: "#f5576c",
                color: "#f5576c",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "12px",
                textTransform: "none",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#f5576c",
                  bgcolor: "rgba(245, 87, 108, 0.05)",
                  borderWidth: "2px",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Về trang chủ
            </Button>

            <Button
              variant="text"
              size="large"
              startIcon={<ArrowLeft size={20} />}
              onClick={handleGoBack}
              sx={{
                color: "#f5576c",
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "12px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(245, 87, 108, 0.05)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Quay lại
            </Button>
          </Box>

          {/* Help Text */}
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 4,
              color: "text.secondary",
              fontSize: "0.875rem",
            }}
          >
            Cần hỗ trợ? Liên hệ{" "}
            <Box
              component="span"
              sx={{
                color: "#f5576c",
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              support@homestay.com
            </Box>
          </Typography>
        </Paper>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "150px",
            height: "150px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            filter: "blur(40px)",
            display: { xs: "none", md: "block" },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: "200px",
            height: "200px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            filter: "blur(50px)",
            display: { xs: "none", md: "block" },
          }}
        />
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;
