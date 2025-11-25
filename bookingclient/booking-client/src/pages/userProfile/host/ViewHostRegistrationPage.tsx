/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/host-registration/ViewHostRegistration.tsx
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Alert,
  type ChipProps,
} from "@mui/material";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  FileWarning,
  AlertTriangle,
} from "lucide-react";
import { useGetHostProfileByIdQuery } from "@/services/endpoints/hostProfile.api";
import { useAuth } from "@/hooks/useAuth";
import { HostStatus } from "@/types/hostProfile.types";
import type { ReactElement } from "react";

const ViewHostRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: hostProfileData, isLoading } = useGetHostProfileByIdQuery(
    parseInt(user?.id || "0"),
    { skip: !user?.id }
  );

  const hostProfile = hostProfileData?.data;

  if (isLoading) {
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
          Không tìm thấy đơn đăng ký
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

  const statusInfo = getStatusInfo(hostProfile.status);

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

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Chi tiết đơn đăng ký
          </Typography>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            icon={statusInfo.icon}
          />
        </Box>
        <Divider />
      </Box>

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
              {hostProfile.businessName || "Chưa cập nhật"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Ngôn ngữ:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {hostProfile.languages || "Chưa cập nhật"}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              Giới thiệu:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {hostProfile.aboutMe || "Chưa cập nhật"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Thông tin ngân hàng */}
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
              {hostProfile.bankName}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Số tài khoản:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {hostProfile.bankAccountNumber}
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Chủ tài khoản:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {hostProfile.bankAccountName}
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
          {hostProfile.identityCardFrontUrl && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardMedia
                  component="img"
                  image={hostProfile.identityCardFrontUrl}
                  alt="CMND/CCCD mặt trước"
                  sx={{ height: 250, objectFit: "contain", bgcolor: "#f5f5f5" }}
                />
                <CardContent>
                  <Typography variant="subtitle2">
                    CMND/CCCD mặt trước
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
          {hostProfile.identityCardBackUrl && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardMedia
                  component="img"
                  image={hostProfile.identityCardBackUrl}
                  alt="CMND/CCCD mặt sau"
                  sx={{ height: 250, objectFit: "contain", bgcolor: "#f5f5f5" }}
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
      {(hostProfile.businessLicenseUrl || hostProfile.taxCodeDocumentUrl) && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Giấy tờ kinh doanh
          </Typography>
          <Grid container spacing={3}>
            {hostProfile.businessLicenseUrl && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardMedia
                    component="img"
                    image={hostProfile.businessLicenseUrl}
                    alt="Giấy phép kinh doanh"
                    sx={{
                      height: 250,
                      objectFit: "contain",
                      bgcolor: "#f5f5f5",
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
            {hostProfile.taxCodeDocumentUrl && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardMedia
                    component="img"
                    image={hostProfile.taxCodeDocumentUrl}
                    alt="Giấy tờ mã số thuế"
                    sx={{
                      height: 250,
                      objectFit: "contain",
                      bgcolor: "#f5f5f5",
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
      {hostProfile.applicantNote && (
        <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Ghi chú của bạn
          </Typography>
          <Typography variant="body1">{hostProfile.applicantNote}</Typography>
        </Paper>
      )}

      {/* Phản hồi */}
      {hostProfile.reviewNote && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: "#f5f5f5", borderRadius: "4px" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Phản hồi từ quản trị viên
          </Typography>
          <Typography variant="body1">{hostProfile.reviewNote}</Typography>
          {hostProfile.reviewedAt && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Xét duyệt lúc:{" "}
              {new Date(hostProfile.reviewedAt).toLocaleString("vi-VN")}
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
              {new Date(hostProfile.submittedAt).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
          {hostProfile.reviewedAt && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Ngày xét duyệt:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(hostProfile.reviewedAt).toLocaleString("vi-VN")}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewHostRegistration;
