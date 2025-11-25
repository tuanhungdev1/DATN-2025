/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik, type FormikHelpers, type FormikValues } from "formik";
import { Alert, Box, Typography } from "@mui/material";
import { loginSchema } from "@/validators/authValidation";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { FormCheckbox } from "@/components/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { useLoginAdminMutation } from "@/services/endpoints/auth.api";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useToast } from "@/hooks/useToast";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [loginAdmin, { isLoading, error }] = useLoginAdminMutation();
  const toast = useToast();

  const initialValues: FormikValues = {
    email: "",
    password: "",
    rememberMe: false,
  };

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ): Promise<void> => {
    try {
      const response = await loginAdmin({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      }).unwrap();

      if (response.success) {
        // Đăng nhập thành công
        navigate(ROUTES.ADMIN_DASHBOARD);
        toast.success(response.message || "Đăng nhập admin thành công");
      }
    } catch (err: any) {
      // Xử lý lỗi
      if (err?.status === 400) {
        toast.error("Email hoặc mật khẩu không hợp lệ");
      } else if (err?.status === 403) {
        toast.error("Tài khoản bị khóa, tạm ngưng hoặc không có quyền admin");
      } else if (err?.status === 401) {
        toast.error("Không có quyền truy cập. Chỉ dành cho admin.");
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Không thể kết nối tới máy chủ. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      mt={"70px"}
      maxWidth={"400px"}
      sx={{
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Cổng quản trị
      </Typography>

      <Typography variant="body2" gutterBottom>
        Đăng nhập bằng tài khoản admin để truy cập bảng điều khiển quản trị.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ borderRadius: "4px" }}>
          {(error as any)?.data?.message ||
            "Đăng nhập admin thất bại. Vui lòng thử lại."}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ isSubmitting }) => (
          <Form>
            <FormTextField
              name="email"
              label="Email Admin"
              type="email"
              placeholder="admin@nextstay.com"
              required
              autoComplete="email"
            />

            <FormTextField
              name="password"
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              showPasswordToggle
              required
              autoComplete="current-password"
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <FormCheckbox name="rememberMe" label="Ghi nhớ đăng nhập" />
              <Link
                to={ROUTES.AUTH_FORGOT_PASSWORD}
                style={{ textDecoration: "none", marginTop: "-16px" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline",
                      color: "primary.light",
                    },
                    textWrap: "nowrap",
                  }}
                >
                  Quên mật khẩu?
                </Typography>
              </Link>
            </Box>

            <AppButton
              fullWidth
              size="large"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading
                ? "Đang đăng nhập..."
                : "Đăng nhập Admin"}
            </AppButton>
          </Form>
        )}
      </Formik>

      <Typography
        variant="body2"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        <Link to={ROUTES.AUTH_LOGIN}>
          <Box
            component="span"
            sx={{
              color: "primary.light",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Quay lại đăng nhập người dùng
          </Box>
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginAdmin;
