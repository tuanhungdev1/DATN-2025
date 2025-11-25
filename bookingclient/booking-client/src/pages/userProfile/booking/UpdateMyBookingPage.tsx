/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, type FormikHelpers } from "formik";
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  alpha,
  Grid,
  Chip,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Calendar,
  Users,
  Save,
  Bed,
  Home,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Clock,
  MapPin,
  DollarSign,
  XCircle,
  Check,
} from "lucide-react";
import { DateRange, type Range } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useDebouncedCallback } from "use-debounce";

import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { updateBookingValidationSchema } from "@/validators/bookingValidation";
import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
  useCalculatePriceMutation,
  useCheckAvailabilityQuery,
  useLazyCheckAvailabilityQuery,
} from "@/services/endpoints/booking.api";
import { useToast } from "@/hooks/useToast";
import type {
  UpdateBooking,
  BookingPriceBreakdown,
  BookingPriceCalculation,
} from "@/types/booking.types";
import { BookingStatus } from "@/enums/bookingStatus";
import { AppImage } from "@/components/images";
import { PaymentStatus } from "@/enums/payment.enums";
import type { AvailabilityCalendar } from "@/types/homestay.types";
import { People } from "@mui/icons-material";

dayjs.locale("vi");

const AvailabilitySection = ({
  availabilityCalendars,
}: {
  availabilityCalendars: AvailabilityCalendar[];
}) => {
  const [showAll, setShowAll] = useState(false);

  const availableDates = availabilityCalendars.filter(
    (cal) => cal.isAvailable && !cal.isBlocked
  );

  const displayCalendars = showAll
    ? availableDates
    : availableDates.slice(0, 12);

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
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Calendar size={18} />
                <Typography variant="subtitle2" fontWeight={600}>
                  {new Date(calendar.availableDate).toLocaleDateString(
                    "vi-VN",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Stack spacing={1}>
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
    </Paper>
  );
};

interface FormValues extends UpdateBooking {
  dateRange: Range;
  isAvailable?: boolean;

  guestFullName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  guestAddress?: string;
  guestCity?: string;
  guestCountry?: string;

  isBookingForSomeoneElse: boolean;
  actualGuestFullName?: string;
  actualGuestEmail?: string;
  actualGuestPhoneNumber?: string;
  actualGuestIdNumber?: string;
  actualGuestNotes?: string;
}

const UpdateBookingPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const theme = useTheme();

  const [priceBreakdown, setPriceBreakdown] =
    useState<BookingPriceBreakdown | null>(null);

  // Fetch booking
  const {
    data: bookingData,
    isLoading: isLoadingBooking,
    error: bookingError,
  } = useGetBookingByIdQuery(Number(bookingId), {
    skip: !bookingId,
  });

  const booking = bookingData?.data;

  // Mutations
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [calculatePrice, { isLoading: isCalculating }] =
    useCalculatePriceMutation();
  const [checkAvailability] = useLazyCheckAvailabilityQuery();
  // Original dates
  const originalCheckIn = useMemo(
    () => (booking ? dayjs(booking.checkInDate).format("YYYY-MM-DD") : ""),
    [booking]
  );
  const originalCheckOut = useMemo(
    () => (booking ? dayjs(booking.checkOutDate).format("YYYY-MM-DD") : ""),
    [booking]
  );

  // Initial form values
  const initialValues: FormValues = useMemo(
    () => ({
      dateRange: {
        startDate: booking ? new Date(booking.checkInDate) : new Date(),
        endDate: booking ? new Date(booking.checkOutDate) : new Date(),
        key: "selection",
      },
      numberOfGuests: booking?.numberOfGuests || 0,
      numberOfAdults: booking?.numberOfAdults || 0,
      numberOfChildren: booking?.numberOfChildren || 0,
      numberOfInfants: booking?.numberOfInfants || 0,
      specialRequests: booking?.specialRequests || "",

      guestFullName: booking?.guestFullName || "",
      guestEmail: booking?.guestEmail || "",
      guestPhoneNumber: booking?.guestPhoneNumber || "",
      guestAddress: booking?.guestAddress || "",
      guestCity: booking?.guestCity || "",
      guestCountry: booking?.guestCountry || "",

      isBookingForSomeoneElse: booking?.isBookingForSomeoneElse || false,
      actualGuestFullName: booking?.actualGuestFullName || "",
      actualGuestEmail: booking?.actualGuestEmail || "",
      actualGuestPhoneNumber: booking?.actualGuestPhoneNumber || "",
      actualGuestIdNumber: booking?.actualGuestIdNumber || "",
      actualGuestNotes: booking?.actualGuestNotes || "",
    }),
    [booking]
  );

  // Debounced price calculation
  const debouncedCalculatePrice = useDebouncedCallback(
    async (
      calculationData: BookingPriceCalculation,
      setFieldValue: FormikHelpers<FormValues>["setFieldValue"]
    ) => {
      if (!booking) return;

      try {
        const response = await calculatePrice(calculationData).unwrap();
        if (response.success && response.data) {
          setPriceBreakdown(response.data);
        } else {
          setPriceBreakdown(null);
        }
      } catch (error) {
        console.error("Calculate price error:", error);
        toast.error("Không thể tính giá. Vui lòng thử lại.");
        setPriceBreakdown(null);
      }
    },
    600
  );

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    if (!booking || !values.dateRange.startDate || !values.dateRange.endDate) {
      toast.error("Vui lòng chọn ngày hợp lệ.");
      setSubmitting(false);
      return;
    }

    const currentCheckIn = dayjs(values.dateRange.startDate).format(
      "YYYY-MM-DD"
    );
    const currentCheckOut = dayjs(values.dateRange.endDate).format(
      "YYYY-MM-DD"
    );
    const numberOfNights = dayjs(currentCheckOut).diff(currentCheckIn, "day");

    if (numberOfNights <= 0) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng.");
      setSubmitting(false);
      return;
    }

    const shouldCheckAvailability =
      currentCheckIn !== originalCheckIn ||
      currentCheckOut !== originalCheckOut;

    if (shouldCheckAvailability) {
      if (!values.isAvailable) {
        toast.error("Homestay không còn trống trong khoảng thời gian này.");
        setSubmitting(false);
        return;
      }

      // Double-check bằng API call
      try {
        const availabilityCheck = await checkAvailability({
          homestayId: booking.homestay.id,
          checkInDate: currentCheckIn,
          checkOutDate: currentCheckOut,
          excludeBookingId: Number(bookingId),
        }).unwrap();

        if (!availabilityCheck.data) {
          toast.error("Homestay không còn trống. Vui lòng chọn ngày khác.");
          setSubmitting(false);
          return;
        }
      } catch (error) {
        toast.error("Không thể kiểm tra tình trạng phòng. Vui lòng thử lại.");
        setSubmitting(false);
        return;
      }
    }

    if (shouldCheckAvailability && !values.isAvailable) {
      toast.error("Homestay không còn trống trong khoảng thời gian này.");
      setSubmitting(false);
      return;
    }

    try {
      const updateData: UpdateBooking = {
        checkInDate: currentCheckIn,
        checkOutDate: currentCheckOut,
        numberOfGuests: values.numberOfGuests,
        numberOfAdults: values.numberOfAdults,
        numberOfChildren: values.numberOfChildren || 0,
        numberOfInfants: values.numberOfInfants || 0,
        specialRequests: values.specialRequests || "",

        isBookingForSomeoneElse: values.isBookingForSomeoneElse,
        actualGuestFullName: values.actualGuestFullName || undefined,
        actualGuestEmail: values.actualGuestEmail || undefined,
        actualGuestPhoneNumber: values.actualGuestPhoneNumber || undefined,
        actualGuestIdNumber: values.actualGuestIdNumber || undefined,
        actualGuestNotes: values.actualGuestNotes || undefined,
      };

      const response = await updateBooking({
        id: Number(bookingId),
        data: updateData,
      }).unwrap();

      if (response.success) {
        toast.success("Cập nhật đặt phòng thành công!");
        navigate(`/user/profile/my-bookings/${bookingId}`);
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const canEdit =
    booking?.bookingStatus === BookingStatus.Pending ||
    booking?.bookingStatus === BookingStatus.Confirmed;

  // Style chung cho Card
  const cardSx = {
    borderRadius: "4px",
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden",
    mb: 3,
  };

  // Loading & Error
  if (isLoadingBooking) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (bookingError || !booking) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" icon={<AlertCircle size={20} />}>
          Không tìm thấy thông tin đặt phòng
        </Alert>
      </Container>
    );
  }

  if (!canEdit) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">
          Chỉ có thể cập nhật đặt phòng ở trạng thái Chờ xác nhận hoặc Đã xác
          nhận
        </Alert>
        <AppButton
          onClick={() => navigate(`/user/profile/my-bookings/${bookingId}`)}
          sx={{ mt: 2 }}
          startIcon={<ArrowLeft size={20} />}
        >
          Quay lại chi tiết
        </AppButton>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
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

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            Cập nhật đặt phòng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Mã đặt phòng: <strong>{booking.bookingCode}</strong>
          </Typography>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={updateBookingValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            setFieldValue,
            isValid,
            isSubmitting,
            setFieldError,
          }) => {
            const currentCheckIn = values.dateRange.startDate
              ? dayjs(values.dateRange.startDate).format("YYYY-MM-DD")
              : "";
            const currentCheckOut = values.dateRange.endDate
              ? dayjs(values.dateRange.endDate).format("YYYY-MM-DD")
              : "";
            const numberOfNights =
              currentCheckIn && currentCheckOut
                ? dayjs(currentCheckOut).diff(currentCheckIn, "day")
                : 0;
            const isValidDateRange = numberOfNights > 0;

            const shouldCheckAvailability =
              currentCheckIn !== originalCheckIn ||
              currentCheckOut !== originalCheckOut;

            const {
              data: availabilityData,
              isLoading: isCheckingAvailability,
            } = useCheckAvailabilityQuery(
              {
                homestayId: booking.homestay.id,
                checkInDate: currentCheckIn,
                checkOutDate: currentCheckOut,
                excludeBookingId: Number(bookingId),
              },
              {
                skip: !shouldCheckAvailability || !isValidDateRange,
              }
            );

            const isAvailable = shouldCheckAvailability
              ? availabilityData?.data === true
              : true;

            // Update availability status in form
            useEffect(() => {
              setFieldValue("isAvailable", isAvailable, false);
            }, [isAvailable, setFieldValue]);

            // Recalculate price
            useEffect(() => {
              if (booking && isValidDateRange) {
                debouncedCalculatePrice(
                  {
                    homestayId: booking.homestay.id,
                    checkInDate: currentCheckIn,
                    checkOutDate: currentCheckOut,
                    numberOfGuests: values.numberOfGuests || 0,
                    numberOfAdults: values.numberOfAdults || 0,
                    numberOfChildren: values.numberOfChildren || 0,
                    numberOfInfants: values.numberOfInfants || 0,
                  },
                  setFieldValue
                );
              }
            }, [
              currentCheckIn,
              currentCheckOut,
              values.numberOfAdults,
              values.numberOfChildren,
              values.numberOfInfants,
              booking,
              isValidDateRange,
            ]);

            // Auto update total guests
            useEffect(() => {
              const total =
                (values.numberOfAdults || 0) +
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

            const isFormInvalid =
              !isValid ||
              isSubmitting ||
              !isValidDateRange ||
              isCheckingAvailability ||
              isCalculating ||
              (shouldCheckAvailability && !isAvailable);

            return (
              <Form>
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
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
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Clock
                              size={18}
                              color={theme.palette.action.active}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Clock
                              size={18}
                              color={theme.palette.action.active}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
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

                {/* Date Selection */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      gap: 1,
                    }}
                  >
                    <Calendar size={28} style={{ color: "#1976d2" }} />
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
                      onChange={(item: any) => {
                        setFieldValue("dateRange", item.selection, true);
                      }}
                      moveRangeOnFirstSelection={false}
                      ranges={[values.dateRange]}
                      months={2}
                      direction="horizontal"
                      locale={vi}
                      minDate={new Date()}
                      rangeColors={["#1976d2"]}
                      showDateDisplay={false}
                    />
                  </Box>

                  {isValidDateRange && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 3,
                        bgcolor: (theme) =>
                          alpha(theme.palette.success.main, 0.08),
                        borderRadius: "4px",
                        border: (theme) =>
                          `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      }}
                    >
                      <Stack spacing={2}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircle
                              size={20}
                              style={{ color: "#4caf50" }}
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
                                sx={{
                                  textTransform: "capitalize",
                                }}
                              >
                                {dayjs(values.dateRange.startDate).format(
                                  "dddd, DD/MM/YYYY"
                                )}
                              </Typography>
                            </Box>
                          </Box>
                          <Divider orientation="vertical" flexItem />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircle
                              size={20}
                              style={{ color: "#4caf50" }}
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
                                sx={{
                                  textTransform: "capitalize",
                                }}
                              >
                                {dayjs(values.dateRange.endDate).format(
                                  "dddd, DD/MM/YYYY"
                                )}
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
                            gap: 1,
                          }}
                        >
                          <Bed size={24} style={{ color: "#1976d2" }} />
                          <Typography variant="h6" fontWeight={600}>
                            {numberOfNights} đêm
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}

                  {!isValidDateRange && values.dateRange.startDate && (
                    <Alert
                      severity="error"
                      sx={{ mt: 2, borderRadius: "4px" }}
                      icon={<AlertCircle size={18} />}
                    >
                      Ngày trả phòng phải sau ngày nhận phòng
                    </Alert>
                  )}
                </Paper>

                {/* Guest Info */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      gap: 1,
                    }}
                  >
                    <Users size={28} style={{ color: "#1976d2" }} />
                    <Typography variant="h6" fontWeight={600}>
                      Thông tin khách
                    </Typography>
                  </Box>

                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      <Box sx={{ flex: "1 1 150px", minWidth: 120 }}>
                        <FormTextField
                          name="numberOfAdults"
                          label="Người lớn"
                          type="number"
                          required
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 150px", minWidth: 120 }}>
                        <FormTextField
                          name="numberOfChildren"
                          label="Trẻ em (2-12 tuổi)"
                          type="number"
                        />
                      </Box>
                      <Box sx={{ flex: "1 1 150px", minWidth: 120 }}>
                        <FormTextField
                          name="numberOfInfants"
                          label="Em bé (<2 tuổi)"
                          type="number"
                        />
                      </Box>
                    </Box>

                    <FormTextField
                      name="specialRequests"
                      label="Yêu cầu đặc biệt (không bắt buộc)"
                      placeholder="Ví dụ: Tầng cao, giường đôi, không hút thuốc..."
                      multiline
                      rows={4}
                    />
                  </Stack>
                </Paper>

                {/* ✅ THÊM: Thông tin người đặt phòng */}
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

                  <Alert severity="info" sx={{ mb: 2 }}>
                    ℹ️ Chỉ Admin mới có thể chỉnh sửa thông tin người đặt. Guest
                    có thể chỉnh sửa thông tin người ở thực tế.
                  </Alert>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField
                    name="guestFullName"
                    label="Họ và tên *"
                    placeholder="VD: Nguyễn Văn A"
                    required
                    disabled // Chỉ Admin mới edit được
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField
                    name="guestEmail"
                    label="Email *"
                    type="email"
                    placeholder="example@email.com"
                    required
                    disabled
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField
                    name="guestPhoneNumber"
                    label="Số điện thoại *"
                    placeholder="0901234567"
                    required
                    disabled
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormTextField
                    name="guestCity"
                    label="Thành phố"
                    placeholder="VD: Hà Nội"
                    disabled
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormTextField
                    name="guestAddress"
                    label="Địa chỉ"
                    placeholder="Số nhà, tên đường, quận/huyện"
                    disabled
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

                          if (!e.target.checked) {
                            setFieldValue("actualGuestFullName", "");
                            setFieldValue("actualGuestEmail", "");
                            setFieldValue("actualGuestPhoneNumber", "");
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
                      Vui lòng nhập thông tin của người sẽ thực tế check-in và ở
                      tại homestay
                    </Alert>
                  )}
                </Grid>

                {/* ✅ THÊM: Form người ở thực tế */}
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

                {/* Availability Status */}
                {shouldCheckAvailability && (
                  <>
                    {isCheckingAvailability ? (
                      <Alert
                        severity="info"
                        sx={{ mb: 3, borderRadius: "4px" }}
                        icon={<Loader2 size={18} className="animate-spin" />}
                      >
                        Đang kiểm tra tình trạng phòng...
                      </Alert>
                    ) : !isAvailable ? (
                      <Alert
                        severity="error"
                        sx={{ mb: 3, borderRadius: "4px" }}
                        icon={<AlertCircle size={18} />}
                      >
                        Homestay không còn trống trong khoảng thời gian này. Vui
                        lòng chọn ngày khác.
                      </Alert>
                    ) : (
                      <Alert
                        severity="success"
                        sx={{ mb: 3, borderRadius: "4px" }}
                        icon={<CheckCircle size={18} />}
                      >
                        Homestay còn trống trong khoảng thời gian này.
                      </Alert>
                    )}
                  </>
                )}

                {/* Price Breakdown */}
                {priceBreakdown && isValidDateRange && (
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
                        Chi tiết thanh toán mới
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2.5}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Giá cơ bản ({numberOfNights} đêm)
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight={600}>
                            {priceBreakdown.baseAmount.toLocaleString()} VNĐ
                          </Typography>
                        </Box>

                        {priceBreakdown.cleaningFee > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Phí vệ sinh
                            </Typography>
                            <Typography variant="body2">
                              {priceBreakdown.cleaningFee.toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                        )}

                        {priceBreakdown.serviceFee > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Phí dịch vụ
                            </Typography>
                            <Typography variant="body2">
                              {priceBreakdown.serviceFee.toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                        )}

                        {priceBreakdown.taxAmount > 0 && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Thuế VAT
                            </Typography>
                            <Typography variant="body2">
                              {priceBreakdown.taxAmount.toLocaleString()} VNĐ
                            </Typography>
                          </Box>
                        )}

                        {priceBreakdown.discountAmount > 0 && (
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
                              -{priceBreakdown.discountAmount.toLocaleString()}{" "}
                              VNĐ
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
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            color="primary"
                          >
                            {priceBreakdown.totalAmount.toLocaleString()} VNĐ
                          </Typography>
                        </Box>

                        {booking.totalAmount !== priceBreakdown.totalAmount && (
                          <Alert severity="info" sx={{ borderRadius: "4px" }}>
                            <Typography variant="caption">
                              Giá cũ: {booking.totalAmount.toLocaleString()} VNĐ
                              <br />
                              Chênh lệch:{" "}
                              {(
                                priceBreakdown.totalAmount - booking.totalAmount
                              ).toLocaleString()}{" "}
                              VNĐ
                            </Typography>
                          </Alert>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Status & Coupon Info - ✅ THÊM SECTION NÀY */}
                {booking.payments && booking.payments.length > 0 && (
                  <Card elevation={0} sx={cardSx}>
                    <Box sx={{ bgcolor: "info.main", color: "white", p: 2.5 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Tình trạng thanh toán
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2.5}>
                        {/* Thông tin thanh toán cũ */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Tổng tiền cũ
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {booking.totalAmount.toLocaleString()} VNĐ
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Đã thanh toán
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight={600}
                            color="success.main"
                          >
                            {booking.payments
                              .filter(
                                (p) =>
                                  p.paymentStatus === PaymentStatus.Completed
                              )
                              .reduce((sum, p) => sum + p.paymentAmount, 0)
                              .toLocaleString()}{" "}
                            VNĐ
                          </Typography>
                        </Box>

                        {/* Hiển thị coupon đã áp dụng */}
                        {booking.appliedCoupons &&
                          booking.appliedCoupons.length > 0 && (
                            <>
                              <Divider />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                  mb={1}
                                >
                                  Mã giảm giá đã áp dụng
                                </Typography>
                                <Stack spacing={1}>
                                  {booking.appliedCoupons.map((coupon) => (
                                    <Box
                                      key={coupon.id}
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        p: 1.5,
                                        bgcolor: alpha(
                                          theme.palette.success.main,
                                          0.08
                                        ),
                                        borderRadius: "4px",
                                        border: `1px solid ${alpha(
                                          theme.palette.success.main,
                                          0.2
                                        )}`,
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Chip
                                          label={coupon.couponCode}
                                          size="small"
                                          color="success"
                                          variant="outlined"
                                        />
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {dayjs(coupon.usedAt).format(
                                            "DD/MM/YYYY HH:mm"
                                          )}
                                        </Typography>
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="success.main"
                                      >
                                        -
                                        {coupon.discountAmount.toLocaleString()}{" "}
                                        VNĐ
                                      </Typography>
                                    </Box>
                                  ))}
                                </Stack>
                              </Box>
                            </>
                          )}

                        {/* So sánh giá mới với giá cũ */}
                        {priceBreakdown && (
                          <>
                            <Divider />
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Tổng tiền mới (sau cập nhật)
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={700}
                                color="primary.main"
                              >
                                {priceBreakdown.totalAmount.toLocaleString()}{" "}
                                VNĐ
                              </Typography>
                            </Box>

                            {(() => {
                              const totalPaid = booking.payments
                                .filter(
                                  (p) =>
                                    p.paymentStatus === PaymentStatus.Completed
                                )
                                .reduce((sum, p) => sum + p.paymentAmount, 0);

                              const newTotal = priceBreakdown.totalAmount;
                              const difference = newTotal - totalPaid;

                              if (difference > 0) {
                                return (
                                  <Alert
                                    severity="warning"
                                    icon={<AlertCircle size={18} />}
                                    sx={{ borderRadius: "4px" }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                    >
                                      Bạn cần thanh toán thêm:{" "}
                                      <Box
                                        component="span"
                                        sx={{
                                          fontSize: "1.1rem",
                                          color: "warning.dark",
                                        }}
                                      >
                                        {difference.toLocaleString()} VNĐ
                                      </Box>
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      sx={{ mt: 0.5 }}
                                    >
                                      Đơn sẽ chuyển về trạng thái "Chờ thanh
                                      toán" sau khi cập nhật.
                                      <br />
                                      {booking.appliedCoupons &&
                                        booking.appliedCoupons.length > 0 && (
                                          <>
                                            Mã giảm giá đã được tính lại theo
                                            giá mới.
                                          </>
                                        )}
                                    </Typography>
                                  </Alert>
                                );
                              } else if (difference < 0) {
                                return (
                                  <Alert
                                    severity="info"
                                    icon={<CheckCircle size={18} />}
                                    sx={{ borderRadius: "4px" }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight={600}
                                    >
                                      Bạn đã thanh toán thừa:{" "}
                                      <Box
                                        component="span"
                                        sx={{ fontSize: "1.1rem" }}
                                      >
                                        {Math.abs(difference).toLocaleString()}{" "}
                                        VNĐ
                                      </Box>
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      display="block"
                                      sx={{ mt: 0.5 }}
                                    >
                                      Số tiền này sẽ được hoàn lại sau khi cập
                                      nhật.
                                    </Typography>
                                  </Alert>
                                );
                              } else {
                                return (
                                  <Alert
                                    severity="success"
                                    icon={<CheckCircle size={18} />}
                                  >
                                    <Typography variant="body2">
                                      Số tiền thanh toán không đổi
                                    </Typography>
                                  </Alert>
                                );
                              }
                            })()}
                          </>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                {isCalculating && (
                  <Card
                    sx={{
                      p: 3,
                      textAlign: "center",
                      mb: 3,
                      borderRadius: "4px",
                    }}
                  >
                    <Loader2
                      size={40}
                      className="animate-spin"
                      style={{ marginBottom: 16, color: "#1976d2" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Đang tính toán chi phí...
                    </Typography>
                  </Card>
                )}

                {/* Original Info */}
                <Card
                  elevation={0}
                  sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: "4px",
                    mb: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                      Thông tin đặt phòng gốc
                    </Typography>
                    <Stack spacing={1.5}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Ngày nhận - trả phòng
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {dayjs(booking.checkInDate).format("DD/MM/YYYY")} -{" "}
                          {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Số đêm
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {booking.numberOfNights} đêm
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Số khách
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {booking.numberOfAdults} người lớn
                          {booking.numberOfChildren > 0 &&
                            `, ${booking.numberOfChildren} trẻ em`}
                          {booking.numberOfInfants > 0 &&
                            `, ${booking.numberOfInfants} em bé`}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tổng tiền
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="primary"
                        >
                          {booking.totalAmount.toLocaleString()} VNĐ
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <AppButton
                    onClick={() =>
                      navigate(`/user/profile/my-bookings/${bookingId}`)
                    }
                    variant="outlined"
                    size="large"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </AppButton>
                  <AppButton
                    type="submit"
                    success
                    size="large"
                    startIcon={<Save size={20} />}
                    isLoading={isUpdating || isSubmitting}
                    loadingText="Đang cập nhật..."
                    disabled={isFormInvalid}
                  >
                    Lưu thay đổi
                  </AppButton>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </Box>
  );
};

export default UpdateBookingPage;
