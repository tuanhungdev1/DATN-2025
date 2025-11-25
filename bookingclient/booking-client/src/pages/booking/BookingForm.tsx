/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/booking/BookingForm.tsx
import { useEffect } from "react";
import { useFormik } from "formik";
import { Grid, Alert, Divider, Stack } from "@mui/material";
import { FormTextField } from "@/components/Input";
import { AppButton } from "@/components/button";
import { createBookingValidationSchema } from "@/validators/bookingValidation";
import type { CreateBooking } from "@/types/booking.types";
import dayjs from "dayjs";

interface BookingFormProps {
  initialData: Partial<CreateBooking>;
  dateRange: { startDate: Date | null; endDate: Date | null };
  homestay: any;
  isAvailable: boolean;
  priceBreakdown: any;
  numberOfNights: number;
  isCreatingBooking: boolean;
  onSubmit: (data: CreateBooking) => Promise<void>;
  onBack: () => void;
}

export const BookingForm = ({
  initialData,
  dateRange,
  homestay,
  isAvailable,
  priceBreakdown,
  numberOfNights,
  isCreatingBooking,
  onSubmit,
  onBack,
}: BookingFormProps) => {
  const formik = useFormik<CreateBooking>({
    initialValues: {
      homestayId: initialData.homestayId || 0,
      checkInDate: "",
      checkOutDate: "",
      numberOfGuests: initialData.numberOfGuests || 2,
      numberOfAdults: initialData.numberOfAdults || 2,
      numberOfChildren: initialData.numberOfChildren || 0,
      numberOfInfants: initialData.numberOfInfants || 0,
      specialRequests: "",
    },
    validationSchema: createBookingValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  // Cập nhật checkInDate, checkOutDate khi dateRange thay đổi
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const checkIn = dayjs(dateRange.startDate).format("YYYY-MM-DD");
      const checkOut = dayjs(dateRange.endDate).format("YYYY-MM-DD");

      formik.setFieldValue("checkInDate", checkIn, false);
      formik.setFieldValue("checkOutDate", checkOut, false);
    }
  }, [dateRange.startDate, dateRange.endDate, formik]);

  // Cập nhật numberOfGuests tự động
  useEffect(() => {
    const total =
      formik.values.numberOfAdults +
      (formik.values.numberOfChildren || 0) +
      (formik.values.numberOfInfants || 0);
    if (total !== formik.values.numberOfGuests) {
      formik.setFieldValue("numberOfGuests", total, false);
    }
  }, [
    formik.values.numberOfAdults,
    formik.values.numberOfChildren,
    formik.values.numberOfInfants,
    formik,
  ]);

  const isFormInvalid =
    !formik.isValid ||
    formik.isSubmitting ||
    !dateRange.startDate ||
    !dateRange.endDate ||
    numberOfNights <= 0 ||
    !isAvailable ||
    !priceBreakdown ||
    formik.values.numberOfGuests > homestay.maximumGuests ||
    formik.values.numberOfGuests < 1;

  return (
    <form onSubmit={formik.handleSubmit}>
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

        {formik.values.numberOfGuests > homestay.maximumGuests && (
          <Grid size={12}>
            <Alert severity="warning">
              Số khách ({formik.values.numberOfGuests}) vượt quá giới hạn tối đa
              ({homestay.maximumGuests})
            </Alert>
          </Grid>
        )}

        {!isAvailable &&
          dateRange.startDate &&
          dateRange.endDate &&
          numberOfNights > 0 && (
            <Grid size={12}>
              <Alert severity="error">
                Homestay không còn trống từ{" "}
                {dayjs(dateRange.startDate).format("DD/MM/YYYY")} đến{" "}
                {dayjs(dateRange.endDate).format("DD/MM/YYYY")}
              </Alert>
            </Grid>
          )}

        <Grid size={12}>
          <FormTextField
            name="specialRequests"
            label="Yêu cầu đặc biệt (không bắt buộc)"
            placeholder="Ví dụ: Tầng cao, giường đôi..."
            multiline
            rows={4}
          />
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <AppButton
              onClick={onBack}
              variant="outlined"
              size="large"
              disabled={formik.isSubmitting}
            >
              Quay lại
            </AppButton>
            <AppButton
              type="submit"
              success
              size="large"
              isLoading={isCreatingBooking || formik.isSubmitting}
              loadingText="Đang xử lý..."
              disabled={isFormInvalid}
            >
              Xác nhận đặt phòng
            </AppButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};
