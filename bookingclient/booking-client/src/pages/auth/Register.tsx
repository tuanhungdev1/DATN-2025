/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/auth/Register.tsx
import { Box, Typography, Stack, Alert } from "@mui/material";
import { Form, Formik, type FormikHelpers, type FormikValues } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "@/validators/authValidation";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { FormCheckbox } from "@/components/checkbox";
import { FormSelectField } from "@/components/select";
import { Gender } from "@/enums/gender.enum";
import { useRegisterMutation } from "@/services/endpoints/auth.api";
import { useToast } from "@/hooks/useToast";
import { ROUTES } from "@/constants/routes/routeConstants";

const Register = () => {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();
  const toast = useToast();
  const initialValues: FormikValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
    acceptTerms: false,
  };

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting, resetForm }: FormikHelpers<FormikValues>
  ): Promise<void> => {
    try {
      const response = await register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phoneNumber: values.phoneNumber,
        gender: values.gender ? (values.gender as Gender) : undefined,
        dateOfBirth: values.dateOfBirth || undefined,
        address: values.address || undefined,
        city: values.city || undefined,
        country: values.country || undefined,
        acceptTerms: values.acceptTerms,
      }).unwrap();

      if (response.success) {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản."
        );
        resetForm();
        // Chuyển đến trang thông báo đã gửi email xác nhận
        navigate(ROUTES.AUTH_VERIFY_EMAIL, {
          state: { email: values.email },
        });
      } else {
        toast.error(response.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      console.error("Đăng ký thất bại:", err);
      toast.error(err?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      mt={"70px"}
      maxWidth={"500px"}
      sx={{
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: 2,
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight={700}>
        Tạo tài khoản
      </Typography>

      <Typography variant="body2" gutterBottom>
        Điền vào biểu mẫu dưới đây để tạo tài khoản NextStay của bạn.
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
                // Trường hợp errItem là object { field, errors: [] }
                if (typeof errItem === "object" && errItem.errors) {
                  return (
                    <li key={index}>
                      {Array.isArray(errItem.errors)
                        ? errItem.errors.join(", ")
                        : errItem.errors}
                    </li>
                  );
                }

                // Trường hợp errItem chỉ là string
                return <li key={index}>{String(errItem)}</li>;
              })}
            </ul>
          ) : (
            (error as any)?.data?.message ||
            "Đăng ký thất bại. Vui lòng thử lại."
          )}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: 0 }}
            >
              <Box sx={{ flex: 1 }}>
                <FormTextField
                  name="firstName"
                  label="Họ"
                  placeholder="Nhập họ của bạn"
                  required
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormTextField
                  name="lastName"
                  label="Tên"
                  placeholder="Nhập tên của bạn"
                  required
                />
              </Box>
            </Stack>

            <FormTextField
              name="email"
              label="Địa chỉ email"
              type="email"
              placeholder="ví dụ: email@example.com"
              required
              autoComplete="email"
            />

            <FormTextField
              name="password"
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              showPasswordToggle
              required
              autoComplete="new-password"
            />

            <FormTextField
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              showPasswordToggle
              required
              autoComplete="new-password"
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: 0 }}
            >
              <Box sx={{ flex: 1 }}>
                <FormTextField
                  name="phoneNumber"
                  label="Số điện thoại"
                  placeholder="+84123456789"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormSelectField
                  name="gender"
                  label="Giới tính"
                  options={[
                    { value: Gender.Male, label: "Nam" },
                    { value: Gender.Female, label: "Nữ" },
                    { value: Gender.Other, label: "Khác" },
                  ]}
                />
              </Box>
            </Stack>

            <FormTextField name="dateOfBirth" label="Ngày sinh" type="date" />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mb: 0 }}
            >
              <Box sx={{ flex: 1 }}>
                <FormTextField
                  name="city"
                  label="Thành phố"
                  placeholder="Thành phố của bạn"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <FormTextField
                  name="country"
                  label="Quốc gia"
                  placeholder="Quốc gia của bạn"
                />
              </Box>
            </Stack>

            <FormTextField
              name="address"
              label="Địa chỉ"
              placeholder="Địa chỉ của bạn"
            />

            <FormCheckbox
              name="acceptTerms"
              label={
                <Box component="span">
                  Tôi đồng ý với{" "}
                  <Box
                    component="a"
                    href="/terms"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    điều khoản và điều kiện
                  </Box>
                </Box>
              }
              required
            />

            <AppButton
              fullWidth
              size="large"
              type="submit"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </AppButton>
          </Form>
        )}
      </Formik>

      <Typography
        variant="body2"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        Bạn đã có tài khoản?{" "}
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Box
            component="span"
            sx={{
              color: "primary.light",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Đăng nhập tại đây
          </Box>
        </Link>
      </Typography>
    </Box>
  );
};

export default Register;
