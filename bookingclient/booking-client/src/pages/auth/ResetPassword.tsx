/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography, Alert } from "@mui/material";
import { Formik, Form, type FormikHelpers, type FormikValues } from "formik";
import * as Yup from "yup";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "@/services/endpoints/auth.api";
import { useEffect } from "react";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useToast } from "@/hooks/useToast";

const resetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .required("Mật khẩu là bắt buộc.")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt."
    ),
  confirmNewPassword: Yup.string()
    .required("Xác nhận mật khẩu là bắt buộc.")
    .oneOf(
      [Yup.ref("newPassword")],
      "Mật khẩu và xác nhận mật khẩu không khớp."
    ),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const toast = useToast();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!email || !token) {
      toast.warning(
        "Liên kết đặt lại mật khẩu không hợp lệ. Vui lòng yêu cầu liên kết mới."
      );
      navigate(ROUTES.AUTH_FORGOT_PASSWORD, { replace: true });
    }
  }, [email, token, navigate, toast]);

  const initialValues: FormikValues = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ): Promise<void> => {
    if (!email || !token) return;

    try {
      toast.loading("Đang đặt lại mật khẩu...");
      const response = await resetPassword({
        email,
        token,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      }).unwrap();

      if (response.success) {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate(ROUTES.AUTH_LOGIN, {
          state: {
            message:
              "Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.",
          },
          replace: true,
        });
      } else {
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      console.error("Đặt lại mật khẩu thất bại:", err);
      toast.error(err?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
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
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Đặt lại mật khẩu
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Nhập mật khẩu mới của bạn bên dưới.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: "4px",
          }}
        >
          {Array.isArray((error as any)?.data?.errors) &&
          (error as any).data.errors.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              {(error as any).data.errors.map((errItem: any, index: number) => {
                if (typeof errItem === "object" && errItem.errors) {
                  return (
                    <li key={index}>
                      {Array.isArray(errItem.errors)
                        ? errItem.errors.join(", ")
                        : errItem.errors}
                    </li>
                  );
                }
                return <li key={index}>{String(errItem)}</li>;
              })}
            </ul>
          ) : (
            (error as any)?.data?.message ||
            "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
          )}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={resetPasswordSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ isSubmitting }) => (
          <Form>
            <FormTextField
              name="newPassword"
              label="Mật khẩu mới"
              type="password"
              placeholder="Nhập mật khẩu mới"
              showPasswordToggle
              required
              autoComplete="new-password"
            />

            <FormTextField
              name="confirmNewPassword"
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              showPasswordToggle
              required
              autoComplete="new-password"
            />

            <AppButton
              fullWidth
              size="large"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? "Đang đặt lại..."
                : "Đặt lại mật khẩu"}
            </AppButton>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ResetPassword;
