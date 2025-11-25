/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  alpha,
} from "@mui/material";
import {
  CheckCircle,
  Calendar,
  Users,
  Home,
  CreditCard,
  Info,
  Phone,
  Mail,
  MapPin,
  Moon,
  User,
  Building2,
  Receipt,
  HomeIcon,
} from "lucide-react";
import { AppButton } from "@/components/button";
import { useGetBookingByIdQuery } from "@/services/endpoints/booking.api";
import { useToast } from "@/hooks/useToast";
import { AppImage } from "@/components/images";
import { formatCurrency } from "@/utils/format";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { BOOKING_STATUS_CONFIG } from "@/constants/bookingStatus";
import type { BreadcrumbItem } from "@/components/breadcrumb/AppBreadcrumbs";
import AppBreadcrumbs from "@/components/breadcrumb/AppBreadcrumbs";
import { ROUTES } from "@/constants/routes/routeConstants";
import BookingConfirmationPageSkeleton from "./BookingConfirmationPageSkeleton";
import { BookingStatus } from "@/enums/bookingStatus";
import { PaymentCountdown } from "@/components/coutdown/PaymentCountdown";

dayjs.locale("vi");

const BookingConfirmationPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: bookingData,
    isLoading,
    error,
  } = useGetBookingByIdQuery(Number(bookingId), {
    skip: !bookingId,
  });

  const booking = bookingData?.data;

  useEffect(() => {
    if (error) {
      toast.error("Không thể tải thông tin đơn đặt phòng");
      navigate("/user/profile/my-bookings");
    }
  }, [error, navigate, toast]);

  const handlePayment = () => {
    navigate(`/payment/${bookingId}`);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", path: ROUTES.HOME, icon: <HomeIcon size={14} /> },
    {
      label: "Đơn đặt phòng",
      path: "/user/profile/my-bookings",
      icon: <Building2 size={14} />,
    },
    {
      label: "Xác nhận đặt phòng",
      icon: <Receipt size={14} />,
    },
  ];

  if (isLoading) {
    return <BookingConfirmationPageSkeleton />;
  }

  if (!booking) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy thông tin đơn đặt phòng</Alert>
      </Container>
    );
  }

  const statusConfig = BOOKING_STATUS_CONFIG[booking.bookingStatus];
  const numberOfNights = dayjs(booking.checkOutDate).diff(
    dayjs(booking.checkInDate),
    "day"
  );

  return (
    <Box sx={{ py: 4, bgcolor: "grey.50", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <AppBreadcrumbs items={breadcrumbItems} />
        </Box>

        {/* Success Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: "4px",
          }}
        >
          <CheckCircle
            size={80}
            color="#4caf50"
            strokeWidth={2}
            style={{ marginBottom: 16 }}
          />
          <Typography variant="h4" fontWeight={700} mb={1}>
            Đặt phòng thành công!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Cảm ơn bạn đã đặt phòng. Vui lòng hoàn tất thanh toán để xác nhận
            đơn đặt phòng.
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Chip
              label={`Mã đơn: ${booking.bookingCode}`}
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                py: 2.5,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: "primary.main",
              }}
            />
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                py: 2.5,
                bgcolor: (theme) => alpha(statusConfig.color, 0.1),
                color: statusConfig.color,
              }}
            />
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column: Booking Details */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Homestay Info */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
              }}
            >
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
                    p: 3,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} color="white">
                    {booking.homestay.homestayTitle}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <MapPin size={16} color="white" />
                    <Typography variant="body2" color="white">
                      {booking.homestay.fullAddress}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Chi tiết đặt phòng
                </Typography>

                <Stack spacing={2.5}>
                  {/* Check-in/out dates */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.05),
                      borderRadius: "4px",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Calendar
                          size={18}
                          color="#1976d2"
                          style={{ marginRight: 8 }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                        >
                          NHẬN PHÒNG
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {dayjs(booking.checkInDate).format("DD/MM/YYYY")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(booking.checkInDate)
                          .format("dddd")
                          .charAt(0)
                          .toUpperCase() +
                          dayjs(booking.checkInDate).format("dddd").slice(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Sau {booking.homestay.checkInTime.slice(0, 5)}
                      </Typography>
                    </Box>

                    <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                    <Box sx={{ flex: 1, textAlign: "right" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                          sx={{ mr: 1 }}
                        >
                          TRẢ PHÒNG
                        </Typography>
                        <Calendar size={18} color="#1976d2" />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(booking.checkOutDate)
                          .format("dddd")
                          .charAt(0)
                          .toUpperCase() +
                          dayjs(booking.checkOutDate).format("dddd").slice(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Trước {booking.homestay.checkOutTime.slice(0, 5)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Nights & Guests */}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        bgcolor: (theme) =>
                          alpha(theme.palette.success.main, 0.05),
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    >
                      <Moon
                        size={28}
                        color="#4caf50"
                        style={{ marginBottom: 8 }}
                      />
                      <Typography variant="h6" fontWeight={700}>
                        {numberOfNights} đêm
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Thời gian lưu trú
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.05),
                        borderRadius: "4px",
                        textAlign: "center",
                      }}
                    >
                      <Users
                        size={28}
                        color="#1976d2"
                        style={{ marginBottom: 8 }}
                      />
                      <Typography variant="h6" fontWeight={700}>
                        {booking.numberOfGuests} khách
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.numberOfAdults} người lớn
                        {booking.numberOfChildren > 0 &&
                          `, ${booking.numberOfChildren} trẻ em`}
                        {booking.numberOfInfants > 0 &&
                          `, ${booking.numberOfInfants} em bé`}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Special Requests */}
                  {booking.specialRequests && (
                    <>
                      <Divider />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          mb={1}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Info size={18} />
                          Yêu cầu đặc biệt
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.specialRequests}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Thông tin liên hệ
                </Typography>

                <Stack spacing={3}>
                  {/* Người đặt phòng */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="primary"
                      mb={1.5}
                    >
                      Người đặt phòng
                    </Typography>
                    <Stack spacing={1}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <User size={18} color="#666" />
                        <Typography variant="body2">
                          <strong>Họ tên:</strong> {booking.guestFullName}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Mail size={18} color="#666" />
                        <Typography variant="body2">
                          <strong>Email:</strong> {booking.guestEmail}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Phone size={18} color="#666" />
                        <Typography variant="body2">
                          <strong>SĐT:</strong> {booking.guestPhoneNumber}
                        </Typography>
                      </Box>
                      {booking.guestAddress && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <MapPin size={18} color="#666" />
                          <Typography variant="body2">
                            <strong>Địa chỉ:</strong> {booking.guestAddress}
                            {booking.guestCity && `, ${booking.guestCity}`}
                            {booking.guestCountry &&
                              `, ${booking.guestCountry}`}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </Box>

                  {/* Người ở thực tế */}
                  {booking.isBookingForSomeoneElse && (
                    <>
                      <Divider />
                      <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Đặt phòng cho người khác
                        </Alert>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="secondary"
                          mb={1.5}
                        >
                          Người ở thực tế (sẽ check-in)
                        </Typography>
                        <Stack spacing={1}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Home size={18} color="#666" />
                            <Typography variant="body2">
                              <strong>Họ tên:</strong>{" "}
                              {booking.actualGuestFullName}
                            </Typography>
                          </Box>
                          {booking.actualGuestEmail && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Mail size={18} color="#666" />
                              <Typography variant="body2">
                                <strong>Email:</strong>{" "}
                                {booking.actualGuestEmail}
                              </Typography>
                            </Box>
                          )}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Phone size={18} color="#666" />
                            <Typography variant="body2">
                              <strong>SĐT:</strong>{" "}
                              {booking.actualGuestPhoneNumber}
                            </Typography>
                          </Box>
                          {booking.actualGuestIdNumber && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Info size={18} color="#666" />
                              <Typography variant="body2">
                                <strong>CMND/CCCD:</strong>{" "}
                                {booking.actualGuestIdNumber}
                              </Typography>
                            </Box>
                          )}
                          {booking.actualGuestNotes && (
                            <Box
                              sx={{
                                p: 1.5,
                                bgcolor: "grey.100",
                                borderRadius: "4px",
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Ghi chú:
                              </Typography>
                              <Typography variant="body2">
                                {booking.actualGuestNotes}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Host Information */}
            <Card
              elevation={0}
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Thông tin chủ nhà
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {booking.homestay.ownerAvatar ? (
                    <Box
                      component="img"
                      src={booking.homestay.ownerAvatar}
                      alt={booking.homestay.ownerName}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "1.5rem",
                      }}
                    >
                      {booking.homestay.ownerName.charAt(0).toUpperCase()}
                    </Box>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {booking.homestay.ownerName}
                    </Typography>
                    {booking.homestay.ownerEmail && (
                      <Typography variant="body2" color="text.secondary">
                        {booking.homestay.ownerEmail}
                      </Typography>
                    )}
                    {booking.homestay.ownerPhone && (
                      <Typography variant="body2" color="text.secondary">
                        {booking.homestay.ownerPhone}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              position: "sticky",
              top: 20,
              alignSelf: "start",
            }}
          >
            {/* Price Summary */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: (theme) => `2px solid ${theme.palette.primary.main}`,
                borderRadius: "4px",
              }}
            >
              <Box sx={{ bgcolor: "primary.main", color: "white", p: 2.5 }}>
                <Typography variant="h6" fontWeight={600}>
                  Tổng thanh toán
                </Typography>
              </Box>

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
                        {formatCurrency(booking.baseAmount / numberOfNights)} x{" "}
                        {numberOfNights} đêm
                      </Typography>
                    </Box>
                    <Typography variant="body1" fontWeight={600}>
                      {formatCurrency(booking.baseAmount)}
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
                        {formatCurrency(booking.cleaningFee)}
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
                        {formatCurrency(booking.serviceFee)}
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
                        {formatCurrency(booking.taxAmount)}
                      </Typography>
                    </Box>
                  )}

                  {booking.discountAmount > 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 1.5,
                        bgcolor: (theme) =>
                          alpha(theme.palette.success.main, 0.1),
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
                        -{formatCurrency(booking.discountAmount)}
                      </Typography>
                    </Box>
                  )}

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.08),
                      borderRadius: "4px",
                    }}
                  >
                    <Typography variant="h6" fontWeight={700}>
                      Tổng cộng
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary">
                      {formatCurrency(booking.totalAmount)}
                    </Typography>
                  </Box>

                  <AppButton
                    onClick={handlePayment}
                    success
                    size="large"
                    fullWidth
                    sx={{ py: 1.5, fontSize: "1.1rem", fontWeight: 700 }}
                    startIcon={<CreditCard size={20} />}
                  >
                    Thanh toán ngay
                  </AppButton>

                  <AppButton
                    onClick={() => navigate("/user/profile/my-bookings")}
                    variant="outlined"
                    size="large"
                    fullWidth
                  >
                    Xem đơn đặt phòng
                  </AppButton>

                  {booking.bookingStatus === BookingStatus.Pending &&
                  booking.paymentExpiresAt ? (
                    <Box
                      sx={{
                        p: 3,
                        bgcolor: "#ffc9c9",
                        color: "white",

                        textAlign: "center",
                      }}
                    >
                      <PaymentCountdown expiresAt={booking.paymentExpiresAt} />
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, opacity: 0.9, color: "black" }}
                      >
                        Vui lòng thanh toán trước khi hết thời gian, nếu không
                        đơn sẽ tự động hủy.
                      </Typography>
                    </Box>
                  ) : (
                    <Alert severity="info">
                      <Typography variant="caption">
                        Đơn đặt phòng đang chờ xử lý thanh toán.
                      </Typography>
                    </Alert>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Booking Info */}
            <Card
              elevation={0}
              sx={{
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                  Thông tin đơn hàng
                </Typography>
                <Stack spacing={1.5}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Mã đơn:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {booking.bookingCode}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Ngày đặt:
                    </Typography>
                    <Typography variant="body2">
                      {dayjs(booking.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Trạng thái:
                    </Typography>
                    <Chip
                      icon={statusConfig.icon}
                      label={statusConfig.label}
                      size="small"
                      sx={{
                        bgcolor: (theme) => alpha(statusConfig.color, 0.1),
                        color: statusConfig.color,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookingConfirmationPage;
