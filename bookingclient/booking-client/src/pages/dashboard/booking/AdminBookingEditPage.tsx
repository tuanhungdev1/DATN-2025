/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/BookingManagement/AdminBookingEditPage.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { ArrowLeft, Save } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import {
  useGetBookingByIdQuery,
  useUpdateBookingMutation,
} from "@/services/endpoints/booking.api";
import { AppButton } from "@/components/button";
import { useToast } from "@/hooks/useToast";

import { BookingStatus, BookingStatusDisplay } from "@/enums/bookingStatus";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useBookingActions } from "../user/hooks/useBookingActions";

dayjs.locale("vi");

interface UpdateFormValues {
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  specialRequests: string;
  bookingStatus?: BookingStatus;
}

const AdminBookingEditPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: bookingData,
    isLoading,
    error,
    refetch,
  } = useGetBookingByIdQuery(Number(bookingId), {
    skip: !bookingId,
  });

  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();

  const {
    handleConfirmBooking,
    handleRejectBooking,
    handleCancelBooking,
    handleCheckIn,
    handleCheckOut,
    handleMarkAsCompleted,
    handleMarkAsNoShow,
  } = useBookingActions(refetch);

  const booking = bookingData?.data;

  // Validation Schema
  const validationSchema = Yup.object({
    checkInDate: Yup.date()
      .required("Check-in date is required")
      .min(dayjs().startOf("day"), "Check-in date must be in the future"),
    checkOutDate: Yup.date()
      .required("Check-out date is required")
      .min(Yup.ref("checkInDate"), "Check-out must be after check-in"),
    numberOfAdults: Yup.number()
      .required("Number of adults is required")
      .min(1, "At least 1 adult"),
    numberOfChildren: Yup.number().min(0),
    numberOfInfants: Yup.number().min(0),
    specialRequests: Yup.string().max(500, "Too long"),
    bookingStatus: Yup.mixed<BookingStatus>().oneOf(
      Object.values(BookingStatus)
    ),
  });

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !booking) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy thông tin đặt phòng</Alert>
      </Container>
    );
  }

  const initialValues: UpdateFormValues = {
    checkInDate: dayjs(booking.checkInDate).format("YYYY-MM-DD"),
    checkOutDate: dayjs(booking.checkOutDate).format("YYYY-MM-DD"),
    numberOfAdults: booking.numberOfAdults,
    numberOfChildren: booking.numberOfChildren,
    numberOfInfants: booking.numberOfInfants,
    specialRequests: booking.specialRequests || "",
    bookingStatus: booking.bookingStatus,
  };

  const handleSubmit = async (values: UpdateFormValues) => {
    try {
      await updateBooking({
        id: booking.id,
        data: {
          checkInDate: values.checkInDate,
          checkOutDate: values.checkOutDate,
          numberOfAdults: values.numberOfAdults,
          numberOfChildren: values.numberOfChildren,
          numberOfInfants: values.numberOfInfants,
          specialRequests: values.specialRequests,
        },
      }).unwrap();
      toast.success("Booking updated successfully");
      navigate(`/admin/bookings/${booking.id}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  // Status change handlers (using actions)
  const handleStatusChange = async (newStatus: BookingStatus) => {
    try {
      switch (newStatus) {
        case BookingStatus.Confirmed:
          await handleConfirmBooking(booking.id);
          break;
        case BookingStatus.Rejected:
          const rejectReason = prompt("Enter rejection reason:");
          if (rejectReason) await handleRejectBooking(booking.id, rejectReason);
          break;
        case BookingStatus.Cancelled:
          const cancelReason = prompt("Enter cancellation reason:");
          if (cancelReason)
            await handleCancelBooking(booking.id, {
              cancellationReason: cancelReason,
            });
          break;
        case BookingStatus.CheckedIn:
          await handleCheckIn(booking.id);
          break;
        case BookingStatus.CheckedOut:
          await handleCheckOut(booking.id);
          break;
        case BookingStatus.Completed:
          await handleMarkAsCompleted(booking.id);
          break;
        case BookingStatus.NoShow:
          await handleMarkAsNoShow(booking.id);
          break;
        default:
          toast.warning("No action for this status");
      }
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Status update failed");
    }
  };

  return (
    <Box>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ my: 4 }}>
          <Box
            onClick={() => navigate(`/admin/bookings/${booking.id}`)}
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
            Quay lại chi tiết
          </Box>

          <Typography variant="h4" fontWeight={700} mb={4}>
            Cập nhật đặt phòng #{booking.bookingCode}
          </Typography>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue }) => (
            <Form>
              <Grid container spacing={4}>
                {/* Form Fields */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h6" mb={3}>
                        Thông tin ngày lưu trú
                      </Typography>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <Field
                          as={TextField}
                          name="checkInDate"
                          label="Ngày nhận phòng"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          error={touched.checkInDate && !!errors.checkInDate}
                          helperText={touched.checkInDate && errors.checkInDate}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            handleChange(e);
                            // Auto update checkOut if needed
                          }}
                        />
                        <Field
                          as={TextField}
                          name="checkOutDate"
                          label="Ngày trả phòng"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          error={touched.checkOutDate && !!errors.checkOutDate}
                          helperText={
                            touched.checkOutDate && errors.checkOutDate
                          }
                        />
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h6" mb={3}>
                        Số lượng khách
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Field
                          as={TextField}
                          name="numberOfAdults"
                          label="Người lớn"
                          type="number"
                          fullWidth
                          error={
                            touched.numberOfAdults && !!errors.numberOfAdults
                          }
                          helperText={
                            touched.numberOfAdults && errors.numberOfAdults
                          }
                        />
                        <Field
                          as={TextField}
                          name="numberOfChildren"
                          label="Trẻ em"
                          type="number"
                          fullWidth
                          error={
                            touched.numberOfChildren &&
                            !!errors.numberOfChildren
                          }
                          helperText={
                            touched.numberOfChildren && errors.numberOfChildren
                          }
                        />
                        <Field
                          as={TextField}
                          name="numberOfInfants"
                          label="Em bé"
                          type="number"
                          fullWidth
                          error={
                            touched.numberOfInfants && !!errors.numberOfInfants
                          }
                          helperText={
                            touched.numberOfInfants && errors.numberOfInfants
                          }
                        />
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h6" mb={3}>
                        Yêu cầu đặc biệt
                      </Typography>
                      <Field
                        as={TextField}
                        name="specialRequests"
                        label="Yêu cầu đặc biệt"
                        multiline
                        rows={4}
                        fullWidth
                        error={
                          touched.specialRequests && !!errors.specialRequests
                        }
                        helperText={
                          touched.specialRequests && errors.specialRequests
                        }
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Status Update & Actions */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card sx={{ mb: 4 }}>
                    <CardContent>
                      <Typography variant="h6" mb={3}>
                        Cập nhật trạng thái
                      </Typography>
                      <Field
                        as={TextField}
                        select
                        name="bookingStatus"
                        label="Trạng thái"
                        fullWidth
                        value={values.bookingStatus}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newStatus = Number(
                            e.target.value
                          ) as BookingStatus;
                          setFieldValue("bookingStatus", newStatus);
                          handleStatusChange(newStatus);
                        }}
                      >
                        {Object.values(BookingStatus)
                          .filter((value) => typeof value === "number")
                          .map((value) => (
                            <MenuItem key={value} value={value}>
                              {BookingStatusDisplay[value as BookingStatus]}
                            </MenuItem>
                          ))}
                      </Field>
                    </CardContent>
                  </Card>

                  <AppButton
                    type="submit"
                    fullWidth
                    startIcon={<Save size={18} />}
                    disabled={isUpdating}
                    sx={{ mb: 2 }}
                  >
                    Lưu thay đổi
                  </AppButton>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Container>
    </Box>
  );
};

export default AdminBookingEditPage;
