/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { AppButton } from "@/components/button";
import { useEffect, useState } from "react";
import { useResendConfirmationMutation } from "@/services/endpoints/auth.api";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useToast } from "@/hooks/useToast";

const EmailVerificationSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const toast = useToast();

  const [resendConfirmation, { isLoading }] = useResendConfirmationMutation();

  useEffect(() => {
    if (!email) {
      toast.error("Thiếu thông tin email. Chuyển hướng về trang đăng ký...");
      navigate(ROUTES.AUTH_REGISTER, { replace: true });
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, email, navigate, toast]);

  const handleResendEmail = async () => {
    try {
      const response = await resendConfirmation({ email }).unwrap();
      if (response.success) {
        toast.success("Email xác thực mới đã được gửi thành công!");
        setCountdown(60);
        setCanResend(false);
      } else {
        toast.error("Gửi lại email xác thực thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      console.error("Gửi lại xác nhận thất bại:", err);
      toast.error(
        err?.data?.message || "Đã xảy ra lỗi không mong muốn khi gửi lại email."
      );
    }
  };

  const handleBackToLogin = () => {
    toast.info("Quay về trang đăng nhập...");
    navigate(ROUTES.AUTH_LOGIN);
  };

  return (
    <Box
      mt={"70px"}
      maxWidth={"500px"}
      sx={{
        mx: "auto",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          p: 2,
          borderRadius: "50%",
          bgcolor: "primary.light",
          color: "primary.contrastText",
          mb: 3,
        }}
      >
        <EmailOutlinedIcon sx={{ fontSize: 48 }} />
      </Box>

      <Typography variant="h5" gutterBottom fontWeight={700}>
        Xác thực email
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Chúng tôi đã gửi email xác thực đến
      </Typography>

      <Typography
        variant="body1"
        fontWeight={600}
        color="primary.main"
        sx={{ mb: 3 }}
      >
        {email}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Vui lòng kiểm tra hộp thư đến và nhấn vào liên kết xác thực để kích hoạt
        tài khoản. Nếu bạn không thấy email, hãy kiểm tra thư mục spam.
      </Typography>

      <AppButton
        fullWidth
        size="large"
        onClick={handleResendEmail}
        disabled={!canResend || isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading
          ? "Đang gửi..."
          : canResend
          ? "Gửi lại email xác thực"
          : `Gửi lại sau ${countdown}s`}
      </AppButton>

      <AppButton fullWidth size="large" onClick={handleBackToLogin}>
        Quay về đăng nhập
      </AppButton>
    </Box>
  );
};

export default EmailVerificationSent;
