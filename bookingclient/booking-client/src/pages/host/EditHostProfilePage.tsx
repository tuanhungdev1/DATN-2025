/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { Save, ArrowLeft } from "lucide-react";

import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import ImageUploadField from "@/components/uploadImage/ImageUploadField";
import {
  useGetHostProfileByIdQuery,
  useUpdateHostProfileMutation,
  useUploadIdentityCardMutation,
  useUploadBusinessLicenseMutation,
  useUploadTaxCodeDocumentMutation,
  useUploadHostAvatarMutation, // <-- THÊM API UPLOAD AVATAR
} from "@/services/endpoints/hostProfile.api";
import { useAuth } from "@/hooks/useAuth";
import { HostStatus, type UpdateHostProfile } from "@/types/hostProfile.types";
import { useToast } from "@/hooks/useToast";
import { ROUTES } from "@/constants/routes/routeConstants";

const validationSchema = Yup.object().shape({
  businessName: Yup.string().required("Tên doanh nghiệp là bắt buộc"),
  bankName: Yup.string().required("Tên ngân hàng là bắt buộc"),
  bankAccountNumber: Yup.string().required("Số tài khoản là bắt buộc"),
  bankAccountName: Yup.string().required("Tên chủ tài khoản là bắt buộc"),
  aboutMe: Yup.string().max(1000, "Giới thiệu không được quá 1000 ký tự"),
  languages: Yup.string(),
  applicantNote: Yup.string().max(500, "Ghi chú không được quá 500 ký tự"),
  taxCode: Yup.string(),
});

interface EditFormValues extends UpdateHostProfile {
  avatarFile?: File | null;
  identityCardFrontFile?: File | null;
  identityCardBackFile?: File | null;
  businessLicenseFile?: File | null;
  taxCodeDocumentFile?: File | null;
}

const EditHostProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const toast = useToast();

  const { data: hostProfileData, isLoading: isLoadingProfile } =
    useGetHostProfileByIdQuery(Number(user?.id), { skip: !user?.id });

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateHostProfileMutation();
  const [uploadIdentityCard, { isLoading: isUploadingIdentity }] =
    useUploadIdentityCardMutation();
  const [uploadBusinessLicense, { isLoading: isUploadingBusiness }] =
    useUploadBusinessLicenseMutation();
  const [uploadTaxDocument, { isLoading: isUploadingTax }] =
    useUploadTaxCodeDocumentMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] =
    useUploadHostAvatarMutation(); // NEW

  const hostProfile = hostProfileData?.data;

  const initialValues: EditFormValues = {
    businessName: hostProfile?.businessName || "",
    aboutMe: hostProfile?.aboutMe || "",
    languages: hostProfile?.languages || "",
    bankName: hostProfile?.bankName || "",
    bankAccountNumber: hostProfile?.bankAccountNumber || "",
    bankAccountName: hostProfile?.bankAccountName || "",
    taxCode: hostProfile?.taxCode || "",
    applicantNote: hostProfile?.applicantNote || "",
    avatarFile: null,
    identityCardFrontFile: null,
    identityCardBackFile: null,
    businessLicenseFile: null,
    taxCodeDocumentFile: null,
  };

  const handleSubmit = async (values: EditFormValues) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      if (!hostProfile) return;

      const updateData: UpdateHostProfile = {
        businessName: values.businessName,
        aboutMe: values.aboutMe,
        languages: values.languages,
        bankName: values.bankName,
        bankAccountNumber: values.bankAccountNumber,
        bankAccountName: values.bankAccountName,
        taxCode: values.taxCode,
        applicantNote: values.applicantNote,
      };

      await updateProfile({ id: hostProfile.id, data: updateData }).unwrap();

      // Upload Avatar nếu có
      if (values.avatarFile) {
        await uploadAvatar({
          hostId: hostProfile.id,
          file: values.avatarFile,
        }).unwrap();
      }

      // Upload CMND nếu có cả 2 mặt
      if (values.identityCardFrontFile && values.identityCardBackFile) {
        await uploadIdentityCard({
          hostId: hostProfile.id,
          data: {
            frontImage: values.identityCardFrontFile,
            backImage: values.identityCardBackFile,
          },
        }).unwrap();
      }

      if (values.businessLicenseFile) {
        await uploadBusinessLicense({
          hostId: hostProfile.id,
          data: { file: values.businessLicenseFile },
        }).unwrap();
      }

      if (values.taxCodeDocumentFile) {
        await uploadTaxDocument({
          hostId: hostProfile.id,
          data: { file: values.taxCodeDocumentFile },
        }).unwrap();
      }

      setSubmitSuccess(true);
      toast.success("Cập nhật hồ sơ thành công!");
      setTimeout(() => navigate(ROUTES.HOST_PROFILE), 1500);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        "Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.";
      setSubmitError(message);
      toast.error(message);
    }
  };

  if (isLoadingProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (!hostProfile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: "4px" }}>
          Không tìm thấy hồ sơ Host
        </Alert>
      </Container>
    );
  }

  if (hostProfile.status === HostStatus.Approved) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info" sx={{ borderRadius: "4px" }}>
          Hồ sơ đã được duyệt. Bạn không thể chỉnh sửa.
        </Alert>
        <AppButton
          onClick={() => navigate(ROUTES.HOST_PROFILE)}
          sx={{ mt: 2 }}
          startIcon={<ArrowLeft size={18} />}
        >
          Quay lại hồ sơ
        </AppButton>
      </Container>
    );
  }

  const isLoading =
    isUpdating ||
    isUploadingAvatar ||
    isUploadingIdentity ||
    isUploadingBusiness ||
    isUploadingTax;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          onClick={() => navigate(ROUTES.HOST_PROFILE)}
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
          Quay lại hồ sơ
        </Box>

        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Cập nhật hồ sơ Host
        </Typography>
        <Divider />
      </Box>

      {/* Yêu cầu bổ sung */}
      {hostProfile.status === HostStatus.RequiresMoreInfo &&
        hostProfile.reviewNote && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: "4px" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Yêu cầu bổ sung thông tin:
            </Typography>
            <Typography variant="body2">{hostProfile.reviewNote}</Typography>
          </Alert>
        )}

      {/* Error / Success */}
      {submitError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "4px" }}>
          {submitError}
        </Alert>
      )}
      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: "4px" }}>
          Cập nhật hồ sơ thành công! Đang chuyển hướng...
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Thông tin doanh nghiệp */}
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

            {/* Ngân hàng */}
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
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    name="bankAccountNumber"
                    label="Số tài khoản"
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField
                    name="bankAccountName"
                    label="Tên chủ tài khoản"
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormTextField name="taxCode" label="Mã số thuế (nếu có)" />
                </Grid>
              </Grid>
            </Paper>

            {/* Giấy tờ tùy thân */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Cập nhật CMND/CCCD (nếu cần)
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                Chỉ tải lên nếu bạn muốn thay đổi. Cần tải cả 2 mặt cùng lúc.
              </Alert>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        CMND/CCCD mặt trước
                      </Typography>
                      {hostProfile.identityCardFrontUrl && (
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={hostProfile.identityCardFrontUrl}
                            alt="Current front"
                            style={{
                              width: "100%",
                              maxHeight: 180,
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      )}
                      <ImageUploadField
                        value={values.identityCardFrontFile || null}
                        onChange={(file) =>
                          setFieldValue("identityCardFrontFile", file)
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        CMND/CCCD mặt sau
                      </Typography>
                      {hostProfile.identityCardBackUrl && (
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={hostProfile.identityCardBackUrl}
                            alt="Current back"
                            style={{
                              width: "100%",
                              maxHeight: 180,
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      )}
                      <ImageUploadField
                        value={values.identityCardBackFile || null}
                        onChange={(file) =>
                          setFieldValue("identityCardBackFile", file)
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* Giấy tờ kinh doanh */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Cập nhật giấy tờ kinh doanh (tùy chọn)
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Giấy phép kinh doanh
                      </Typography>
                      {hostProfile.businessLicenseUrl && (
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={hostProfile.businessLicenseUrl}
                            alt="Current license"
                            style={{
                              width: "100%",
                              maxHeight: 180,
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      )}
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
                  <Card variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        Giấy tờ mã số thuế
                      </Typography>
                      {hostProfile.taxCodeDocumentUrl && (
                        <Box sx={{ mb: 2 }}>
                          <img
                            src={hostProfile.taxCodeDocumentUrl}
                            alt="Current tax"
                            style={{
                              width: "100%",
                              maxHeight: 180,
                              objectFit: "contain",
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                      )}
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

            {/* Ghi chú */}
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

            {/* Nút hành động */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <AppButton
                variant="outlined"
                onClick={() => navigate(ROUTES.HOST_PROFILE)}
              >
                Hủy
              </AppButton>
              <AppButton
                type="submit"
                isLoading={isLoading}
                loadingText="Đang lưu..."
                startIcon={<Save size={20} />}
              >
                Lưu thay đổi
              </AppButton>
            </Box>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default EditHostProfilePage;
