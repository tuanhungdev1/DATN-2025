/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/user/BookingManagement/BookingDetailPage.tsx
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
  Avatar,
  useTheme,
} from "@mui/material";
import {
  Calendar,
  Users,
  Home,
  MapPin,
  Phone,
  Mail,
  Clock,
  Moon,
  CreditCard,
  Edit,
  ArrowLeft,
} from "lucide-react";

import { useGetBookingByIdQuery } from "@/services/endpoints/booking.api";
import { AppButton } from "@/components/button";
import { AppImage } from "@/components/images";

import {
  BookingStatus,
  BookingStatusColor,
  BookingStatusDisplay,
} from "@/enums/bookingStatus";
import {
  PaymentStatus,
  PaymentStatusColor,
  PaymentStatusDisplay,
} from "@/enums/paymentEnums";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useGetCouponUsagesByBookingQuery } from "@/services/endpoints/coupon.api";
import MyBookingDetailPageSkeleton from "./MyBookingDetailPageSkeleton";
import { PaymentCountdown } from "@/components/coutdown/PaymentCountdown";

dayjs.locale("vi");

const MyBookingDetailPage: React.FC = () => {
  const theme = useTheme();
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const {
    data: bookingData,
    isLoading,
    error,
  } = useGetBookingByIdQuery(Number(bookingId), {
    skip: !bookingId,
  });

  const booking = bookingData?.data;

  const { data: couponUsagesData, isLoading: isLoadingCouponUsages } =
    useGetCouponUsagesByBookingQuery(Number(bookingId), {
      skip: !bookingId,
    });

  const appliedCoupons = couponUsagesData?.data || [];

  const handleEdit = () => {
    navigate(`/user/profile/my-bookings/${bookingId}/edit`);
  };

  const handlePayment = () => {
    navigate(`/payment/${bookingId}`);
  };

  const editableStatuses = new Set<BookingStatus>([
    BookingStatus.Pending,
    BookingStatus.Confirmed,
  ]);

  const canEdit =
    booking?.bookingStatus !== undefined &&
    editableStatuses.has(booking.bookingStatus) &&
    !booking?.hasReviewed;

  const canPay = booking?.bookingStatus === BookingStatus.Pending;

  if (isLoading) {
    return <MyBookingDetailPageSkeleton />;
  }

  if (error || !booking) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy thông tin đặt phòng</Alert>
      </Container>
    );
  }

  // Style chung cho Card
  const cardSx = {
    borderRadius: "4px",
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden",
    mb: 3,
  };

  return (
    <Box>
      <Container>
        {/* Header */}
        <Box sx={{ my: 2 }}>
          <Box
            onClick={() => navigate("/user/profile/my-bookings")}
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
            Quay lại danh sách
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
                Chi tiết đặt phòng
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Mã đặt phòng: <strong>{booking.bookingCode}</strong>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              {canEdit && (
                <AppButton
                  variant="outlined"
                  startIcon={<Edit size={18} />}
                  onClick={handleEdit}
                >
                  Cập nhật
                </AppButton>
              )}
              {canPay && (
                <AppButton
                  success
                  startIcon={<CreditCard size={18} />}
                  onClick={handlePayment}
                >
                  Thanh toán
                </AppButton>
              )}
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Status Card */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Trạng thái đặt phòng
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Chip
                    label={BookingStatusDisplay[booking.bookingStatus]}
                    sx={{
                      backgroundColor: alpha(
                        BookingStatusColor[booking.bookingStatus],
                        0.1
                      ),
                      color: BookingStatusColor[booking.bookingStatus],
                      border: `1px solid ${
                        BookingStatusColor[booking.bookingStatus]
                      }`,
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderRadius: "4px",
                      px: 2,
                      py: 2.5,
                    }}
                  />

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      Ngày đặt
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {dayjs(booking.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Box>
                </Box>

                {booking.cancellationReason && (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: "4px" }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Lý do hủy:
                    </Typography>
                    <Typography variant="body2">
                      {booking.cancellationReason}
                    </Typography>
                    {booking.cancelledAt && (
                      <Typography variant="caption" color="text.secondary">
                        Hủy lúc:{" "}
                        {dayjs(booking.cancelledAt).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    )}
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Homestay Info */}
            <Card elevation={0} sx={cardSx}>
              <Box sx={{ position: "relative", height: 250 }}>
                <AppImage
                  src={booking.homestay.mainImageUrl || ""}
                  alt={booking.homestay.homestayTitle}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    p: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="white">
                    {booking.homestay.homestayTitle}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <MapPin size={16} color="white" />
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{ opacity: 0.9 }}
                    >
                      {booking.homestay.fullAddress}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Loại hình
                    </Typography>
                    <Chip
                      icon={<Home size={16} />}
                      label={booking.homestay.propertyTypeName}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ mt: 1, borderRadius: "4px" }}
                    />
                  </Box>

                  <Divider />

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Clock size={18} color={theme.palette.action.active} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Nhận phòng
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {booking.homestay.checkInTime.slice(0, 5)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Clock size={18} color={theme.palette.action.active} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Trả phòng
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {booking.homestay.checkOutTime.slice(0, 5)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Thông tin đặt phòng
                </Typography>

                <Grid container spacing={3}>
                  {/* Ngày nhận phòng */}
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(theme.palette.primary.light, 0.05),
                        borderRadius: "4px",
                        border: `1px solid ${alpha(
                          theme.palette.primary.light,
                          0.2
                        )}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Calendar
                          size={20}
                          color={theme.palette.primary.light}
                        />
                        <Typography
                          fontSize={"12px"}
                          fontWeight={500}
                          color="primary.light"
                        >
                          Ngày nhận phòng
                        </Typography>
                      </Box>
                      <Typography
                        fontSize={"16px"}
                        fontWeight={700}
                        color="text.primary"
                        sx={{ lineHeight: 1.2, textTransform: "capitalize" }}
                      >
                        {dayjs(booking.checkInDate).format(
                          "dddd, DD MMMM YYYY"
                        )}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Ngày trả phòng */}
                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        borderRadius: "4px",
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          0.2
                        )}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Calendar
                          size={20}
                          color={theme.palette.secondary.main}
                        />
                        <Typography
                          fontSize={"13px"}
                          fontWeight={500}
                          color="secondary.main"
                        >
                          Ngày trả phòng
                        </Typography>
                      </Box>
                      <Typography
                        fontSize={"16px"}
                        fontWeight={700}
                        color="text.primary"
                        sx={{ lineHeight: 1.2, textTransform: "capitalize" }}
                      >
                        {dayjs(booking.checkOutDate).format(
                          "dddd, DD MMMM YYYY"
                        )}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Số đêm & Số khách */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.grey[500], 0.08),
                        borderRadius: "4px",
                        border: `1px solid ${theme.palette.divider}`,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Moon size={20} color={theme.palette.text.secondary} />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Số đêm lưu trú
                        </Typography>
                        <Typography fontSize={"14px"} fontWeight={500}>
                          {booking.numberOfNights} đêm
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.grey[500], 0.08),
                        borderRadius: "4px",
                        border: `1px solid ${theme.palette.divider}`,
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Users size={20} color={theme.palette.text.secondary} />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Số khách
                        </Typography>
                        <Typography fontSize={"14px"} fontWeight={500}>
                          {booking.numberOfAdults} người lớn
                          {booking.numberOfChildren > 0 &&
                            `, ${booking.numberOfChildren} trẻ em`}
                          {booking.numberOfInfants > 0 &&
                            `, ${booking.numberOfInfants} em bé`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {booking.specialRequests && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Yêu cầu đặc biệt
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {booking.specialRequests}
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Guest Info - Người đặt phòng */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Thông tin người đặt phòng
                </Typography>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <Avatar
                    src={booking.guestAvatar || ""}
                    alt={booking.guestFullName}
                    sx={{ width: 60, height: 60 }}
                  >
                    {booking.guestFullName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {booking.guestFullName}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Mail size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        {booking.guestEmail}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Phone size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="text.secondary">
                        {booking.guestPhoneNumber}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {(booking.guestAddress ||
                  booking.guestCity ||
                  booking.guestCountry) && (
                  <Box sx={{ mt: 2, pl: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                      Địa chỉ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {[
                        booking.guestAddress,
                        booking.guestCity,
                        booking.guestCountry,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Actual Guest Info - Người ở thực tế */}
            {booking.isBookingForSomeoneElse && (
              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Thông tin người ở thực tế
                  </Typography>

                  <Stack spacing={2}>
                    {booking.actualGuestFullName && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Users size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          <strong>Họ tên:</strong> {booking.actualGuestFullName}
                        </Typography>
                      </Box>
                    )}

                    {booking.actualGuestEmail && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Mail size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          <strong>Email:</strong> {booking.actualGuestEmail}
                        </Typography>
                      </Box>
                    )}

                    {booking.actualGuestPhoneNumber && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Phone size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          <strong>Số điện thoại:</strong>{" "}
                          {booking.actualGuestPhoneNumber}
                        </Typography>
                      </Box>
                    )}

                    {booking.actualGuestIdNumber && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          <strong>CCCD/CMND:</strong>{" "}
                          {booking.actualGuestIdNumber}
                        </Typography>
                      </Box>
                    )}

                    {booking.actualGuestNotes && (
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                          Ghi chú
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.actualGuestNotes}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Host Info */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Thông tin chủ nhà
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={booking.homestay.ownerAvatar || ""}
                    alt={booking.homestay.ownerName}
                    sx={{ width: 60, height: 60 }}
                  >
                    {booking.homestay.ownerName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {booking.homestay.ownerName}
                    </Typography>
                    {booking.homestay.ownerEmail && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Mail size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.homestay.ownerEmail}
                        </Typography>
                      </Box>
                    )}
                    {booking.homestay.ownerPhone && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Phone size={16} color={theme.palette.text.secondary} />
                        <Typography variant="body2" color="text.secondary">
                          {booking.homestay.ownerPhone}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Review Status */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Đánh giá
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {booking.hasReviewed ? (
                    <Chip
                      label="Đã đánh giá"
                      color="success"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  ) : booking.canReview ? (
                    <AppButton
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/user/profile/my-bookings/${bookingId}/review`
                        )
                      }
                    >
                      Viết đánh giá
                    </AppButton>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Chưa thể đánh giá
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Payment Notes */}
            {booking.paymentNotes && (
              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Ghi chú thanh toán
                  </Typography>
                  <Alert severity="info" sx={{ borderRadius: "4px" }}>
                    <Typography variant="body2">
                      {booking.paymentNotes}
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, lg: 5 }}>
            {/* Price Breakdown */}
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
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Chi tiết thanh toán
                </Typography>
              </Box>

              {canPay && booking.paymentExpiresAt && (
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "#ffc9c9",
                    color: "white",
                    textAlign: "center",
                    mb: 3,
                  }}
                >
                  <PaymentCountdown expiresAt={booking.paymentExpiresAt} />
                </Box>
              )}

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Giá cơ bản
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.numberOfNights} đêm
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600}>
                      {booking.baseAmount.toLocaleString()} VNĐ
                    </Typography>
                  </Box>

                  {booking.cleaningFee > 0 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Phí vệ sinh
                      </Typography>
                      <Typography variant="body2">
                        {booking.cleaningFee.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  )}

                  {booking.serviceFee > 0 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Phí dịch vụ
                      </Typography>
                      <Typography variant="body2">
                        {booking.serviceFee.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  )}

                  {booking.taxAmount > 0 && (
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Thuế VAT
                      </Typography>
                      <Typography variant="body2">
                        {booking.taxAmount.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  )}

                  {booking.discountAmount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1.5,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        borderRadius: "4px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight={600}
                      >
                        Giảm giá
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight={600}
                      >
                        -{booking.discountAmount.toLocaleString()} VNĐ
                      </Typography>
                    </Box>
                  )}

                  {booking.discountAmount > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          p: 1.5,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          borderRadius: "4px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight={600}
                        >
                          Giảm giá
                        </Typography>
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight={600}
                        >
                          -{booking.discountAmount.toLocaleString()} VNĐ
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 3 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="success.main"
                          sx={{ mb: 2 }}
                        >
                          Mã giảm giá đã áp dụng
                        </Typography>

                        {isLoadingCouponUsages ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CircularProgress size={16} />
                            <Typography variant="body2" color="text.secondary">
                              Đang tải thông tin mã...
                            </Typography>
                          </Box>
                        ) : appliedCoupons.length > 0 ? (
                          <Stack spacing={1}>
                            {appliedCoupons.map((usage) => (
                              <Card
                                key={usage.id}
                                elevation={0}
                                sx={{
                                  p: 1.5,
                                  border: `1px solid ${alpha(
                                    theme.palette.success.main,
                                    0.3
                                  )}`,
                                  borderRadius: "6px",
                                  bgcolor: alpha(
                                    theme.palette.success.main,
                                    0.05
                                  ),
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    gap: 2,
                                  }}
                                >
                                  <Chip
                                    label={usage.couponCode}
                                    size="small"
                                    color="success"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.8rem",
                                      height: 28,
                                    }}
                                  />
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="success.main"
                                  >
                                    -{usage.discountAmount.toLocaleString()} VNĐ
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Áp dụng:{" "}
                                    {dayjs(usage.usedAt).format(
                                      "DD/MM/YYYY HH:mm"
                                    )}
                                  </Typography>
                                </Box>
                              </Card>
                            ))}
                          </Stack>
                        ) : (
                          <Alert severity="info" sx={{ borderRadius: "6px" }}>
                            <Typography variant="body2">
                              Đã áp dụng giảm giá hệ thống tự động.
                            </Typography>
                          </Alert>
                        )}
                      </Box>
                    </Box>
                  )}

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderRadius: "4px",
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Tổng cộng
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      {booking.totalAmount.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Payment History */}
            {booking.payments && booking.payments.length > 0 && (
              <Card elevation={0} sx={cardSx}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    Lịch sử thanh toán
                  </Typography>

                  <Stack spacing={2}>
                    {booking.payments.map((payment, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: "4px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {payment.paymentMethodDisplay}
                          </Typography>
                          <Chip
                            label={
                              PaymentStatusDisplay[
                                payment.paymentStatus as PaymentStatus
                              ]
                            }
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                PaymentStatusColor[
                                  payment.paymentStatus as PaymentStatus
                                ],
                                0.1
                              ),
                              color:
                                PaymentStatusColor[
                                  payment.paymentStatus as PaymentStatus
                                ],
                              border: `1px solid ${
                                PaymentStatusColor[
                                  payment.paymentStatus as PaymentStatus
                                ]
                              }`,
                              fontWeight: 500,
                              fontSize: "0.75rem",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Số tiền: {payment.paymentAmount.toLocaleString()} VNĐ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(payment.createdAt).format("DD/MM/YYYY HH:mm")}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MyBookingDetailPage;
