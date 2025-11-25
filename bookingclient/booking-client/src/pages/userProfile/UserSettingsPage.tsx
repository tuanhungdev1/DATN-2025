/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/user/UserSettingsPage.tsx
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useToast } from "@/hooks/useToast";
import { useGetUserProfileQuery } from "@/services/endpoints/user.api";
import { updateUser } from "@/store/slices/authSlice";
import { useEnable2FAMutation } from "@/services/endpoints/auth.api";

const UserSettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const toast = useToast();

  // Load lần đầu – chỉ để lấy dữ liệu ban đầu
  const { data, isLoading, isError } = useGetUserProfileQuery(
    parseInt(user!.id),
    { skip: !user?.id }
  );

  const [enable2FA, { isLoading: is2FALoading }] = useEnable2FAMutation();

  // Lấy **giá trị hiện tại** từ Redux store (được cập nhật khi bật/tắt 2FA)
  const twoFactorEnabled = user?.twoFactorEnabled ?? false;

  const handleToggle2FA = async (enable: boolean) => {
    try {
      const result = await enable2FA({ enable }).unwrap();

      if (result.success) {
        // Cập nhật store → UI sẽ thay đổi ngay lập tức
        if (user) {
          dispatch(
            updateUser({
              ...user,
              id: user.id || "", // Ensure id is always a string
              twoFactorEnabled: enable,
            })
          );
        }

        toast.success(
          enable
            ? "Xác thực hai yếu tố đã được bật!"
            : "Xác thực hai yếu tố đã được tắt!"
        );
      }
    } catch (err: any) {
      console.error("Lỗi khi thay đổi 2FA:", err);
      toast.error(err?.data?.message || "Không thể thay đổi cài đặt 2FA.");
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    toast.error("Không thể tải cài đặt tài khoản.");
    return null;
  }

  // Dữ liệu hiển thị trạng thái tài khoản (cũng lấy từ store)
  const profile = user!; // đã có trong store

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 3 }}>
      <Typography variant="h3" gutterBottom>
        Cài đặt tài khoản
      </Typography>

      {/* 2FA Settings */}
      <Card sx={{ mb: 3, borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Xác thực hai yếu tố (2FA)
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="body1" fontWeight={500}>
                {twoFactorEnabled ? "Đã bật" : "Đã tắt"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bảo vệ tài khoản bằng mã xác thực từ ứng dụng (Google
                Authenticator, Authy, …)
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={twoFactorEnabled}
                  onChange={(e) => handleToggle2FA(e.target.checked)}
                  disabled={is2FALoading}
                  color="primary"
                />
              }
              label={twoFactorEnabled ? "Bật" : "Tắt"}
              labelPlacement="start"
              sx={{
                "& .MuiFormControlLabel-label": { fontWeight: 600 },
              }}
            />
          </Stack>

          {is2FALoading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Đang cập nhật cài đặt 2FA...
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card sx={{ mb: 3, borderRadius: "4px" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Trạng thái tài khoản
          </Typography>

          <Stack spacing={2}>
            {/* Hoạt động */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tài khoản hoạt động
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {profile.isActive ? "Hoạt động" : "Không hoạt động"}
                </Typography>
              </Box>
              <Chip
                label={profile.isActive ? "Hoạt động" : "Không hoạt động"}
                color={profile.isActive ? "success" : "error"}
                size="small"
              />
            </Stack>

            {/* Email xác nhận */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email đã xác nhận
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {profile.isEmailConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                </Typography>
              </Box>
              <Chip
                label={
                  profile.isEmailConfirmed ? "Đã xác nhận" : "Chưa xác nhận"
                }
                color={profile.isEmailConfirmed ? "success" : "warning"}
                size="small"
              />
            </Stack>

            {/* Khóa tài khoản */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tài khoản bị khóa
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {profile.isLocked ? "Đã khóa" : "Không khóa"}
                </Typography>
              </Box>
              <Chip
                label={profile.isLocked ? "Đã khóa" : "Không khóa"}
                color={profile.isLocked ? "error" : "success"}
                size="small"
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Security Note */}
      <Alert severity="info" sx={{ borderRadius: "4px" }}>
        <Typography variant="body2">
          <strong>Lưu ý:</strong> Khi bật 2FA, bạn sẽ cần mã xác thực mỗi lần
          đăng nhập. Hãy cài đặt ứng dụng xác thực (Google Authenticator,
          Authy…) trước khi bật.
        </Typography>
      </Alert>
    </Box>
  );
};

export default UserSettingsPage;
