/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { AppButton } from "@/components/button";
import {
  useConfirmEmailMutation,
  useResendConfirmationMutation,
} from "@/services/endpoints/auth.api";
import { useToast } from "@/hooks/useToast";
import { ROUTES } from "@/constants/routes/routeConstants";

type VerificationStatus = "loading" | "success" | "error" | "invalid";

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");
  const toast = useToast();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [confirmEmail] = useConfirmEmailMutation();
  const [resendConfirmation, { isLoading: isResending }] =
    useResendConfirmationMutation();

  useEffect(() => {
    const verify = async () => {
      if (!email || !token) {
        setStatus("invalid");
        setMessage(
          "Liên kết xác thực không hợp lệ. Vui lòng kiểm tra lại email."
        );
        toast.warning(
          "Liên kết xác thực không hợp lệ. Vui lòng kiểm tra lại email."
        );
        return;
      }

      await verifyEmail(email, token);
    };

    verify();
  }, [email, token]);

  const verifyEmail = async (email: string, token: string) => {
    try {
      const response = await confirmEmail({ email, token }).unwrap();

      if (response.success) {
        setStatus("success");
        setMessage("Email của bạn đã được xác thực thành công!");
        toast.success("Email của bạn đã được xác thực thành công!");

        // Tự động chuyển đến trang đăng nhập sau 3 giây
        setTimeout(() => {
          navigate(ROUTES.AUTH_LOGIN, {
            state: {
              message: "Email đã xác thực! Vui lòng đăng nhập để tiếp tục.",
              verified: true,
            },
          });
        }, 3000);
      } else {
        setStatus("error");
        setMessage("Xác thực thất bại. Liên kết có thể đã hết hạn.");
        toast.error("Xác thực thất bại. Liên kết có thể đã hết hạn.");
      }
    } catch (error: any) {
      console.error("Lỗi xác thực email:", error);
      setStatus("error");
      const errorMsg =
        error?.data?.message ||
        "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.";
      setMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.AUTH_LOGIN);
  };

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      const response = await resendConfirmation({ email }).unwrap();
      if (response.success) {
        setMessage("Một email xác thực mới đã được gửi!");
        toast.success("Một email xác thực mới đã được gửi!");
      } else {
        toast.error("Gửi lại email xác thực thất bại. Vui lòng thử lại sau.");
      }
    } catch (err: any) {
      console.error("Gửi lại email thất bại:", err);
      toast.error(
        err?.data?.message ||
          "Gửi lại email xác thực thất bại. Vui lòng thử lại sau."
      );
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <CircularProgress size={60} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={700}>
              Đang xác thực email...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng đợi trong khi chúng tôi xác thực địa chỉ email của bạn.
            </Typography>
          </>
        );

      case "success":
        return (
          <>
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                bgcolor: "success.main",
                color: "success.contrastText",
                mb: 3,
              }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={700}>
              Email đã được xác thực!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Chuyển hướng về trang đăng nhập...
            </Typography>
            <AppButton fullWidth size="large" onClick={handleGoToLogin}>
              Đến trang đăng nhập
            </AppButton>
          </>
        );

      case "error":
        return (
          <>
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                bgcolor: "error.light",
                color: "error.contrastText",
                mb: 3,
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={700}>
              Xác thực thất bại
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            {email && (
              <AppButton
                fullWidth
                size="large"
                onClick={handleResendEmail}
                disabled={isResending}
                sx={{ mb: 2 }}
              >
                {isResending ? "Đang gửi..." : "Gửi lại email xác thực"}
              </AppButton>
            )}
            <AppButton fullWidth size="large" onClick={handleGoToLogin}>
              Quay về đăng nhập
            </AppButton>
          </>
        );

      case "invalid":
        return (
          <>
            <Box
              sx={{
                display: "inline-flex",
                p: 2,
                borderRadius: "50%",
                bgcolor: "warning.light",
                color: "warning.contrastText",
                mb: 3,
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: 60 }} />
            </Box>
            <Typography variant="h5" gutterBottom fontWeight={700}>
              Liên kết không hợp lệ
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <AppButton fullWidth size="large" onClick={handleGoToLogin}>
              Đến trang đăng nhập
            </AppButton>
          </>
        );

      default:
        return null;
    }
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
      {renderContent()}
    </Box>
  );
};

export default ConfirmEmail;
