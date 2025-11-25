/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography, Stack, CircularProgress, Grid } from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { updateUserProfileSchema } from "@/validators/userValidation";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { Gender } from "@/enums/gender.enum";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/services/endpoints/user.api";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useToast } from "@/hooks/useToast";
import { updateUser } from "@/store/slices/authSlice";
import { ROUTES } from "@/constants/routes/routeConstants";
import { FormSelectField } from "@/components/select";
import { FormDateTimeField } from "@/components/datetime";

// Hàm chuyển đổi ISO datetime → YYYY-MM-DD
const formatDateForInput = (isoString: string | null | undefined): string => {
  if (!isoString) return "";
  try {
    // "1998-11-12T00:00:00" → "1998-11-12"
    return isoString.split("T")[0];
  } catch {
    return "";
  }
};

const UserProfileEditPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const toast = useToast();

  const { data, isLoading, isError } = useGetUserProfileQuery(
    parseInt(user!.id),
    { skip: !user?.id }
  );

  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateUserProfileMutation();

  const userProfile = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !userProfile) {
    toast.error("Không thể tải thông tin hồ sơ.");
    return null;
  }

  const initialValues = {
    firstName: userProfile.firstName || "",
    lastName: userProfile.lastName || "",
    phoneNumber: userProfile.phoneNumber || "",
    dateOfBirth: formatDateForInput(userProfile.dateOfBirth?.toString()),
    gender: userProfile.gender ?? "",
    address: userProfile.address || "",
    city: userProfile.city || "",
    country: userProfile.country || "",
    postalCode: userProfile.postalCode || "",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const payload: any = {
        firstName: values.firstName,
        lastName: values.lastName,
      };

      // Chỉ thêm các field nếu có giá trị (tránh gửi null/undefined)
      if (values.phoneNumber) payload.phoneNumber = values.phoneNumber;
      if (values.dateOfBirth) payload.dateOfBirth = values.dateOfBirth;
      if (values.gender !== "") payload.gender = Number(values.gender);
      if (values.address) payload.address = values.address;
      if (values.city) payload.city = values.city;
      if (values.country) payload.country = values.country;
      if (values.postalCode) payload.postalCode = values.postalCode;

      const result = await updateProfile(payload).unwrap();

      if (result.success && result.data) {
        dispatch(updateUser(result.data));

        toast.success("Cập nhật hồ sơ thành công!");
        navigate(ROUTES.USER_PROFILE);
      }
    } catch (err: any) {
      console.error("Cập nhật hồ sơ thất bại:", err);
      toast.error(err?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 3 }}>
      <Box
        mb={3}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Chỉnh sủa thông tin
        </Typography>

        <Link to={ROUTES.USER_PROFILE}>
          <Typography
            fontWeight={600}
            color="info"
            sx={{
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            Xem thông tin
          </Typography>
        </Link>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={updateUserProfileSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            {/* Thông tin cơ bản */}
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <FormTextField
                    name="firstName"
                    label="Họ"
                    placeholder="Nhập họ"
                    required
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormTextField
                    name="lastName"
                    label="Tên"
                    placeholder="Nhập tên"
                    required
                  />
                </Box>
              </Stack>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField
                    name="phoneNumber"
                    label="Số điện thoại"
                    placeholder="+84 123 456 789"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormSelectField
                    name="gender"
                    label="Giới tính"
                    options={[
                      { value: "", label: "Chọn giới tính" },
                      { value: Gender.Male, label: "Nam" },
                      { value: Gender.Female, label: "Nữ" },
                      { value: Gender.Other, label: "Khác" },
                    ]}
                  />
                </Grid>
              </Grid>

              <FormDateTimeField
                name="dateOfBirth"
                label="Ngày sinh"
                type="date"
                max={new Date().toISOString().split("T")[0]} // Không chọn ngày tương lai
              />

              {/* Địa chỉ */}
              <Stack spacing={2}>
                <FormTextField
                  name="address"
                  label="Địa chỉ"
                  placeholder="Số nhà, đường, phường/xã"
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormTextField
                      name="city"
                      label="Thành phố/Tỉnh"
                      placeholder="Ví dụ: Hà Nội"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormTextField
                      name="country"
                      label="Quốc gia"
                      placeholder="Ví dụ: Việt Nam"
                    />
                  </Grid>
                </Grid>

                <FormTextField
                  name="postalCode"
                  label="Mã bưu điện"
                  placeholder="Ví dụ: 100000"
                />
              </Stack>

              {/* Nút hành động */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
              >
                <AppButton
                  variant="outlined"
                  onClick={() => navigate(ROUTES.USER_PROFILE)}
                  disabled={isSubmitting || isUpdating}
                >
                  Hủy
                </AppButton>
                <AppButton
                  type="submit"
                  disabled={!dirty || isSubmitting || isUpdating}
                  loading={isSubmitting || isUpdating}
                >
                  {isSubmitting || isUpdating ? "Đang cập nhật..." : "Cập nhật"}
                </AppButton>
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default UserProfileEditPage;
