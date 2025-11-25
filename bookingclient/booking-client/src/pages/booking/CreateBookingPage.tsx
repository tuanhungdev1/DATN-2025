/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
// src/pages/booking/CreateBookingPage.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Formik, Form } from "formik";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Stack,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  CalendarMonth,
  People,
  CheckCircle,
  Info,
  EventAvailable,
  NightsStay,
  LocationOn,
  Home,
  Bed,
  Bathtub,
  Square,
  AccessTime,
  Cancel,
  Payment,
  DirectionsCar,
  Pets,
  Pool,
  MeetingRoom,
} from "@mui/icons-material";
import { DateRange } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { createBookingValidationSchema } from "@/validators/bookingValidation";
import {
  useCalculatePriceMutation,
  useCheckAvailabilityQuery,
  useCreateBookingMutation,
} from "@/services/endpoints/booking.api";
import { useCreateOnlinePaymentMutation } from "@/services/endpoints/payment.api";
import { useGetHomestayBySlugQuery } from "@/services/endpoints/homestay.api";
import { useToast } from "@/hooks/useToast";
import type {
  CreateBooking,
  BookingPriceBreakdown,
  BookingPriceCalculation,
} from "@/types/booking.types";
import { AppImage } from "@/components/images";
import type { BreadcrumbItem } from "@/components/breadcrumb/AppBreadcrumbs";
import { ROUTES } from "@/constants/routes/routeConstants";
import {
  Building2,
  Calendar,
  Check,
  Clock,
  DollarSign,
  HomeIcon,
  XCircle,
} from "lucide-react";
import AppBreadcrumbs from "@/components/breadcrumb/AppBreadcrumbs";
import type { AvailabilityCalendar } from "@/types/homestay.types";
import { useAuth } from "@/hooks/useAuth";
import BookingPageSkeleton from "./BookingPageSkeleton";

dayjs.locale("vi");

// Component AvailabilitySection
const AvailabilitySection = ({
  availabilityCalendars,
}: {
  availabilityCalendars: AvailabilityCalendar[];
}) => {
  const [showAll, setShowAll] = useState(false);

  // 🔹 Lọc các ngày còn trống (có thể book được)
  const availableDates = availabilityCalendars.filter(
    (cal) => cal.isAvailable && !cal.isBlocked
  );

  const displayCalendars = showAll
    ? availableDates
    : availableDates.slice(0, 12);

  // 🔹 Khi không có ngày trống
  if (availableDates.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Lịch khả dụng
        </Typography>
        <Alert severity="info">
          Hiện tại không có ngày trống. Vui lòng liên hệ chủ nhà để biết thêm
          thông tin.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* 🔹 Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Lịch khả dụng ({availableDates.length})
        </Typography>
        {availableDates.length > 12 && (
          <AppButton
            variant="text"
            onClick={() => setShowAll(!showAll)}
            size="small"
          >
            {showAll ? "Thu gọn" : `Xem tất cả (${availableDates.length})`}
          </AppButton>
        )}
      </Box>

      {/* 🔹 Danh sách ngày khả dụng */}
      <Grid container spacing={2}>
        {displayCalendars.map((calendar, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} key={index}>
            <Card
              sx={{
                p: 2,
                height: "100%",
                border: "1px solid",
                borderColor: calendar.isAvailable
                  ? "success.light"
                  : "error.light",
                bgcolor: calendar.isBlocked
                  ? "error.50"
                  : calendar.isAvailable
                  ? "success.50"
                  : "grey.50",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "success.main",
                  boxShadow: 2,
                },
              }}
            >
              {/* 🔸 Ngày */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Calendar size={18} />
                <Typography variant="subtitle2" fontWeight={600}>
                  {new Date(calendar.availableDate).toLocaleDateString(
                    "vi-VN",
                    {
                      weekday: "long", // hiển thị đầy đủ: Thứ Hai
                      day: "2-digit",
                      month: "long", // hiển thị đầy đủ: tháng Mười
                      year: "numeric",
                    }
                  )}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Stack spacing={1}>
                {/* 🔸 Trạng thái khả dụng */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {calendar.isAvailable ? (
                    <Check size={16} color="#4caf50" />
                  ) : (
                    <XCircle size={16} color="#f44336" />
                  )}
                  <Typography
                    variant="body2"
                    color={calendar.isAvailable ? "success.main" : "error.main"}
                    fontWeight={500}
                  >
                    {calendar.isAvailable ? "Có sẵn" : "Không có sẵn"}
                  </Typography>
                </Box>

                {/* 🔸 Nếu bị chặn */}
                {calendar.isBlocked && (
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "error.100",
                      borderRadius: 0.5,
                      border: "1px solid",
                      borderColor: "error.main",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="error.main"
                      fontWeight={500}
                    >
                      ⚠️ Bị chặn
                    </Typography>
                    {calendar.blockReason && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="error.dark"
                      >
                        Lý do: {calendar.blockReason}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* 🔸 Giá tùy chỉnh */}
                {calendar.customPrice && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <DollarSign size={14} color="#666" />
                    <Typography variant="caption" color="text.secondary">
                      Giá:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                    >
                      {calendar.customPrice.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                )}

                {/* 🔸 Số đêm tối thiểu */}
                {calendar.minimumNights && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Clock size={14} color="#666" />
                    <Typography variant="caption" color="text.secondary">
                      Tối thiểu:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {calendar.minimumNights} đêm
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Nếu danh sách trống (fallback an toàn) */}
      {availableDates.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có lịch khả dụng nào
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

const CreateBookingPage = () => {
  const { homestayId } = useParams<{ homestayId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Date range state for react-date-range
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [priceBreakdown, setPriceBreakdown] =
    useState<BookingPriceBreakdown | null>(null);
  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [isBookingForSomeoneElse, setIsBookingForSomeoneElse] = useState(false);

  const [validationDialog, setValidationDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: "",
    message: "",
  });
  // Get initial dates from URL params
  const checkInFromUrl = searchParams.get("checkIn") || "";
  const checkOutFromUrl = searchParams.get("checkOut") || "";
  const guestsFromUrl = parseInt(searchParams.get("guests") || "2");
  const { user: userInfo } = useAuth();
  const [guestCounts, setGuestCounts] = useState({
    adults: guestsFromUrl,
    children: 0,
    infants: 0,
  });

  // Initialize date range from URL
  useEffect(() => {
    if (checkInFromUrl && checkOutFromUrl) {
      setDateRange([
        {
          startDate: new Date(checkInFromUrl),
          endDate: new Date(checkOutFromUrl),
          key: "selection",
        },
      ]);
    }
  }, [checkInFromUrl, checkOutFromUrl]);

  // Fetch homestay data
  const {
    data: homestayData,
    isLoading: isLoadingHomestay,
    error: homestayError,
  } = useGetHomestayBySlugQuery(homestayId!, {
    skip: !homestayId,
  });

  const homestay = homestayData?.data;

  // Mutations
  const [calculatePrice, { isLoading: isCalculating }] =
    useCalculatePriceMutation();
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();
  const [createOnlinePayment, { isLoading: isCreatingPayment }] =
    useCreateOnlinePaymentMutation();

  useEffect(() => {
    if (
      homestay &&
      dateRange[0].startDate &&
      dateRange[0].endDate &&
      numberOfNights > 0 &&
      guestCounts.adults > 0
    ) {
      const timer = setTimeout(() => {
        const totalGuests =
          guestCounts.adults + guestCounts.children + guestCounts.infants;

        handleCalculatePrice({
          homestayId: homestay.id,
          checkInDate: dayjs(dateRange[0].startDate).format("YYYY-MM-DD"),
          checkOutDate: dayjs(dateRange[0].endDate).format("YYYY-MM-DD"),
          numberOfGuests: totalGuests,
          numberOfAdults: guestCounts.adults,
          numberOfChildren: guestCounts.children,
          numberOfInfants: guestCounts.infants,
        });
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // Reset price breakdown nếu điều kiện không hợp lệ
      setPriceBreakdown(null);
    }
  }, [
    homestay,
    dateRange[0].startDate,
    dateRange[0].endDate,
    guestCounts.adults,
    guestCounts.children,
    guestCounts.infants,
  ]);

  const openValidationDialog = (title: string, message: string) => {
    setValidationDialog({ open: true, title, message });
  };

  const closeValidationDialog = () => {
    setValidationDialog((prev) => ({ ...prev, open: false }));
  };

  // Cập nhật initialValues khi guestCounts thay đổi
  const initialValues = useMemo<CreateBooking>(
    () => ({
      homestayId: homestay?.id || 0,
      checkInDate: dateRange[0].startDate
        ? dayjs(dateRange[0].startDate).format("YYYY-MM-DD")
        : checkInFromUrl,
      checkOutDate: dateRange[0].endDate
        ? dayjs(dateRange[0].endDate).format("YYYY-MM-DD")
        : checkOutFromUrl,
      numberOfGuests:
        guestCounts.adults + guestCounts.children + guestCounts.infants,
      numberOfAdults: guestCounts.adults,
      numberOfChildren: guestCounts.children,
      numberOfInfants: guestCounts.infants,
      specialRequests: "",

      // THÊM: Auto-fill từ user info
      guestFullName: userInfo?.fullName || "",
      guestEmail: userInfo?.email || "",
      guestPhoneNumber: userInfo?.phoneNumber || "",
      guestAddress: userInfo?.address || "",
      guestCity: userInfo?.city || "",
      guestCountry: userInfo?.country || "",

      // THÊM: Thông tin đặt cho người khác
      isBookingForSomeoneElse: false,
      actualGuestFullName: "",
      actualGuestEmail: "",
      actualGuestPhoneNumber: "",
      actualGuestIdNumber: "",
      actualGuestNotes: "",
    }),
    [
      homestay?.id,
      dateRange[0].startDate,
      dateRange[0].endDate,
      checkInFromUrl,
      checkOutFromUrl,
      guestCounts.adults,
      guestCounts.children,
      guestCounts.infants,
      userInfo,
    ]
  );

  // Calculate number of nights
  const numberOfNights = Math.ceil(
    (dateRange[0].endDate.getTime() - dateRange[0].startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Format date info
  const getDateInfo = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) return null;

    const checkIn = dayjs(dateRange[0].startDate);
    const checkOut = dayjs(dateRange[0].endDate);

    return {
      checkInDay: checkIn.format("dddd"),
      checkInDate: checkIn.format("DD/MM/YYYY"),
      checkOutDay: checkOut.format("dddd"),
      checkOutDate: checkOut.format("DD/MM/YYYY"),
      nights: numberOfNights,
    };
  };

  const {
    data: availabilityData,
    isLoading: isCheckingAvailability,
    refetch: recheckAvailability,
  } = useCheckAvailabilityQuery(
    {
      homestayId: homestay?.id || 0,
      checkInDate: dayjs(dateRange[0].startDate).format("YYYY-MM-DD"),
      checkOutDate: dayjs(dateRange[0].endDate).format("YYYY-MM-DD"),
    },
    {
      skip:
        !homestay ||
        !dateRange[0].startDate ||
        !dateRange[0].endDate ||
        numberOfNights <= 0,
    }
  );

  const isAvailable = availabilityData?.data ?? false;

  const dateInfo = getDateInfo();

  const handleCalculatePrice = async (
    calculationData: BookingPriceCalculation
  ) => {
    if (!homestay) {
      console.log("No homestay data available");
      return;
    }

    try {
      const response = await calculatePrice(calculationData).unwrap();

      if (response.success && response.data) {
        setPriceBreakdown(response.data);
      } else {
        console.error("Price calculation failed:", response);
        setPriceBreakdown(null);
      }
    } catch (error) {
      console.error("Calculate price error:", error);
      toast.error("Không thể tính giá. Vui lòng thử lại.");
      setPriceBreakdown(null);
    }
  };

  const handleSubmit = async (values: CreateBooking) => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      console.error("Missing dates");
      toast.error("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }

    if (!isAvailable) {
      console.error("Not available");
      toast.error("Homestay không còn trống trong khoảng thời gian này");
      return;
    }

    if (!priceBreakdown) {
      console.error("Missing price breakdown");
      toast.error("Vui lòng đợi tính toán giá hoàn tất");
      return;
    }

    try {
      const bookingData = {
        ...values,
        checkInDate: dayjs(dateRange[0].startDate).format("YYYY-MM-DD"),
        checkOutDate: dayjs(dateRange[0].endDate).format("YYYY-MM-DD"),
      };

      const bookingResponse = await createBooking(bookingData).unwrap();

      if (bookingResponse.success && bookingResponse.data) {
        setCreatedBookingId(bookingResponse.data.id);
        setIsBookingConfirmed(true);
        toast.success("Đặt phòng thành công!");

        navigate(`/booking-confirmation/${bookingResponse.data.id}`);
      }
    } catch (error: any) {
      console.error("Create booking error:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Đặt phòng thất bại";
      toast.error(errorMessage);
    }
  };

  const handlePayment = async () => {
    navigate(`/payment/${createdBookingId}`);
  };

  useEffect(() => {
    if (
      homestay &&
      dateRange[0].startDate &&
      dateRange[0].endDate &&
      numberOfNights > 0
    ) {
      recheckAvailability();
    }
  }, [dateRange[0].startDate, dateRange[0].endDate]);

  // Check if booking is valid
  const isBookingValid = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) return false;
    if (numberOfNights <= 0) return false;
    if (
      numberOfNights < homestay!.minimumNights ||
      numberOfNights > homestay!.maximumNights
    )
      return false;
    if (!priceBreakdown) return false;
    if (!isAvailable) return false; // Thêm check availability
    return true;
  };

  const getValidationMessage = () => {
    if (!dateRange[0].startDate || !dateRange[0].endDate) {
      return "Vui lòng chọn ngày nhận và trả phòng";
    }
    if (numberOfNights <= 0) {
      return "Ngày trả phòng phải sau ngày nhận phòng";
    }
    if (numberOfNights < homestay!.minimumNights) {
      return `Số đêm tối thiểu: ${homestay!.minimumNights} đêm`;
    }
    if (numberOfNights > homestay!.maximumNights) {
      return `Số đêm tối đa: ${homestay!.maximumNights} đêm`;
    }
    if (isCheckingAvailability) {
      return "Đang kiểm tra tình trạng phòng...";
    }
    if (!isAvailable) {
      return "Homestay không còn trống trong khoảng thời gian này";
    }
    if (!priceBreakdown) {
      return "Đang tính toán chi phí...";
    }
    return "ℹVui lòng điền đầy đủ thông tin";
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", path: ROUTES.HOME, icon: <HomeIcon size={14} /> },
    {
      label: "Danh sách Homestay",
      path: "/homestay-list",
      icon: <Building2 size={14} />,
    },
    {
      label: homestay?.homestayTitle || "Homestay",
      path: `/homestay-list/${homestay?.slug}`,
    },
    {
      label: "Booking",
    },
  ];

  if (isLoadingHomestay) {
    return <BookingPageSkeleton />;
  }

  if (homestayError || !homestay) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy homestay</Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            py: 2,
          }}
        >
          <AppBreadcrumbs items={breadcrumbItems} />
        </Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            Đặt phòng homestay
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Hoàn tất thông tin để đặt phòng của bạn
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left: Homestay Info & Calendar */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Homestay Info Card */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative", height: 300 }}>
                <AppImage
                  src={homestay.mainImageUrl || ""}
                  alt={homestay.homestayTitle}
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
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="white"
                    mb={0.5}
                  >
                    {homestay.homestayTitle}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOn sx={{ fontSize: 16, color: "white" }} />
                    <Typography
                      variant="body2"
                      color="white"
                      sx={{ opacity: 0.9 }}
                    >
                      {homestay.fullAddress}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {/* Rating & Type */}
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip
                      icon={<Home />}
                      label={homestay.propertyTypeName}
                      color="primary"
                      variant="outlined"
                    />
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography variant="h6" color="warning.main">
                        ⭐ {homestay.ratingAverage.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({homestay.totalReviews} đánh giá)
                      </Typography>
                    </Box>
                    {homestay.isInstantBook && (
                      <Chip
                        label="Đặt ngay"
                        color="success"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Stack>

                  <Divider />

                  {/* Property Details */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <People sx={{ fontSize: 28, color: "primary.main" }} />
                        <Typography variant="body2" color="text.secondary">
                          Tối đa
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {homestay.maximumGuests} khách
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <MeetingRoom
                          sx={{ fontSize: 28, color: "primary.main" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Phòng ngủ
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {homestay.numberOfBedrooms}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Bed sx={{ fontSize: 28, color: "primary.main" }} />
                        <Typography variant="body2" color="text.secondary">
                          Giường
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {homestay.numberOfBeds}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Bathtub sx={{ fontSize: 28, color: "primary.main" }} />
                        <Typography variant="body2" color="text.secondary">
                          Phòng tắm
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {homestay.numberOfBathrooms}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider />

                  {/* Additional Info */}
                  <Grid container spacing={1}>
                    {homestay.areaInSquareMeters && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Square
                            sx={{
                              fontSize: 18,
                              color: "text.secondary",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2">
                            Diện tích: {homestay.areaInSquareMeters}m²
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime
                          sx={{
                            fontSize: 18,
                            color: "text.secondary",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">
                          Nhận phòng: {homestay.checkInTime.slice(0, 5)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTime
                          sx={{
                            fontSize: 18,
                            color: "text.secondary",
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2">
                          Trả phòng: {homestay.checkOutTime.slice(0, 5)}
                        </Typography>
                      </Box>
                    </Grid>
                    {homestay.isFreeCancellation && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Cancel
                            sx={{
                              fontSize: 18,
                              color: "success.main",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" color="success.main">
                            Hủy miễn phí ({homestay.freeCancellationDays} ngày)
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {homestay.isPrepaymentRequired && (
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Payment
                            sx={{
                              fontSize: 18,
                              color: "warning.main",
                              mr: 1,
                            }}
                          />
                          <Typography variant="body2" color="warning.main">
                            Yêu cầu thanh toán trước
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  {/* Amenities */}
                  {(homestay.hasParking ||
                    homestay.isPetFriendly ||
                    homestay.hasPrivatePool) && (
                    <>
                      <Divider />
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {homestay.hasParking && (
                          <Chip
                            icon={<DirectionsCar />}
                            label="Bãi đậu xe"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {homestay.isPetFriendly && (
                          <Chip
                            icon={<Pets />}
                            label="Cho phép thú cưng"
                            size="small"
                            variant="outlined"
                          />
                        )}
                        {homestay.hasPrivatePool && (
                          <Chip
                            icon={<Pool />}
                            label="Hồ bơi riêng"
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>

            <Box>
              <AvailabilitySection
                availabilityCalendars={homestay.availabilityCalendars}
              />
            </Box>

            {/* Booking Form or Confirmation */}
            {isBookingConfirmed ? (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 80,
                    color: "success.main",
                    mb: 2,
                  }}
                />
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Đặt phòng thành công!
                </Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                  Đơn đặt phòng của bạn đã được tạo. Vui lòng hoàn tất thanh
                  toán để xác nhận đặt phòng.
                </Typography>

                <Stack direction="row" spacing={2} justifyContent="center">
                  <AppButton
                    onClick={() => navigate("/user/profile/my-bookings")}
                    variant="outlined"
                    size="large"
                  >
                    Xem đơn đặt phòng
                  </AppButton>
                  <AppButton
                    onClick={handlePayment}
                    success
                    size="large"
                    isLoading={isCreatingPayment}
                    loadingText="Đang chuyển..."
                  >
                    Thanh toán ngay
                  </AppButton>
                </Stack>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: "4px",
                }}
              >
                <Formik
                  initialValues={initialValues}
                  validationSchema={createBookingValidationSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ values, isSubmitting, isValid, setFieldValue }) => {
                    // Auto calculate price when date or guests change
                    useEffect(() => {
                      const total =
                        values.numberOfAdults +
                        (values.numberOfChildren || 0) +
                        (values.numberOfInfants || 0);
                      if (total !== values.numberOfGuests) {
                        setFieldValue("numberOfGuests", total, false);
                      }
                    }, [
                      values.numberOfAdults,
                      values.numberOfChildren,
                      values.numberOfInfants,
                      setFieldValue,
                    ]);

                    useEffect(() => {
                      if (dateRange[0].startDate && dateRange[0].endDate) {
                        setFieldValue(
                          "checkInDate",
                          dayjs(dateRange[0].startDate).format("YYYY-MM-DD")
                        );
                        setFieldValue(
                          "checkOutDate",
                          dayjs(dateRange[0].endDate).format("YYYY-MM-DD")
                        );
                      }
                    }, [dateRange, setFieldValue]);

                    // Tính toán điều kiện disable button
                    const isFormInvalid =
                      !isValid ||
                      isSubmitting ||
                      !isBookingValid() ||
                      values.numberOfGuests > homestay.maximumGuests ||
                      values.numberOfGuests < 1 ||
                      isCheckingAvailability ||
                      isCalculating;

                    return (
                      <Form>
                        {/* Date Range Calendar */}
                        {!isBookingConfirmed && (
                          <Box
                            sx={{
                              mb: 3,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 3,
                              }}
                            >
                              <CalendarMonth
                                sx={{
                                  mr: 1,
                                  color: "primary.main",
                                  fontSize: 28,
                                }}
                              />
                              <Typography variant="h6" fontWeight={600}>
                                Chọn ngày nhận và trả phòng
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                "& .rdrCalendarWrapper": {
                                  width: "100%",
                                },
                                "& .rdrDateRangePickerWrapper": {
                                  width: "100%",
                                },
                                "& .rdrDefinedRangesWrapper": {
                                  display: "none",
                                },
                                "& .rdrMonthAndYearWrapper": {
                                  paddingTop: "10px",
                                },
                                "& .rdrMonth": {
                                  width: "100%",
                                },
                              }}
                            >
                              <DateRange
                                editableDateInputs={false}
                                onChange={(item: any) =>
                                  setDateRange([item.selection])
                                }
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                months={2}
                                direction="horizontal"
                                locale={vi}
                                minDate={new Date()}
                                rangeColors={["#1976d2"]}
                                showDateDisplay={false}
                              />
                            </Box>

                            {/* Date Info Display */}
                            {dateInfo && numberOfNights > 0 && (
                              <Box
                                sx={{
                                  mt: 3,
                                  p: 3,
                                  bgcolor: (theme) =>
                                    alpha(theme.palette.success.main, 0.08),
                                  borderRadius: "4px",
                                  border: (theme) =>
                                    `1px solid ${alpha(
                                      theme.palette.success.main,
                                      0.2
                                    )}`,
                                }}
                              >
                                <Stack spacing={2}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <EventAvailable
                                        sx={{ mr: 1, color: "success.main" }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          display="block"
                                        >
                                          Nhận phòng
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          fontWeight={600}
                                        >
                                          {dateInfo.checkInDay
                                            .charAt(0)
                                            .toUpperCase() +
                                            dateInfo.checkInDay.slice(1)}
                                          , {dateInfo.checkInDate}
                                        </Typography>
                                      </Box>
                                    </Box>

                                    <Divider orientation="vertical" flexItem />

                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <EventAvailable
                                        sx={{ mr: 1, color: "success.main" }}
                                      />
                                      <Box>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          display="block"
                                        >
                                          Trả phòng
                                        </Typography>
                                        <Typography
                                          variant="body1"
                                          fontWeight={600}
                                        >
                                          {dateInfo.checkOutDay
                                            .charAt(0)
                                            .toUpperCase() +
                                            dateInfo.checkOutDay.slice(1)}
                                          , {dateInfo.checkOutDate}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>

                                  <Divider />

                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <NightsStay
                                      sx={{ mr: 1, color: "primary.main" }}
                                    />
                                    <Typography variant="h6" fontWeight={600}>
                                      {dateInfo.nights} đêm
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Box>
                            )}

                            {/* Validation Alert */}
                            {numberOfNights <= 0 && (
                              <Alert
                                severity="error"
                                sx={{ mt: 2, borderRadius: "4px" }}
                              >
                                Ngày trả phòng phải sau ngày nhận phòng
                              </Alert>
                            )}

                            {/* Min/Max Nights Warning */}
                            {numberOfNights > 0 &&
                              (numberOfNights < homestay.minimumNights ||
                                numberOfNights > homestay.maximumNights) && (
                                <Alert
                                  severity="warning"
                                  sx={{ mt: 2, borderRadius: "4px" }}
                                >
                                  {numberOfNights < homestay.minimumNights
                                    ? `Số đêm tối thiểu: ${homestay.minimumNights} đêm`
                                    : `Số đêm tối đa: ${homestay.maximumNights} đêm`}
                                </Alert>
                              )}
                          </Box>
                        )}
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 3 }}
                        >
                          <People
                            sx={{ mr: 1, color: "primary.main", fontSize: 28 }}
                          />
                          <Typography variant="h6" fontWeight={600}>
                            Thông tin khách
                          </Typography>
                        </Box>
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormTextField
                              name="numberOfAdults"
                              label="Người lớn"
                              type="number"
                              required
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormTextField
                              name="numberOfChildren"
                              label="Trẻ em (2-12 tuổi)"
                              type="number"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <FormTextField
                              name="numberOfInfants"
                              label="Em bé (<2 tuổi)"
                              type="number"
                            />
                          </Grid>

                          <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 3 }} />
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 3,
                              }}
                            >
                              <People
                                sx={{
                                  mr: 1,
                                  color: "primary.main",
                                  fontSize: 28,
                                }}
                              />
                              <Typography variant="h6" fontWeight={600}>
                                Thông tin người đặt phòng
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                              name="guestFullName"
                              label="Họ và tên *"
                              placeholder="VD: Nguyễn Văn A"
                              required
                            />
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                              name="guestEmail"
                              label="Email *"
                              type="email"
                              placeholder="example@email.com"
                              required
                            />
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                              name="guestPhoneNumber"
                              label="Số điện thoại *"
                              placeholder="0901234567"
                              required
                            />
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                              name="guestCity"
                              label="Thành phố"
                              placeholder="VD: Hà Nội"
                            />
                          </Grid>

                          <Grid size={{ xs: 12 }}>
                            <FormTextField
                              name="guestAddress"
                              label="Địa chỉ"
                              placeholder="Số nhà, tên đường, quận/huyện"
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 3 }} />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values.isBookingForSomeoneElse}
                                  onChange={(e) => {
                                    setFieldValue(
                                      "isBookingForSomeoneElse",
                                      e.target.checked
                                    );

                                    // Clear actual guest info nếu uncheck
                                    if (!e.target.checked) {
                                      setFieldValue("actualGuestFullName", "");
                                      setFieldValue("actualGuestEmail", "");
                                      setFieldValue(
                                        "actualGuestPhoneNumber",
                                        ""
                                      );
                                      setFieldValue("actualGuestIdNumber", "");
                                      setFieldValue("actualGuestNotes", "");
                                    }
                                  }}
                                  sx={{
                                    color: "primary.main",
                                    "&.Mui-checked": {
                                      color: "primary.main",
                                    },
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body1" fontWeight={500}>
                                  Tôi đặt phòng cho người khác
                                </Typography>
                              }
                            />

                            {values.isBookingForSomeoneElse && (
                              <Alert severity="info" sx={{ mt: 2 }}>
                                Vui lòng nhập thông tin của người sẽ thực tế
                                check-in và ở tại homestay
                              </Alert>
                            )}
                          </Grid>

                          {/* ✅ THÊM: Form người ở thực tế (chỉ hiện khi checkbox được tick) */}
                          {values.isBookingForSomeoneElse && (
                            <>
                              <Grid size={{ xs: 12 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                    mt: 2,
                                  }}
                                >
                                  <People
                                    sx={{
                                      mr: 1,
                                      color: "secondary.main",
                                      fontSize: 28,
                                    }}
                                  />
                                  <Typography variant="h6" fontWeight={600}>
                                    Thông tin người ở thực tế
                                  </Typography>
                                </Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 2 }}
                                >
                                  Người này sẽ check-in và ở tại homestay
                                </Typography>
                              </Grid>

                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormTextField
                                  name="actualGuestFullName"
                                  label="Họ và tên người ở *"
                                  placeholder="VD: Trần Thị B"
                                  required
                                />
                              </Grid>

                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormTextField
                                  name="actualGuestPhoneNumber"
                                  label="Số điện thoại người ở *"
                                  placeholder="0907654321"
                                  required
                                />
                              </Grid>

                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormTextField
                                  name="actualGuestEmail"
                                  label="Email người ở"
                                  type="email"
                                  placeholder="example@email.com"
                                />
                              </Grid>

                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormTextField
                                  name="actualGuestIdNumber"
                                  label="Số CMND/CCCD"
                                  placeholder="001234567890"
                                />
                              </Grid>

                              <Grid size={{ xs: 12 }}>
                                <FormTextField
                                  name="actualGuestNotes"
                                  label="Ghi chú về người ở"
                                  placeholder="VD: Đây là bạn tôi, sẽ đến check-in vào 14h..."
                                  multiline
                                  rows={3}
                                />
                              </Grid>
                            </>
                          )}
                          {values.numberOfGuests > homestay.maximumGuests && (
                            <Grid size={{ xs: 12 }}>
                              <Alert
                                severity="warning"
                                sx={{ borderRadius: "4px" }}
                              >
                                Số khách ({values.numberOfGuests}) vượt quá giới
                                hạn tối đa ({homestay.maximumGuests}) của
                                homestay
                              </Alert>
                            </Grid>
                          )}

                          {values.numberOfGuests < 1 && (
                            <Grid size={{ xs: 12 }}>
                              <Alert
                                severity="error"
                                sx={{ borderRadius: "4px" }}
                              >
                                Phải có ít nhất 1 người lớn
                              </Alert>
                            </Grid>
                          )}

                          {/* Availability Alert */}
                          {!isCheckingAvailability &&
                            dateRange[0].startDate &&
                            dateRange[0].endDate &&
                            numberOfNights > 0 &&
                            !isAvailable && (
                              <Grid size={{ xs: 12 }}>
                                <Alert
                                  severity="error"
                                  sx={{ borderRadius: "4px" }}
                                >
                                  ❌ Homestay không còn trống trong khoảng thời
                                  gian từ{" "}
                                  {dayjs(dateRange[0].startDate).format(
                                    "DD/MM/YYYY"
                                  )}{" "}
                                  đến{" "}
                                  {dayjs(dateRange[0].endDate).format(
                                    "DD/MM/YYYY"
                                  )}
                                  . Vui lòng chọn ngày khác.
                                </Alert>
                              </Grid>
                            )}

                          <Grid size={{ xs: 12 }}>
                            <FormTextField
                              name="specialRequests"
                              label="Yêu cầu đặc biệt (không bắt buộc)"
                              placeholder="Ví dụ: Tầng cao, giường đôi, không hút thuốc..."
                              multiline
                              rows={4}
                            />
                          </Grid>

                          <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }} />
                            <Stack
                              direction="row"
                              spacing={2}
                              justifyContent="space-between"
                            >
                              <AppButton
                                onClick={() => navigate(-1)}
                                variant="outlined"
                                size="large"
                                disabled={isSubmitting}
                              >
                                Quay lại
                              </AppButton>
                              <AppButton
                                type="submit"
                                success
                                size="large"
                                isLoading={isCreatingBooking || isSubmitting}
                                loadingText="Đang xử lý..."
                                disabled={isFormInvalid}
                              >
                                Xác nhận đặt phòng
                              </AppButton>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Form>
                    );
                  }}
                </Formik>
              </Paper>
            )}
          </Grid>

          {/* Right: Price Summary & Booking Status */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box sx={{ position: "sticky", top: 20 }}>
              {/* Booking Status */}
              {isCheckingAvailability ? (
                <Alert
                  severity="info"
                  icon={<CircularProgress size={20} />}
                  sx={{
                    mb: 3,
                    borderRadius: "4px",
                  }}
                >
                  <Typography variant="body2">
                    🔄 Đang kiểm tra tình trạng phòng...
                  </Typography>
                </Alert>
              ) : !isAvailable &&
                dateRange[0].startDate &&
                dateRange[0].endDate &&
                numberOfNights > 0 ? (
                <Alert
                  severity="error"
                  icon={<Cancel />}
                  sx={{
                    mb: 3,
                    borderRadius: "4px",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                    ❌ Không còn phòng trống
                  </Typography>
                  <Typography variant="body2">
                    Homestay đã được đặt trong khoảng thời gian này. Vui lòng
                    chọn ngày khác.
                  </Typography>
                </Alert>
              ) : isBookingValid() ? (
                <Alert
                  severity="success"
                  icon={<CheckCircle />}
                  sx={{
                    mb: 3,
                    borderRadius: "4px",
                    "& .MuiAlert-message": { width: "100%" },
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                    Thông tin đặt phòng hợp lệ
                  </Typography>
                  <Typography variant="body2">
                    Tất cả thông tin đã được điền đầy đủ. Bạn có thể tiếp tục
                    đặt phòng.
                  </Typography>
                </Alert>
              ) : (
                <Alert
                  severity="info"
                  icon={<Info />}
                  sx={{
                    mb: 3,
                    borderRadius: "4px",
                  }}
                >
                  <Typography variant="body2">
                    {getValidationMessage()}
                  </Typography>
                </Alert>
              )}

              {/* Price Breakdown */}
              {priceBreakdown && numberOfNights > 0 && (
                <Card
                  elevation={0}
                  sx={{
                    border: (theme) =>
                      `2px solid ${theme.palette.primary.main}`,
                    borderRadius: "4px",
                    mb: 3,
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
                      💳 Chi tiết thanh toán
                    </Typography>
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      {/* Base Amount */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Giá cơ bản
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {homestay.baseNightlyPrice.toLocaleString()} VNĐ x{" "}
                            {numberOfNights} đêm
                          </Typography>
                        </Box>
                        <Typography variant="body1" fontWeight={600}>
                          {priceBreakdown.baseAmount.toLocaleString()} VNĐ
                        </Typography>
                      </Box>

                      {/* Cleaning Fee */}
                      {priceBreakdown.cleaningFee > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            🧹 Phí vệ sinh
                          </Typography>
                          <Typography variant="body2">
                            {priceBreakdown.cleaningFee.toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                      )}

                      {/* Service Fee */}
                      {priceBreakdown.serviceFee > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            🛎️ Phí dịch vụ
                          </Typography>
                          <Typography variant="body2">
                            {priceBreakdown.serviceFee.toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                      )}

                      {/* Tax */}
                      {priceBreakdown.taxAmount > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            📋 Thuế VAT
                          </Typography>
                          <Typography variant="body2">
                            {priceBreakdown.taxAmount.toLocaleString()} VNĐ
                          </Typography>
                        </Box>
                      )}

                      {/* Discount */}
                      {priceBreakdown.discountAmount > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
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
                            🎉 Giảm giá
                          </Typography>
                          <Typography
                            variant="body2"
                            color="success.main"
                            fontWeight={600}
                          >
                            -{priceBreakdown.discountAmount.toLocaleString()}{" "}
                            VNĐ
                          </Typography>
                        </Box>
                      )}

                      <Divider />

                      {/* Total */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, 0.08),
                          borderRadius: "4px",
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          Tổng cộng
                        </Typography>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          color="primary"
                        >
                          {priceBreakdown.totalAmount.toLocaleString()} VNĐ
                        </Typography>
                      </Box>

                      {/* Price per night info */}
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 1.5,
                          bgcolor: (theme) =>
                            alpha(theme.palette.info.main, 0.08),
                          borderRadius: "4px",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Trung bình
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ~{" "}
                          {Math.round(
                            priceBreakdown.totalAmount / numberOfNights
                          ).toLocaleString()}{" "}
                          VNĐ / đêm
                        </Typography>
                      </Box>

                      {/* Info Note */}
                      <Alert
                        severity="info"
                        icon={<Info />}
                        sx={{ borderRadius: "4px" }}
                      >
                        <Typography variant="caption">
                          💡 Bạn sẽ không bị tính phí ngay bây giờ. Thanh toán
                          sau khi xác nhận đặt phòng.
                        </Typography>
                      </Alert>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {isCalculating && (
                <Card
                  elevation={0}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                    p: 3,
                    textAlign: "center",
                    mb: 3,
                  }}
                >
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Đang tính toán chi phí...
                  </Typography>
                </Card>
              )}

              {/* Booking Policies */}
              <Card
                elevation={0}
                sx={{
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                    p: 2.5,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    📜 Chính sách đặt phòng
                  </Typography>
                </Box>

                <CardContent sx={{ p: 2 }}>
                  <List dense>
                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <NightsStay
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>Số đêm:</strong> Tối thiểu{" "}
                            {homestay.minimumNights} đêm, tối đa{" "}
                            {homestay.maximumNights} đêm
                          </Typography>
                        }
                      />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <AccessTime
                          sx={{ fontSize: 20, color: "primary.main" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>Giờ nhận phòng:</strong>{" "}
                            {homestay.checkInTime.slice(0, 5)} |{" "}
                            <strong>Trả phòng:</strong>{" "}
                            {homestay.checkOutTime.slice(0, 5)}
                          </Typography>
                        }
                      />
                    </ListItem>

                    {homestay.isFreeCancellation && (
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Cancel
                            sx={{ fontSize: 20, color: "success.main" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="success.main">
                              <strong>Hủy miễn phí</strong> trong{" "}
                              {homestay.freeCancellationDays} ngày trước khi
                              nhận phòng
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}

                    {homestay.isPrepaymentRequired && (
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Payment
                            sx={{ fontSize: 20, color: "warning.main" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="warning.main">
                              <strong>Yêu cầu thanh toán trước</strong> khi đặt
                              phòng
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}

                    {homestay.isInstantBook && (
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle
                            sx={{ fontSize: 20, color: "success.main" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="success.main">
                              <strong>Đặt ngay</strong> không cần chờ xác nhận
                              từ chủ nhà
                            </Typography>
                          }
                        />
                      </ListItem>
                    )}

                    <ListItem>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <People sx={{ fontSize: 20, color: "primary.main" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <strong>Số khách:</strong> Tối đa{" "}
                            {homestay.maximumGuests} khách (
                            {homestay.maximumChildren} trẻ em)
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              {/* Host Info */}
              <Card
                elevation={0}
                sx={{
                  mt: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRadius: "4px",
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="subtitle2" fontWeight={600} mb={2}>
                    👤 Thông tin chủ nhà
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {homestay.ownerAvatar ? (
                      <Box
                        component="img"
                        src={homestay.ownerAvatar}
                        alt={homestay.ownerName}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        {homestay.ownerName.charAt(0).toUpperCase()}
                      </Box>
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {homestay.ownerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        📧 {homestay.ownerEmail}
                      </Typography>
                      {homestay.ownerPhone && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          📞 {homestay.ownerPhone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Additional Stats */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                  borderRadius: "4px",
                  border: (theme) =>
                    `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                }}
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {homestay.viewCount.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Lượt xem
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {homestay.bookingCount.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Lượt đặt
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Validation Dialog */}
        <Dialog
          open={validationDialog.open}
          onClose={closeValidationDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600, color: "error.main" }}>
            {validationDialog.title}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.primary">
              {validationDialog.message}
            </Typography>
          </DialogContent>
          <DialogActions>
            <AppButton onClick={closeValidationDialog} variant="outlined">
              Đóng
            </AppButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CreateBookingPage;
