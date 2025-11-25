/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
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
  Avatar,
} from "@mui/material";
import {
  Calendar,
  CreditCard,
  MapPin,
  ArrowLeft,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Info,
} from "lucide-react";

import { useGetPaymentByIdQuery } from "@/services/endpoints/payment.api";
import { AppButton } from "@/components/button";

import { PaymentStatus } from "@/enums/payment.enums";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import {
  PaymentMethodDisplay,
  PaymentStatusColor,
  PaymentStatusDisplay,
} from "@/enums/paymentEnums";

dayjs.locale("vi");

const PaymentDetailPage: React.FC = () => {
  const theme = useTheme();
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  const {
    data: paymentData,
    isLoading,
    error,
  } = useGetPaymentByIdQuery(Number(paymentId), {
    skip: !paymentId,
  });

  const payment = paymentData?.data;

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
        <Alert severity="error">Không tìm thấy thông tin thanh toán</Alert>
      </Container>
    );
  }

  const cardSx = {
    borderRadius: "4px",
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden",
    mb: 3,
  };

  const getStatusIcon = () => {
    switch (payment.paymentStatus) {
      case PaymentStatus.Completed:
        return <CheckCircle2 size={20} color={theme.palette.success.main} />;
      case PaymentStatus.Failed:
        return <AlertCircle size={20} color={theme.palette.error.main} />;
      case PaymentStatus.Pending:
      case PaymentStatus.Processing:
        return <Clock size={20} color={theme.palette.warning.main} />;
      case PaymentStatus.Refunded:
      case PaymentStatus.PartiallyRefunded:
        return <RefreshCw size={20} color={theme.palette.info.main} />;
      default:
        return <Info size={20} color={theme.palette.text.secondary} />;
    }
  };

  return (
    <Box>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ my: 2 }}>
          <Box
            onClick={() => navigate(-1)}
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
                Chi tiết thanh toán
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Mã giao dịch: <strong>#{payment.id}</strong>
              </Typography>
            </Box>

            <Chip
              icon={getStatusIcon()}
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
                fontSize: "0.875rem",
                borderRadius: "4px",
                px: 2,
                py: 2.5,
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Booking Info Card */}
            {payment.booking && (
              <Card elevation={0} sx={cardSx}>
                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      {payment.booking.homestayTitle}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      <MapPin size={14} />
                      <Typography
                        variant="body2"
                        sx={{ opacity: 0.9, textTransform: "capitalize" }}
                      >
                        {dayjs(payment.booking.checkInDate).format(
                          "DD/MM/YYYY"
                        )}{" "}
                        →{" "}
                        {dayjs(payment.booking.checkOutDate).format(
                          "DD/MM/YYYY"
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Mã đặt phòng
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {payment.booking.bookingCode}
                      </Typography>
                    </Box>

                    <Divider />

                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Calendar
                            size={18}
                            color={theme.palette.primary.main}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Nhận phòng
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                textTransform: "capitalize",
                              }}
                            >
                              {dayjs(payment.booking.checkInDate).format(
                                "dddd, DD [tháng] MM, YYYY"
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid size={12}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Calendar
                            size={18}
                            color={theme.palette.secondary.main}
                          />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Trả phòng
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                textTransform: "capitalize",
                              }}
                            >
                              {dayjs(payment.booking.checkOutDate).format(
                                "dddd, DD [tháng] MM, YYYY"
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box textAlign="right">
                      <AppButton
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/user/profile/my-bookings/${payment.bookingId}`
                          )
                        }
                      >
                        Xem chi tiết đặt phòng
                      </AppButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Payment Method & Transaction */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Phương thức thanh toán
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <CreditCard size={24} color={theme.palette.primary.main} />
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {PaymentMethodDisplay[payment.paymentMethod]}
                      </Typography>
                      {payment.paymentGateway && (
                        <Typography variant="caption" color="text.secondary">
                          Cổng: {payment.paymentGateway}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {payment.transactionId && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.grey[500], 0.08),
                        borderRadius: "4px",
                        border: `1px dashed ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Mã giao dịch
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{ wordBreak: "break-all", fontFamily: "monospace" }}
                      >
                        {payment.transactionId}
                      </Typography>
                    </Box>
                  )}

                  {payment.paymentGatewayId && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Mã cổng thanh toán
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {payment.paymentGatewayId}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Notes & Failure Reason */}
            {(payment.paymentNotes || payment.failureReason) && (
              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Ghi chú
                  </Typography>

                  {payment.paymentNotes && (
                    <Alert
                      severity="info"
                      icon={<FileText size={16} />}
                      sx={{ mb: 2, borderRadius: "4px" }}
                    >
                      <Typography variant="body2" whiteSpace="pre-line">
                        {payment.paymentNotes}
                      </Typography>
                    </Alert>
                  )}

                  {payment.failureReason && (
                    <Alert severity="error" icon={<AlertTriangle size={16} />}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Lý do thất bại:
                      </Typography>
                      <Typography variant="body2">
                        {payment.failureReason}
                      </Typography>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, lg: 5 }}>
            {/* Amount Breakdown */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "4px",
              }}
            >
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  p: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <DollarSign size={20} />
                <Typography variant="h6" fontWeight={600}>
                  Số tiền thanh toán
                </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    borderRadius: "4px",
                  }}
                >
                  <Typography variant="h5" fontWeight={700}>
                    {payment.paymentAmount.toLocaleString()} VNĐ
                  </Typography>
                  {payment.paymentStatus === PaymentStatus.Completed && (
                    <CheckCircle2
                      size={28}
                      color={theme.palette.success.main}
                    />
                  )}
                </Box>

                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      label={PaymentStatusDisplay[payment.paymentStatus]}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        backgroundColor: alpha(
                          PaymentStatusColor[payment.paymentStatus],
                          0.1
                        ),
                        color: PaymentStatusColor[payment.paymentStatus],
                      }}
                    />
                  </Box>

                  {payment.processedAt && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Thời gian xử lý
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {dayjs(payment.processedAt).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Ngày tạo
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {dayjs(payment.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Box>

                  {payment.refundAmount !== null &&
                    (payment.refundAmount || 0) > 0 && (
                      <>
                        <Divider />
                        <Box
                          sx={{
                            p: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            borderRadius: "4px",
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="info.main"
                            fontWeight={600}
                          >
                            Đã hoàn tiền:{" "}
                            {(payment.refundAmount || 0).toLocaleString()} VNĐ
                          </Typography>
                          {payment.refundedAt && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Hoàn lúc:{" "}
                              {dayjs(payment.refundedAt).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}
                </Stack>
              </CardContent>
            </Card>

            {/* Guest Info */}
            {payment.booking && (
              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Khách đặt
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ width: 50, height: 50 }}>
                      {payment.booking.guestName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight={600}>
                        {payment.booking.guestName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {payment.bookingId} - {payment.booking.bookingCode}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PaymentDetailPage;
