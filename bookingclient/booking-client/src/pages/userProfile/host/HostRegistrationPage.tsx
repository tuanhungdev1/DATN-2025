// src/pages/host-registration/HostRegistrationDashboard.tsx
import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  type ChipProps,
} from "@mui/material";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileWarning,
  Ban,
} from "lucide-react";
import { AppButton } from "@/components/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetHostProfileByIdQuery } from "@/services/endpoints/hostProfile.api";
import CancelHostRegistration from "./CancelHostRegistration";
import { HostStatus } from "@/types/hostProfile.types";

const HostRegistrationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedHostProfileId, setSelectedHostProfileId] = useState<
    number | null
  >(null);

  const { data: hostProfileData, isLoading } = useGetHostProfileByIdQuery(
    parseInt(user?.id || "0"),
    {
      skip: !user?.id,
    }
  );

  const hostProfile = hostProfileData?.data;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreateRegistration = () => {
    navigate("create");
  };

  const handleViewDetails = () => {
    handleMenuClose();
    navigate(`${hostProfile?.id}/view`);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`${hostProfile?.id}/edit`);
  };

  const handleOpenCancelDialog = () => {
    if (hostProfile?.id) {
      setSelectedHostProfileId(hostProfile.id);
      setCancelDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleCloseCancelDialog = () => {
    setCancelDialogOpen(false);
    setSelectedHostProfileId(null);
  };

  const getStatusInfo = (
    status: HostStatus
  ): {
    label: string;
    color: ChipProps["color"];
    icon: ReactElement; // ✅ đổi ReactNode → ReactElement
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

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Đang tải...</Typography>
      </Container>
    );
  }

  // Nếu chưa có hồ sơ Host
  if (!hostProfile || hostProfile.status === HostStatus.Cancelled) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: "4px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Trở thành chủ nhà
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Bắt đầu hành trình kinh doanh homestay của bạn bằng cách đăng ký làm
            chủ nhà. Chúng tôi sẽ hướng dẫn bạn qua từng bước.
          </Typography>
          <AppButton
            onClick={handleCreateRegistration}
            startIcon={<Plus size={20} />}
            size="large"
          >
            Tạo đơn đăng ký
          </AppButton>
        </Paper>
      </Container>
    );
  }

  const statusInfo = getStatusInfo(hostProfile.status);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          Đơn đăng ký Host
        </Typography>
        <Divider />
      </Box>

      {hostProfile.status === HostStatus.RequiresMoreInfo &&
        hostProfile.reviewNote && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Yêu cầu bổ sung thông tin:
            </Typography>
            <Typography variant="body2">{hostProfile.reviewNote}</Typography>
          </Alert>
        )}

      {hostProfile.status === HostStatus.Rejected && hostProfile.reviewNote && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Lý do từ chối:
          </Typography>
          <Typography variant="body2">{hostProfile.reviewNote}</Typography>
        </Alert>
      )}

      {hostProfile.status === HostStatus.Approved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Chúc mừng! Đơn đăng ký của bạn đã được chấp nhận. Bạn có thể bắt đầu
          tạo homestay ngay bây giờ.
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {hostProfile.businessName || "Chưa cập nhật tên doanh nghiệp"}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Chip
                  label={statusInfo.label}
                  color={statusInfo.color}
                  size="small"
                  icon={statusInfo.icon}
                />
                {hostProfile.isSuperhost && (
                  <Chip
                    label="Superhost"
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
            </Box>
            <IconButton onClick={handleMenuClick}>
              <MoreVertical size={20} />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Ngày nộp đơn:
              </Typography>
              <Typography variant="body2">
                {new Date(hostProfile.submittedAt).toLocaleDateString("vi-VN")}
              </Typography>
            </Box>

            {hostProfile.reviewedAt && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Ngày xét duyệt:
                </Typography>
                <Typography variant="body2">
                  {new Date(hostProfile.reviewedAt).toLocaleDateString("vi-VN")}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Ngân hàng:
              </Typography>
              <Typography variant="body2">{hostProfile.bankName}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Số tài khoản:
              </Typography>
              <Typography variant="body2">
                {hostProfile.bankAccountNumber}
              </Typography>
            </Box>

            {hostProfile.applicantNote && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Ghi chú của bạn:
                  </Typography>
                  <Typography variant="body2">
                    {hostProfile.applicantNote}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <Eye size={18} style={{ marginRight: 8 }} />
          Xem chi tiết
        </MenuItem>
        {hostProfile.status !== HostStatus.Approved && (
          <MenuItem onClick={handleEdit}>
            <Edit size={18} style={{ marginRight: 8 }} />
            Chỉnh sửa
          </MenuItem>
        )}
        {hostProfile.status === HostStatus.Pending ||
        hostProfile.status === HostStatus.RequiresMoreInfo ? (
          <MenuItem onClick={handleOpenCancelDialog}>
            <Trash2 size={18} style={{ marginRight: 8 }} />
            Hủy đơn
          </MenuItem>
        ) : null}
      </Menu>

      <CancelHostRegistration
        open={cancelDialogOpen}
        onClose={handleCloseCancelDialog}
        hostProfileId={selectedHostProfileId || 0}
      />
    </Container>
  );
};

export default HostRegistrationPage;
