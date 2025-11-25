/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
import { Formik, Form, type FormikHelpers, type FormikValues } from "formik";
import * as Yup from "yup";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/services/endpoints/auth.api";
import { useState } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useToast } from "@/hooks/useToast";

const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Định dạng email không hợp lệ")
    .required("Email là bắt buộc"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [emailSent, setEmailSent] = useState(false);
  const toast = useToast();

  const initialValues: FormikValues = {
    email: "",
  };

  const handleSubmit = async (
    values: FormikValues,
    { setSubmitting }: FormikHelpers<FormikValues>
  ): Promise<void> => {
    try {
      const response = await forgotPassword({ email: values.email }).unwrap();

      if (response.success) {
        setEmailSent(true);
        toast.success(
          response.message || "Liên kết đặt lại mật khẩu đã được gửi!"
        );
      } else {
        toast.error(
          "Gửi liên kết đặt lại mật khẩu thất bại. Vui lòng thử lại."
        );
      }
    } catch (err: any) {
      console.error("Quên mật khẩu thất bại:", err);
      toast.error(
        err?.data?.message ||
          "Đã xảy ra lỗi khi gửi liên kết đặt lại mật khẩu. Vui lòng thử lại sau."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (emailSent) {
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
          <MailOutlineIcon sx={{ fontSize: 48 }} />
        </Box>

        <Typography variant="h5" gutterBottom fontWeight={700}>
          Kiểm tra email
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi liên kết
          đặt lại mật khẩu. Vui lòng kiểm tra hộp thư đến của bạn.
        </Typography>

        <AppButton fullWidth size="large" onClick={() => navigate("/login")}>
          Quay lại Đăng nhập
        </AppButton>
      </Box>
    );
  }

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
        Quên mật khẩu
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật
        khẩu.
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={forgotPasswordSchema}
        onSubmit={handleSubmit}
        validateOnChange
        validateOnBlur
      >
        {({ isSubmitting }) => (
          <Form>
            <FormTextField
              name="email"
              label="Địa chỉ Email"
              type="email"
              placeholder="example@email.com"
              required
              autoFocus
              autoComplete="email"
            />

            <AppButton
              fullWidth
              size="large"
              type="submit"
              disabled={isSubmitting || isLoading}
              sx={{ mb: 2 }}
            >
              {isSubmitting || isLoading
                ? "Đang gửi..."
                : "Gửi liên kết đặt lại"}
            </AppButton>
          </Form>
        )}
      </Formik>

      <Typography
        variant="body2"
        sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
      >
        Bạn nhớ mật khẩu của mình?{" "}
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Box
            component="span"
            sx={{
              color: "primary.main",
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

export default ForgotPassword;
