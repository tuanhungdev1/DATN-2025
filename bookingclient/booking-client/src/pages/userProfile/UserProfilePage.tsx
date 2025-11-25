import { Box, Card, CardContent, Typography, Grid, Chip } from "@mui/material";

import { useToast } from "@/hooks/useToast";
import { GenderChip, RoleChips } from "@/components/common";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useGetCurrentUserQuery } from "@/services/endpoints/auth.api";
import UserProfileSkeleton from "./UserProfileSkeleton";

const UserProfilePage = () => {
  const { data, isLoading, isError, error } = useGetCurrentUserQuery();
  const toast = useToast();

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (isError) {
    toast.error("Không thể tải thông tin cá nhân. Vui lòng thử lại sau.");
    console.error("Error fetching user profile:", error);
    return null;
  }

  const userProfile = data?.data;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Box
        mb={3}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h3" gutterBottom>
          Thông tin cá nhân
        </Typography>

        <Link to={ROUTES.USER_PROFILE_EDIT}>
          <Typography
            fontWeight={600}
            color="info"
            sx={{
              ":hover": {
                textDecoration: "underline",
              },
            }}
          >
            Chỉnh sửa
          </Typography>
        </Link>
      </Box>

      {/* Personal Information */}
      <Card sx={{ mb: 3, borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6" mb={2} gutterBottom>
            Thông tin cơ bản
          </Typography>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Tên đầy đủ
              </Typography>
              <Typography variant="body1">
                {userProfile?.fullName || "Chưa cung cấp"}
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Tên người dùng
              </Typography>
              <Typography variant="body1">
                {userProfile?.userName || "Chưa cung cấp"}
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {userProfile?.email || "Chưa cung cấp"}
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Số điện thoại
              </Typography>
              <Typography variant="body1">
                {userProfile?.phoneNumber || "Chưa cung cấp"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card sx={{ mb: 3, borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6" mb={2} gutterBottom>
            Thông tin bổ sung
          </Typography>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" mb={1} color="text.secondary">
                Giới tính
              </Typography>
              <Typography variant="body1">
                {userProfile?.gender ? (
                  <GenderChip gender={userProfile.gender} />
                ) : (
                  "Chưa cung cấp"
                )}
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" mb={1} color="text.secondary">
                Ngày sinh
              </Typography>
              <Typography variant="body1">
                {userProfile?.dateOfBirth
                  ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                  : "Chưa cung cấp"}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" mb={1} color="text.secondary">
                Địa chỉ
              </Typography>
              <Typography variant="body1">
                {userProfile?.address
                  ? `${userProfile.address}, ${userProfile.city || ""}, ${
                      userProfile.country || ""
                    }`
                  : "Chưa cung cấp"}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="body2" mb={1} color="text.secondary">
                Mã bưu điện
              </Typography>
              <Typography variant="body1">
                {userProfile?.postalCode
                  ? userProfile?.postalCode
                  : "Chưa cung cấp"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card sx={{ mb: 3, borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6" mb={2} gutterBottom>
            Trạng thái tài khoản
          </Typography>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" mb={1} color="text.secondary">
                Email đã xác nhận
              </Typography>
              <Chip
                label={
                  userProfile?.isEmailConfirmed
                    ? "Đã xác nhận"
                    : "Chưa xác nhận"
                }
                color={userProfile?.isEmailConfirmed ? "success" : "warning"}
                variant="outlined"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" mb={1} color="text.secondary">
                Xác thực 2 yếu tố
              </Typography>
              <Chip
                label={userProfile?.twoFactorEnabled ? "Bật" : "Tắt"}
                color={userProfile?.twoFactorEnabled ? "success" : "default"}
                variant="outlined"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" mb={1} color="text.secondary">
                Trạng thái tài khoản
              </Typography>
              <Chip
                label={userProfile?.isActive ? "Hoạt động" : "Không hoạt động"}
                color={userProfile?.isActive ? "success" : "error"}
                variant="outlined"
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <Typography variant="body2" mb={1} color="text.secondary">
                Tài khoản bị khóa
              </Typography>
              <Chip
                label={userProfile?.isLocked ? "Đã khóa" : "Không khóa"}
                color={userProfile?.isLocked ? "error" : "success"}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card
        sx={{
          borderRadius: "4px",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Vai trò
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {userProfile && userProfile?.roles.length > 0 ? (
              <RoleChips roles={userProfile.roles} />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có vai trò
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfilePage;
