/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Alert,
  Divider,
  type ChipProps,
} from "@mui/material";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Home,
  Edit,
  UserCheck,
  PauseCircle,
  CalendarDays,
  MessageSquareText,
  FileWarning,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useGetHostProfileByIdQuery } from "@/services/endpoints/hostProfile.api";
import { useAppSelector } from "@/store/hooks";
import { ROUTES } from "@/constants/routes/routeConstants";
import { AppButton } from "@/components/button";
import { HostStatus } from "@/types/hostProfile.types";
import type { ReactElement } from "react";

const HostProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetHostProfileByIdQuery(Number(user?.id), { skip: !user?.id });

  const host = response?.data;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  if (isError || !host) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: "4px" }}>
          Không thể tải hồ sơ. Vui lòng thử lại sau.
          <br />
          {(error as any)?.data?.message || "Lỗi không xác định"}
        </Alert>
      </Container>
    );
  }

  const getStatusInfo = (
    status: HostStatus
  ): {
    label: string;
    color: ChipProps["color"];
    icon: ReactElement;
  } => {
    switch (status) {
      case HostStatus.Pending:
        return {
          label: "Chờ duyệt",
          color: "warning",
          icon: <Clock size={18} />,
        };
      case HostStatus.UnderReview:
        return {
          label: "Đang xem xét",
          color: "info",
          icon: <AlertTriangle size={18} />,
        };
      case HostStatus.Approved:
        return {
          label: "Đã duyệt",
          color: "success",
          icon: <CheckCircle size={18} />,
        };
      case HostStatus.Rejected:
        return {
          label: "Bị từ chối",
          color: "error",
          icon: <XCircle size={18} />,
        };
      case HostStatus.RequiresMoreInfo:
        return {
          label: "Cần bổ sung thông tin",
          color: "warning",
          icon: <FileWarning size={18} />,
        };
      case HostStatus.Cancelled:
        return { label: "Đã hủy", color: "default", icon: <Ban size={18} /> };
      default:
        return {
          label: "Không xác định",
          color: "default",
          icon: <Clock size={18} />,
        };
    }
  };

  const statusInfo = getStatusInfo(host.status);

  return (
    <Container sx={{ py: 4 }}>
      {/* Header + Back + Edit */}
      <Box sx={{ mb: 4 }}>
        <Box
          onClick={() => navigate(ROUTES.HOST_DASHBOARD)}
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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Hồ sơ chủ nhà
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Chip
              label={statusInfo.label}
              icon={statusInfo.icon}
              color={statusInfo.color}
              size="small"
            />
            {host.isSuperhost && (
              <Chip
                label="Superhost"
                color="warning"
                icon={<Star size={16} />}
                size="small"
                sx={{ bgcolor: "#FFF4E5", color: "#FF8C00" }}
              />
            )}
            {host.isActive ? (
              <Chip
                label="Đang hoạt động"
                color="success"
                size="small"
                icon={<UserCheck size={16} />}
              />
            ) : (
              <Chip
                label="Tạm dừng"
                color="default"
                size="small"
                icon={<PauseCircle size={16} />}
              />
            )}
          </Box>
        </Box>
        <Divider />
      </Box>

      {/* Avatar + Tên + Ngày đăng ký */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {host.businessName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đã đăng ký:{" "}
            {new Date(host.registeredAsHostAt).toLocaleDateString("vi-VN")}
          </Typography>
        </Box>
        <Box sx={{ ml: "auto" }}>
          <AppButton
            variant="outlined"
            startIcon={<Edit size={18} />}
            onClick={() => navigate(ROUTES.HOST_PROFILE_EDIT)}
          >
            Chỉnh sửa
          </AppButton>
        </Box>
      </Paper>

      {/* Thống kê */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Thống kê hoạt động
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Home size={32} color="#1976d2" />
              <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                {host.totalHomestays}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Homestay
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <CalendarDays size={32} color="#4caf50" />
              <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                {host.totalBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đặt phòng
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Star size={32} color="#FFD700" />
              <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                {host.averageRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đánh giá
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <MessageSquareText size={32} color="#0288d1" />
              <Typography variant="h4" sx={{ fontWeight: "bold", mt: 1 }}>
                {host.responseRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phản hồi
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Thông tin doanh nghiệp */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Thông tin doanh nghiệp
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Tên doanh nghiệp:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {host.businessName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Ngôn ngữ:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {host.languages || "Chưa cập nhật"}
            </Typography>
          </Grid>
          {host.aboutMe && (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary">
                Giới thiệu:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                {host.aboutMe}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Ngân hàng */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Thông tin ngân hàng
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Ngân hàng:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {host.bankName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Số tài khoản:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {host.bankAccountNumber}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Chủ tài khoản:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {host.bankAccountName}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Giấy tờ tùy thân */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Giấy tờ tùy thân
        </Typography>
        <Grid container spacing={3}>
          {host.identityCardFrontUrl && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardMedia
                  component="img"
                  image={host.identityCardFrontUrl}
                  alt="CMND/CCCD mặt trước"
                  sx={{ height: 250, objectFit: "contain", bgcolor: "#f9f9f9" }}
                />
                <CardContent>
                  <Typography variant="subtitle2">
                    CMND/CCCD mặt trước
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {host.identityCardBackUrl && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardMedia
                  component="img"
                  image={host.identityCardBackUrl}
                  alt="CMND/CCCD mặt sau"
                  sx={{ height: 250, objectFit: "contain", bgcolor: "#f9f9f9" }}
                />
                <CardContent>
                  <Typography variant="subtitle2">CMND/CCCD mặt sau</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Giấy tờ kinh doanh */}
      {(host.businessLicenseUrl || host.taxCodeDocumentUrl) && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Giấy tờ kinh doanh
          </Typography>
          <Grid container spacing={3}>
            {host.businessLicenseUrl && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardMedia
                    component="img"
                    image={host.businessLicenseUrl}
                    alt="Giấy phép kinh doanh"
                    sx={{
                      height: 250,
                      objectFit: "contain",
                      bgcolor: "#f9f9f9",
                    }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2">
                      Giấy phép kinh doanh
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {host.taxCodeDocumentUrl && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardMedia
                    component="img"
                    image={host.taxCodeDocumentUrl}
                    alt="Giấy tờ mã số thuế"
                    sx={{
                      height: 250,
                      objectFit: "contain",
                      bgcolor: "#f9f9f9",
                    }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2">
                      Giấy tờ mã số thuế
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Ghi chú */}
      {host.applicantNote && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Ghi chú của bạn
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {host.applicantNote}
          </Typography>
        </Paper>
      )}

      {/* Phản hồi từ Admin */}
      {host.reviewNote && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: "#f5f5f5", borderRadius: "4px" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Phản hồi từ quản trị viên
          </Typography>
          <Typography variant="body1">{host.reviewNote}</Typography>
          {host.reviewedAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Xét duyệt lúc: {new Date(host.reviewedAt).toLocaleString("vi-VN")}
            </Typography>
          )}
        </Paper>
      )}

      {/* Thời gian */}
      <Paper sx={{ p: 3, borderRadius: "4px" }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Thời gian
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Ngày nộp đơn:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {new Date(host.submittedAt).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
          {host.reviewedAt && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Ngày xét duyệt:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(host.reviewedAt).toLocaleString("vi-VN")}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default HostProfilePage;
