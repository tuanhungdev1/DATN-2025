// src/pages/admin/HostManagement/ViewHostDetail.tsx
import React from "react";
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
  Stack,
} from "@mui/material";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  Award,
  TrendingUp,
  Home,
  ShoppingBag,
  Star,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { AppButton } from "@/components/button";
import { useGetHostProfileByIdQuery } from "@/services/endpoints/hostProfile.api";

const ViewHostDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: hostProfileData, isLoading } = useGetHostProfileByIdQuery(
    parseInt(id || "0"),
    {
      skip: !id,
    }
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
        <Typography color="error">Không tìm thấy thông tin host</Typography>
      </Container>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          label: "Chờ duyệt",
          color: "warning" as const,
          icon: <Clock size={18} />,
        };
      case "UnderReview":
        return {
          label: "Đang xem xét",
          color: "info" as const,
          icon: <Clock size={18} />,
        };
      case "Approved":
        return {
          label: "Đã duyệt",
          color: "success" as const,
          icon: <CheckCircle size={18} />,
        };
      case "Rejected":
        return {
          label: "Đã từ chối",
          color: "error" as const,
          icon: <XCircle size={18} />,
        };
      case "RequiresMoreInfo":
        return {
          label: "Cần bổ sung",
          color: "warning" as const,
          icon: <FileText size={18} />,
        };
      case "Cancelled":
        return {
          label: "Đã hủy",
          color: "default" as const,
          icon: <XCircle size={18} />,
        };
      default:
        return {
          label: status,
          color: "default" as const,
          icon: <Clock size={18} />,
        };
    }
  };

  const statusInfo = getStatusInfo(hostProfile.status);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <AppButton
          onClick={() => navigate("/admin/hosts")}
          variant="text"
          startIcon={<ArrowLeft size={20} />}
          sx={{ mb: 2 }}
        >
          Quay lại danh sách
        </AppButton>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Chi tiết Host
          </Typography>
          <Stack direction="row" spacing={1}>
            <Chip
              label={statusInfo.label}
              color={statusInfo.color}
              icon={statusInfo.icon}
            />
            {hostProfile.isSuperhost && (
              <Chip
                label="Superhost"
                color="primary"
                icon={<Award size={18} />}
              />
            )}
            <Chip
              label={hostProfile.isActive ? "Hoạt động" : "Không hoạt động"}
              color={hostProfile.isActive ? "success" : "error"}
            />
          </Stack>
        </Box>
        <Divider />
      </Box>

      {/* Business Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Thông tin doanh nghiệp
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Building2 size={20} />
              <Typography variant="body2" color="text.secondary">
                Tên doanh nghiệp:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {hostProfile.businessName || "Chưa cập nhật"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <FileText size={20} />
              <Typography variant="body2" color="text.secondary">
                Mã số thuế:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {hostProfile.taxCode || "Chưa cập nhật"}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}
            >
              <FileText size={20} />
              <Typography variant="body2" color="text.secondary">
                Giới thiệu:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ ml: 3 }}>
              {hostProfile.aboutMe || "Chưa cập nhật"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <MapPin size={20} />
              <Typography variant="body2" color="text.secondary">
                Ngôn ngữ:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {hostProfile.languages || "Chưa cập nhật"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Bank Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Thông tin ngân hàng
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CreditCard size={20} />
              <Typography variant="body2" color="text.secondary">
                Ngân hàng:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {hostProfile.bankName}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CreditCard size={20} />
              <Typography variant="body2" color="text.secondary">
                Số tài khoản:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {hostProfile.bankAccountNumber}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <CreditCard size={20} />
              <Typography variant="body2" color="text.secondary">
                Chủ tài khoản:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {hostProfile.bankAccountName}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Thống kê
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Home size={20} color="#1976d2" />
                  <Typography variant="body2" color="text.secondary">
                    Tổng Homestay
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {hostProfile.totalHomestays}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <ShoppingBag size={20} color="#4caf50" />
                  <Typography variant="body2" color="text.secondary">
                    Tổng Booking
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {hostProfile.totalBookings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Star size={20} color="#ff9800" />
                  <Typography variant="body2" color="text.secondary">
                    Đánh giá TB
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {hostProfile.averageRating.toFixed(1)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined">
              <CardContent>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <TrendingUp size={20} color="#9c27b0" />
                  <Typography variant="body2" color="text.secondary">
                    Tỷ lệ phản hồi
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {hostProfile.responseRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Identity Documents */}
      <Paper sx={{ p: 3, mb: 3 }}>
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

      {/* Business Documents */}
      {(hostProfile.businessLicenseUrl || hostProfile.taxCodeDocumentUrl) && (
        <Paper sx={{ p: 3, mb: 3 }}>
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

      {/* Notes */}
      {(hostProfile.applicantNote || hostProfile.reviewNote) && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Ghi chú
          </Typography>
          {hostProfile.applicantNote && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Ghi chú từ Host:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {hostProfile.applicantNote}
              </Typography>
            </Box>
          )}
          {hostProfile.reviewNote && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Ghi chú Admin:
              </Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                {hostProfile.reviewNote}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Timeline */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Thời gian
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Calendar size={20} />
              <Typography variant="body2" color="text.secondary">
                Ngày đăng ký:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {new Date(hostProfile.registeredAsHostAt).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Calendar size={20} />
              <Typography variant="body2" color="text.secondary">
                Ngày nộp đơn:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {new Date(hostProfile.submittedAt).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
          {hostProfile.reviewedAt && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Calendar size={20} />
                <Typography variant="body2" color="text.secondary">
                  Ngày xét duyệt:
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
                {new Date(hostProfile.reviewedAt).toLocaleString("vi-VN")}
              </Typography>
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Calendar size={20} />
              <Typography variant="body2" color="text.secondary">
                Ngày tạo:
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
              {new Date(hostProfile.createdAt).toLocaleString("vi-VN")}
            </Typography>
          </Grid>
          {hostProfile.updatedAt && (
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Calendar size={20} />
                <Typography variant="body2" color="text.secondary">
                  Cập nhật lần cuối:
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500, ml: 3 }}>
                {new Date(hostProfile.updatedAt).toLocaleString("vi-VN")}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewHostDetail;
