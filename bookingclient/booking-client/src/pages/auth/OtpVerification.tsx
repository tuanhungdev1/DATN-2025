/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/auth/OtpVerification.tsx
import { Box, Typography, Stack, Alert } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, type FormikHelpers, type FormikValues } from "formik";
import * as Yup from "yup";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { useEffect, useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  useVerify2FAMutation,
  useSend2FACodeMutation,
} from "@/services/endpoints/auth.api";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useToast } from "@/hooks/useToast";

const otpSchema = Yup.object({
  code: Yup.string()
    .matches(/^[0-9]{6}$/, "Mã xác minh phải gồm chính xác 6 chữ số")
    .required("Vui lòng nhập mã xác minh"),
});

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const toast = useToast();

  const [verify2FA, { isLoading, error }] = useVerify2FAMutation();
  const [send2FACode, { isLoading: isResending }] = useSend2FACodeMutation();

  useEffect(() => {
    if (!email) {
      toast.error("Không tìm thấy email. Vui lòng đăng nhập lại.");
      navigate(ROUTES.AUTH_LOGIN, { replace: true });
      return;
    }

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, email, navigate, toast]);

  const initialValues: FormikValues = {
    code: "",
  };

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ): Promise<void> => {
    try {
      const response = await verify2FA({
        email,
        code: values.code,
      }).unwrap();

      if (response.success) {
        toast.success("Xác minh OTP thành công!");
        navigate(ROUTES.HOME);
      } else {
        toast.error(
          response.message || "Mã OTP không hợp lệ. Vui lòng thử lại."
        );
      }
    } catch (err: any) {
      console.error("Xác minh OTP thất bại:", err);
      toast.error(
        err?.data?.message || "Xác minh OTP thất bại. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await send2FACode(email).unwrap();
      setCountdown(60);
      setCanResend(false);
      toast.success("Mã OTP đã được gửi lại thành công!");
    } catch (err: any) {
      console.error("Gửi lại OTP thất bại:", err);
      toast.error(
        err?.data?.message || "Gửi lại OTP thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <Box
      mt={"70px"}
      maxWidth={"450px"}
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
        <LockOutlinedIcon sx={{ fontSize: 48 }} />
      </Box>

      <Typography variant="h5" gutterBottom fontWeight={700}>
        Nhập mã xác minh
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Chúng tôi đã gửi mã xác minh 6 chữ số đến{" "}
        <Box component="span" fontWeight={600} color="primary.main">
          {email}
        </Box>
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "4px" }}>
          {(error as any)?.data?.message ||
            "Mã xác minh không hợp lệ hoặc đã hết hạn"}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={otpSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ isSubmitting }) => (
          <Form>
            <FormTextField
              name="code"
              label="Mã OTP"
              placeholder="Nhập mã 6 chữ số"
              required
              autoFocus
              autoComplete="off"
            />

            <AppButton
              fullWidth
              size="large"
              type="submit"
              disabled={isSubmitting || isLoading}
              sx={{ mb: 2 }}
            >
              {isSubmitting || isLoading ? "Đang xác minh..." : "Xác minh OTP"}
            </AppButton>
          </Form>
        )}
      </Formik>

      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
        sx={{ mt: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Chưa nhận được mã?
        </Typography>
        {canResend ? (
          <Typography
            variant="body2"
            color="primary.main"
            fontWeight={600}
            sx={{
              cursor: isResending ? "not-allowed" : "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={!isResending ? handleResendOtp : undefined}
          >
            {isResending ? "Đang gửi..." : "Gửi lại"}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.disabled">
            Gửi lại sau {countdown}s
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default OtpVerification;
