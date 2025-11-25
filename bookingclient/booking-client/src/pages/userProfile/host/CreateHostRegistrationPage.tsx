/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/host-registration/CreateHostRegistration.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Alert,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { Upload, ArrowLeft } from "lucide-react";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import ImageUploadField from "@/components/uploadImage/ImageUploadField";
import { useRegisterHostMutation } from "@/services/endpoints/hostProfile.api";
import { useAuth } from "@/hooks/useAuth";
import type { CreateHostProfile } from "@/types/hostProfile.types";
import { createHostProfileSchema } from "@/validators/hostProfileValidation";
import { useToast } from "@/hooks/useToast";

const CreateHostRegistrationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registerHost, { isLoading }] = useRegisterHostMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const toast = useToast();

  const initialValues: CreateHostProfile = {
    userId: parseInt(user?.id || "0"),
    businessName: "",
    aboutMe: "",
    languages: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
    identityCardFrontFile: null as any,
    identityCardBackFile: null as any,
    businessLicenseFile: null,
    taxCodeDocumentFile: null,
    applicantNote: "",
    avatarFile: null,
  };

  const handleSubmit = async (values: CreateHostProfile) => {
    try {
      setSubmitError(null);
      console.log(values);
      const response = await registerHost(values).unwrap();

      if (response.success) {
        toast.success("Đơn đăng ký Host của bạn đã được gửi thành công! 🎉");
        navigate("/user/profile/host-registration");
      }
    } catch (error: any) {
      console.error("Error creating host registration:", error);

      const message =
        error?.data?.message ||
        "Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại.";

      setSubmitError(message);
      toast.error(message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box
          onClick={() => navigate("/user/profile/host-registration")}
          sx={{
            mb: 3,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            color: "primary.main",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          <ArrowLeft size={16} />
          Quay lại
        </Box>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Đăng ký làm Host
        </Typography>
        <Divider />
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "4px" }}>
          {submitError}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={createHostProfileSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            {/* ===== Avatar ===== */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Ảnh đại diện
              </Typography>
              <Alert severity="info" sx={{ mb: 3, borderRadius: "4px" }}>
                Ảnh đại diện giúp khách hàng nhận diện bạn dễ dàng hơn. Nên chọn
                ảnh rõ mặt, chuyên nghiệp.
              </Alert>
              <Grid container spacing={3} justifyContent="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ borderRadius: "4px" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Ảnh đại diện
                      </Typography>
                      <ImageUploadField
                        value={values.avatarFile || null}
                        onChange={(file) => setFieldValue("avatarFile", file)}
                        error={
                          touched.avatarFile && errors.avatarFile
                            ? String(errors.avatarFile)
                            : undefined
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
            {/* ===== Thông tin doanh nghiệp ===== */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Thông tin doanh nghiệp
              </Typography>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <FormTextField
                    name="businessName"
                    label="Tên doanh nghiệp/Cá nhân"
                    required
                    placeholder="Nhập tên doanh nghiệp hoặc tên cá nhân..."
                  />
                </Grid>
                <Grid size={12}>
                  <FormTextField
                    name="aboutMe"
                    label="Giới thiệu về bạn"
                    placeholder="Giới thiệu ngắn gọn về bạn và kinh nghiệm..."
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid size={12}>
                  <FormTextField
                    name="languages"
                    label="Ngôn ngữ giao tiếp"
                    placeholder="VD: Tiếng Việt, Tiếng Anh, Tiếng Trung..."
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* ===== Thông tin ngân hàng ===== */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Thông tin ngân hàng
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    name="bankName"
                    label="Tên ngân hàng"
                    required
                    placeholder="VD: Vietcombank, BIDV, Techcombank..."
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    name="bankAccountNumber"
                    label="Số tài khoản"
                    required
                    placeholder="Nhập số tài khoản ngân hàng..."
                  />
                </Grid>
                <Grid size={12}>
                  <FormTextField
                    name="bankAccountName"
                    label="Tên chủ tài khoản"
                    required
                    placeholder="Nhập tên chủ tài khoản..."
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* ===== Giấy tờ tùy thân ===== */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Giấy tờ tùy thân
              </Typography>
              <Alert severity="info" sx={{ mb: 3, borderRadius: "4px" }}>
                Vui lòng cung cấp ảnh CMND/CCCD rõ ràng, đầy đủ 4 góc. Thông tin
                sẽ được bảo mật tuyệt đối.
              </Alert>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ borderRadius: "4px" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        CMND/CCCD mặt trước *
                      </Typography>
                      <ImageUploadField
                        value={values.identityCardFrontFile}
                        onChange={(file) =>
                          setFieldValue("identityCardFrontFile", file)
                        }
                        error={
                          touched.identityCardFrontFile &&
                          errors.identityCardFrontFile
                            ? String(errors.identityCardFrontFile)
                            : undefined
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ borderRadius: "4px" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        CMND/CCCD mặt sau *
                      </Typography>
                      <ImageUploadField
                        value={values.identityCardBackFile}
                        onChange={(file) =>
                          setFieldValue("identityCardBackFile", file)
                        }
                        error={
                          touched.identityCardBackFile &&
                          errors.identityCardBackFile
                            ? String(errors.identityCardBackFile)
                            : undefined
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* ===== Giấy tờ kinh doanh ===== */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Giấy tờ kinh doanh (Tùy chọn)
              </Typography>
              <Alert severity="info" sx={{ mb: 3, borderRadius: "4px" }}>
                Nếu bạn có giấy phép kinh doanh hoặc mã số thuế, vui lòng cung
                cấp để tăng độ tin cậy.
              </Alert>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ borderRadius: "4px" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Giấy phép kinh doanh
                      </Typography>
                      <ImageUploadField
                        value={values.businessLicenseFile || null}
                        onChange={(file) =>
                          setFieldValue("businessLicenseFile", file)
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined" sx={{ borderRadius: "4px" }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Giấy tờ mã số thuế
                      </Typography>
                      <ImageUploadField
                        value={values.taxCodeDocumentFile || null}
                        onChange={(file) =>
                          setFieldValue("taxCodeDocumentFile", file)
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* ===== Ghi chú bổ sung ===== */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Ghi chú bổ sung
              </Typography>
              <FormTextField
                name="applicantNote"
                label="Ghi chú của bạn"
                placeholder="Nếu bạn có thông tin bổ sung nào muốn chia sẻ..."
                multiline
                rows={4}
              />
            </Paper>

            {/* ===== Nút hành động ===== */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <AppButton
                variant="outlined"
                onClick={() => navigate("/host-registration")}
              >
                Hủy
              </AppButton>
              <AppButton
                type="submit"
                isLoading={isLoading}
                loadingText="Đang gửi..."
                startIcon={<Upload size={20} />}
              >
                Gửi đơn đăng ký
              </AppButton>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default CreateHostRegistrationPage;
