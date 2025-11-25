// src/pages/admin/PaymentManagement/AdminPaymentDetailPage.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Home,
  User,
  FileText,
  Clock,
  RefreshCw,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { useGetPaymentByIdQuery } from "@/services/endpoints/payment.api";
import { AppButton } from "@/components/button";
import {
  PaymentMethodDisplay,
  PaymentStatus,
  PaymentStatusColor,
  PaymentStatusDisplay,
} from "@/enums/paymentEnums";
import { useAdminPaymentActions } from "./useAdminPaymentActions";

dayjs.locale("vi");

const AdminPaymentDetailPage: React.FC = () => {
  const theme = useTheme();
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const {
    data: paymentData,
    isLoading,
    error,
    refetch,
  } = useGetPaymentByIdQuery(Number(paymentId), {
    skip: !paymentId,
  });

  const payment = paymentData?.data;

  // Admin Actions
  const { handleRefundPayment, handleMarkPaymentAsFailed } =
    useAdminPaymentActions({ onSuccess: refetch });

  // Dialog states
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [failedDialogOpen, setFailedDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [failureReason, setFailureReason] = useState("");

  const status = payment?.paymentStatus;

  // Action availability
  const canRefund = status === PaymentStatus.Completed;
  const canMarkFailed =
    status === PaymentStatus.Pending || status === PaymentStatus.Processing;

  // Action handlers
  const handleOpenRefundDialog = () => {
    setRefundAmount(payment?.paymentAmount.toString() || "");
    setRefundReason("");
    setRefundDialogOpen(true);
  };

  const handleConfirmRefund = async () => {
    if (payment && refundAmount && refundReason.trim().length >= 10) {
      const success = await handleRefundPayment(payment.id, {
        refundAmount: Number(refundAmount),
        refundReason: refundReason.trim(),
      });
      if (success) {
        setRefundDialogOpen(false);
        setRefundAmount("");
        setRefundReason("");
        refetch();
      }
    }
  };

  const handleConfirmFailed = async () => {
    if (payment && failureReason.trim().length >= 10) {
      const success = await handleMarkPaymentAsFailed(payment.id, {
        failureReason: failureReason.trim(),
      });
      if (success) {
        setFailedDialogOpen(false);
        setFailureReason("");
        refetch();
      }
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !payment) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy thông tin giao dịch</Alert>
      </Container>
    );
  }

  const cardSx = {
    borderRadius: "4px",
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden",
    mb: 3,
  };

  const refundAmountNum = Number(refundAmount);
  const isRefundAmountValid =
    refundAmountNum > 0 && refundAmountNum <= payment.paymentAmount;

  return (
    <Box>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ my: 2 }}>
          <Box
            onClick={() => navigate("/admin/payments")}
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
            Quay lại danh sách giao dịch
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
                }}
              >
                Chi tiết Giao dịch
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Mã giao dịch: <strong>#{payment.id}</strong>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <AppButton
                variant="outlined"
                startIcon={<RefreshCw size={18} />}
                onClick={() => refetch()}
              >
                Làm mới
              </AppButton>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Status & Actions Card */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Trạng thái & Hành động
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Chip
                    label={PaymentStatusDisplay[payment.paymentStatus]}
                    sx={{
                      backgroundColor: alpha(
                        PaymentStatusColor[payment.paymentStatus],
                        0.1
                      ),
                      color: PaymentStatusColor[payment.paymentStatus],
                      border: `1px solid ${
                        PaymentStatusColor[payment.paymentStatus]
                      }`,
                      fontWeight: 600,
                      fontSize: "1rem",
                      borderRadius: "8px",
                      px: 3,
                      py: 1.5,
                    }}
                  />

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      Cập nhật lần cuối
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {dayjs(payment.updatedAt).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Grid container spacing={2}>
                  {canRefund && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <AppButton
                        fullWidth
                        success
                        startIcon={<DollarSign size={18} />}
                        onClick={handleOpenRefundDialog}
                      >
                        Hoàn tiền
                      </AppButton>
                    </Grid>
                  )}

                  {canMarkFailed && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <AppButton
                        fullWidth
                        danger
                        startIcon={<XCircle size={18} />}
                        onClick={() => setFailedDialogOpen(true)}
                      >
                        Đánh dấu thất bại
                      </AppButton>
                    </Grid>
                  )}
                </Grid>

                {payment.failureReason && (
                  <Alert severity="error" sx={{ mt: 3, borderRadius: "8px" }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Lý do thất bại:
                    </Typography>
                    <Typography variant="body2">
                      {payment.failureReason}
                    </Typography>
                  </Alert>
                )}

                {payment.refundAmount && payment.refundAmount > 0 && (
                  <Alert severity="warning" sx={{ mt: 3, borderRadius: "8px" }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Thông tin hoàn tiền:
                    </Typography>
                    <Typography variant="body2" mb={1}>
                      Số tiền:{" "}
                      <strong>
                        {payment.refundAmount.toLocaleString()} VNĐ
                      </strong>
                    </Typography>
                    {payment.refundedAt && (
                      <Typography variant="caption" color="text.secondary">
                        <strong>Hoàn tiền lúc:</strong>{" "}
                        {dayjs(payment.refundedAt).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    )}
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Thông tin thanh toán
                </Typography>

                <Stack spacing={2.5}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <DollarSign
                        size={20}
                        color={theme.palette.primary.main}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        textTransform="uppercase"
                      >
                        Số tiền thanh toán
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      {payment.paymentAmount.toLocaleString()} VNĐ
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 1,
                      }}
                    >
                      <CreditCard
                        size={20}
                        color={theme.palette.text.secondary}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Phương thức thanh toán
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600}>
                      {
                        PaymentMethodDisplay[
                          payment.paymentMethod as keyof typeof PaymentMethodDisplay
                        ]
                      }
                    </Typography>
                  </Box>

                  {payment.paymentGateway && (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={0.5}
                      >
                        Cổng thanh toán
                      </Typography>
                      <Typography variant="body2">
                        {payment.paymentGateway}
                      </Typography>
                    </Box>
                  )}

                  {payment.transactionId && (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={0.5}
                      >
                        Mã giao dịch
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        sx={{
                          bgcolor: alpha(theme.palette.grey[500], 0.08),
                          p: 1,
                          borderRadius: "4px",
                          display: "inline-block",
                        }}
                      >
                        {payment.transactionId}
                      </Typography>
                    </Box>
                  )}

                  {payment.paymentGatewayId && (
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={0.5}
                      >
                        Gateway Transaction ID
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        sx={{
                          bgcolor: alpha(theme.palette.grey[500], 0.08),
                          p: 1,
                          borderRadius: "4px",
                          display: "inline-block",
                        }}
                      >
                        {payment.paymentGatewayId}
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Calendar
                          size={18}
                          color={theme.palette.text.secondary}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Ngày tạo
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {dayjs(payment.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    </Grid>

                    {payment.processedAt && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1,
                          }}
                        >
                          <Clock
                            size={18}
                            color={theme.palette.text.secondary}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Thời gian xử lý
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {dayjs(payment.processedAt).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>

                  {payment.paymentNotes && (
                    <>
                      <Divider />
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 1,
                          }}
                        >
                          <FileText
                            size={18}
                            color={theme.palette.text.secondary}
                          />
                          <Typography variant="caption" color="text.secondary">
                            Ghi chú
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {payment.paymentNotes}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Booking Info */}
            {payment.booking && (
              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Thông tin đặt phòng
                  </Typography>

                  <Stack spacing={2}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderRadius: "4px",
                        border: `1px solid ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={0.5}
                      >
                        Mã đặt phòng
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary"
                        sx={{ cursor: "pointer" }}
                        onClick={() =>
                          navigate(`/admin/bookings/${payment.bookingId}`)
                        }
                      >
                        {payment.booking.bookingCode}
                      </Typography>
                    </Box>

                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Home size={18} color={theme.palette.text.secondary} />
                        <Typography variant="caption" color="text.secondary">
                          Homestay
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight={600}>
                        {payment.booking.homestayTitle}
                      </Typography>
                    </Box>

                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <User size={18} color={theme.palette.text.secondary} />
                        <Typography variant="caption" color="text.secondary">
                          Khách hàng
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {payment.booking.guestName}
                      </Typography>
                    </Box>

                    <Divider />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          mb={0.5}
                        >
                          Check-in
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {dayjs(payment.booking.checkInDate).format(
                            "DD/MM/YYYY"
                          )}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          mb={0.5}
                        >
                          Check-out
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {dayjs(payment.booking.checkOutDate).format(
                            "DD/MM/YYYY"
                          )}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.success.main, 0.05),
                        borderRadius: "4px",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={0.5}
                      >
                        Tổng tiền đặt phòng
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="success">
                        {payment.booking.totalAmount.toLocaleString()} VNĐ
                      </Typography>
                    </Box>

                    <AppButton
                      fullWidth
                      variant="outlined"
                      onClick={() =>
                        navigate(`/admin/bookings/${payment.bookingId}`)
                      }
                    >
                      Xem chi tiết đặt phòng
                    </AppButton>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column - Summary */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card
              elevation={0}
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "4px",
              }}
            >
              <Box sx={{ bgcolor: "primary.main", color: "white", p: 2.5 }}>
                <Typography variant="h6" fontWeight={600}>
                  Tóm tắt giao dịch
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box
                    sx={{
                      p: 2.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderRadius: "4px",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      mb={0.5}
                    >
                      Số tiền giao dịch
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {payment.paymentAmount.toLocaleString()} VNĐ
                    </Typography>
                  </Box>

                  {payment.refundAmount && payment.refundAmount > 0 && (
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(theme.palette.error.main, 0.08),
                        borderRadius: "4px",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        mb={0.5}
                      >
                        Số tiền đã hoàn
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="error">
                        -{payment.refundAmount.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Trạng thái
                    </Typography>
                    <Chip
                      label={PaymentStatusDisplay[payment.paymentStatus]}
                      icon={
                        payment.paymentStatus === PaymentStatus.Completed ? (
                          <CheckCircle size={16} />
                        ) : payment.paymentStatus === PaymentStatus.Failed ? (
                          <XCircle size={16} />
                        ) : undefined
                      }
                      sx={{
                        backgroundColor: alpha(
                          PaymentStatusColor[payment.paymentStatus],
                          0.1
                        ),
                        color: PaymentStatusColor[payment.paymentStatus],
                        border: `1px solid ${
                          PaymentStatusColor[payment.paymentStatus]
                        }`,
                        fontWeight: 600,
                        borderRadius: "4px",
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Phương thức
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {
                        PaymentMethodDisplay[
                          payment.paymentMethod as keyof typeof PaymentMethodDisplay
                        ]
                      }
                    </Typography>
                  </Box>

                  {payment.paymentGateway && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Cổng thanh toán
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {payment.paymentGateway}
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Ngày tạo
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(payment.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                    </Typography>
                  </Box>

                  {payment.processedAt && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Ngày xử lý
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(payment.processedAt).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )}
                      </Typography>
                    </Box>
                  )}

                  {payment.refundedAt && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        Ngày hoàn tiền
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(payment.refundedAt).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Refund Dialog */}
      <Dialog
        open={refundDialogOpen}
        onClose={() => setRefundDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Hoàn tiền giao dịch #{payment?.id}</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn hoàn tiền cho giao dịch này?
          </Alert>

          <TextField
            fullWidth
            type="number"
            label="Số tiền hoàn *"
            placeholder="Nhập số tiền cần hoàn..."
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            error={!isRefundAmountValid && refundAmount !== ""}
            helperText={
              !isRefundAmountValid && refundAmount !== ""
                ? `Số tiền phải từ 1 đến ${payment?.paymentAmount.toLocaleString()} VNĐ`
                : `Tối đa: ${payment?.paymentAmount.toLocaleString()} VNĐ`
            }
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: <Typography variant="body2">VNĐ</Typography>,
            }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Lý do hoàn tiền *"
            placeholder="Vui lòng nhập lý do hoàn tiền (tối thiểu 10 ký tự)..."
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            error={refundReason.length < 10 && refundReason.length > 0}
            helperText={
              refundReason.length < 10 && refundReason.length > 0
                ? "Lý do phải có ít nhất 10 ký tự"
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialogOpen(false)}>Hủy</Button>
          <AppButton
            success
            onClick={handleConfirmRefund}
            disabled={!isRefundAmountValid || refundReason.length < 10}
          >
            Xác nhận hoàn tiền
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* Failed Dialog */}
      <Dialog
        open={failedDialogOpen}
        onClose={() => setFailedDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đánh dấu giao dịch thất bại #{payment?.id}</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn đánh dấu giao dịch này là thất bại?
          </Alert>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Lý do thất bại *"
            placeholder="Vui lòng nhập lý do thất bại (tối thiểu 10 ký tự)..."
            value={failureReason}
            onChange={(e) => setFailureReason(e.target.value)}
            error={failureReason.length < 10 && failureReason.length > 0}
            helperText={
              failureReason.length < 10 && failureReason.length > 0
                ? "Lý do phải có ít nhất 10 ký tự"
                : ""
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFailedDialogOpen(false)}>Hủy</Button>
          <AppButton
            danger
            onClick={handleConfirmFailed}
            disabled={failureReason.length < 10}
          >
            Đánh dấu thất bại
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPaymentDetailPage;
