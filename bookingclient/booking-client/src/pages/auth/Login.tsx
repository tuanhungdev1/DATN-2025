/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Formik, type FormikHelpers, type FormikValues } from "formik";

import { Alert, Box, Typography } from "@mui/material";

import { loginSchema } from "@/validators/authValidation";

import { FormTextField } from "@/components/Input";

import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";
import type { ReactFacebookLoginInfo } from "react-facebook-login";

import { AppButton } from "@/components/button";
import { FormCheckbox } from "@/components/checkbox";
import { Link, useNavigate } from "react-router-dom";
import {
  useFacebookLoginMutation,
  useGoogleLoginMutation,
  useLoginMutation,
} from "@/services/endpoints/auth.api";
import { setPendingEmail } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useToast } from "@/hooks/useToast";
import "@/styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();
  const [facebookLogin, { isLoading: isFacebookLoading }] =
    useFacebookLoginMutation();
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
      const response = await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      }).unwrap();

      if (response.success) {
        // Kiểm tra nếu cần 2FA
        if (response.message === "2FA code sent to your email") {
          // Nếu backend trả đúng thông báo 2FA (chuỗi gốc), vẫn giữ logic xử lý 2FA
          dispatch(setPendingEmail(values.email));
          navigate(ROUTES.AUTH_VERIFY_2FA, { state: { email: values.email } });
        } else {
          // Đăng nhập thành công
          navigate(ROUTES.HOME);
          toast.success(response.message);
        }
      }
    } catch (err: any) {
      // Xử lý các loại lỗi khác nhau

      if (err?.status === 400) {
        toast.error("Email hoặc mật khẩu không hợp lệ");
      } else if (err?.status === 403) {
        toast.error("Tài khoản bị khóa hoặc bị đình chỉ");
      } else if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handler cho Google Login
  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("Google response:", credentialResponse);
    try {
      // Decode JWT token từ Google để lấy thông tin
      const base64Url = credentialResponse.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decoded = JSON.parse(jsonPayload);

      const response = await googleLogin({
        email: decoded.email,
        externalId: decoded.sub,
        idToken: credentialResponse.credential,
        firstName: decoded.given_name || "",
        lastName: decoded.family_name || "",
        avatar: decoded.picture,
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        navigate(ROUTES.HOME);
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err?.data?.message) {
        toast.error(err.data.message);
      } else {
        toast.error("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
  };

  const handleFacebookResponse = async (response: ReactFacebookLoginInfo) => {
    console.log("Facebook response:", response);

    // response có dạng:
    // {
    //   accessToken: string,
    //   userID: string,
    //   email: string,
    //   name: string,
    //   picture: { data: { url: string } }
    // }

    if (response?.accessToken && response?.email) {
      try {
        const nameParts = response.name?.split(" ") || ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const result = await facebookLogin({
          email: response.email,
          externalId: response.userID,
          idToken: response.accessToken,
          firstName: firstName,
          lastName: lastName,
          avatar: response.picture?.data?.url,
        }).unwrap();

        if (result.success) {
          toast.success(result.message);
          navigate(ROUTES.HOME);
        }
      } catch (err: any) {
        console.error("Facebook login error:", err);
        if (err?.data?.message) {
          toast.error(err.data.message);
        } else {
          toast.error("Đăng nhập bằng Facebook thất bại. Vui lòng thử lại.");
        }
      }
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
        Đăng nhập hoặc tạo tài khoản
      </Typography>

      <Typography variant="body2" gutterBottom>
        Bạn có thể đăng nhập bằng tài khoản NextStay để truy cập dịch vụ của
        chúng tôi.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: "4px",
          }}
        >
          {(error as any)?.data?.message ||
            "Đăng nhập thất bại. Vui lòng thử lại."}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormTextField
              name="email"
              label="Địa chỉ Email"
              type="email"
              placeholder="ví dụ: email@example.com"
              required
              autoComplete="email"
            ></FormTextField>

            <FormTextField
              name="password"
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              showPasswordToggle={true}
              required
              autoComplete="password"
            ></FormTextField>

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
                style={{
                  textDecoration: "none",
                  marginTop: "-16px",
                }}
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
              {isSubmitting || isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </AppButton>
          </Form>
        )}
      </Formik>

      {/* Divider */}
      <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
        <Typography variant="body2" sx={{ mx: 2, color: "text.secondary" }}>
          Hoặc tiếp tục với
        </Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "divider" }} />
      </Box>

      {/* Social Login Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Google Login */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            size="large"
            width="400"
            text="continue_with"
            shape="rectangular"
            logo_alignment="left"
          />
        </Box>

        {/* Facebook Login */}
        <FacebookLogin
          appId={import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID"}
          autoLoad={false}
          fields="name,email,picture"
          callback={handleFacebookResponse}
          cssClass="facebook-login-button"
          textButton="Tiếp tục với Facebook"
          icon="fa-facebook"
        />
      </Box>

      <Typography
        variant="body2"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        Chưa có tài khoản?{" "}
        <Link to={"/register"}>
          <Box
            component="span"
            sx={{
              color: "primary.light",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Đăng ký ngay
          </Box>
        </Link>
      </Typography>
    </Box>
  );
};

export default Login;
