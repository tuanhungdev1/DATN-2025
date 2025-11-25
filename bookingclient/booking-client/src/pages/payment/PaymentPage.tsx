/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Payment/PaymentPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  Chip,
  TextField,
  DialogContent,
  Dialog,
  DialogActions,
} from "@mui/material";
import {
  Home,
  CreditCard,
  Receipt,
  Calendar,
  Clock,
  X,
  Tag,
  Smartphone,
  Wallet,
} from "lucide-react"; // lucide-react icons
import { useGetBookingByIdQuery } from "@/services/endpoints/booking.api";
import { useCreateOnlinePaymentMutation } from "@/services/endpoints/payment.api";
import { AppButton } from "@/components/button";
import { FormTextField } from "@/components/Input";
import { PaymentMethod } from "@/enums/payment.enums";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { formatCurrency, formatDate } from "@/utils/formatNumber";
import {
  useApplyCouponToBookingMutation,
  useGetCouponUsagesByBookingQuery,
  useRemoveCouponFromBookingMutation,
  useValidateCouponMutation,
} from "@/services/endpoints/coupon.api";
import PaymentPageSkeleton from "./PaymentPageSkeleton";

const colors = {
  vnpay: "#4a90e2",
  momo: "#a4235f",
  cash: "#f0ad4e",
  primary: "#006ce4",
};

const paymentMethods = [
  {
    value: PaymentMethod.VNPay,
    label: "VNPay",
    icon: <CreditCard size={20} />,
    description: "Thanh toán qua VNPay (ATM, Visa, MasterCard)",
    color: colors.vnpay,
  },
];

const validationSchema = Yup.object({
  paymentMethod: Yup.number().required("Vui lòng chọn phương thức thanh toán"),
  paymentNotes: Yup.string(),
});

const PaymentPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    PaymentMethod.VNPay
  );

  const [couponCode, setCouponCode] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogSeverity, setDialogSeverity] = useState<"success" | "error">(
    "success"
  );
  const [appliedCoupons, setAppliedCoupons] = useState<
    Array<{
      code: string;
      discountAmount: number;
      couponName: string;
    }>
  >([]);
  const [couponError, setCouponError] = useState("");

  const [validateCoupon, { isLoading: isValidatingCoupon }] =
    useValidateCouponMutation();
  const [applyCouponToBooking, { isLoading: isApplyingCoupon }] =
    useApplyCouponToBookingMutation();
  const [removeCouponFromBooking] = useRemoveCouponFromBookingMutation();

  const {
    data: bookingData,
    isLoading: isLoadingBooking,
    error: bookingError,
  } = useGetBookingByIdQuery(Number(bookingId), {
    skip: !bookingId,
  });

  const [createOnlinePayment, { isLoading: isCreatingPayment }] =
    useCreateOnlinePaymentMutation();

  const { data: couponUsagesData } = useGetCouponUsagesByBookingQuery(
    Number(bookingId),
    {
      skip: !bookingId,
    }
  );

  const booking = bookingData?.data;

  const showDialog = (message: string, severity: "success" | "error") => {
    setDialogMessage(message);
    setDialogSeverity(severity);
    setDialogOpen(true);
  };

  useEffect(() => {
    if (couponUsagesData?.success && couponUsagesData.data) {
      const coupons = couponUsagesData.data.map((usage: any) => ({
        code: usage.couponCode || usage.coupon?.couponCode || "",
        discountAmount: usage.discountAmount,
        couponName: usage.coupon?.couponName || usage.couponCode || "",
      }));
      setAppliedCoupons(coupons);
    }
  }, [couponUsagesData]);

  // Calculate remaining amount
  const totalPaid =
    booking?.payments
      ?.filter((p) => p.paymentStatus === 2)
      ?.reduce((sum, p) => sum + p.paymentAmount, 0) || 0;

  const totalCouponDiscount = appliedCoupons.reduce(
    (sum, c) => sum + c.discountAmount,
    0
  );
  const remainingAmount =
    (booking?.totalAmount || 0) - totalPaid - totalCouponDiscount;
  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !booking) return;

    // Kiểm tra mã đã được áp dụng chưa
    if (appliedCoupons.some((c) => c.code === couponCode.trim())) {
      setCouponError("Mã giảm giá này đã được áp dụng");
      return;
    }

    try {
      setCouponError("");

      // Validate coupon
      const validationResult = await validateCoupon({
        couponCode: couponCode.trim(),
        homestayId: booking.homestay.id,
        bookingAmount: booking.baseAmount,
        numberOfNights: booking.numberOfNights,
        checkInDate: booking.checkInDate,
        checkOutDate: booking.checkOutDate,
        bookingId: booking.id,
      }).unwrap();

      if (!validationResult.success || !validationResult.data?.isValid) {
        setCouponError(
          validationResult.data?.message || "Mã giảm giá không hợp lệ"
        );
        return;
      }

      // Apply coupon to booking
      const applyResult = await applyCouponToBooking({
        bookingId: booking.id,
        couponCode: couponCode.trim(),
      }).unwrap();

      if (applyResult.success) {
        const newCoupon = {
          code: couponCode.trim(),
          discountAmount: validationResult.data!.discountAmount,
          couponName:
            validationResult.data!.coupon?.couponName || couponCode.trim(),
        };

        setAppliedCoupons((prev) => [...prev, newCoupon]);
        setCouponCode("");
        setCouponError("");

        showDialog(
          `Áp dụng mã giảm giá thành công! Giảm ${formatCurrency(
            validationResult.data!.discountAmount
          )}`,
          "success"
        );
        // Refetch booking để cập nhật giá
        // (RTK Query sẽ tự động refetch do invalidatesTags)
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Không thể áp dụng mã giảm giá";
      // THAY ĐỔI: Hiển thị dialog thay vì setCouponError
      showDialog(errorMessage, "error");
    }
  };

  const handleRemoveCoupon = async (couponCodeToRemove: string) => {
    if (!booking?.id) return;

    const bookingId = Number(booking.id);
    if (isNaN(bookingId)) {
      console.error("Invalid bookingId:", booking.id);
      return;
    }

    try {
      await removeCouponFromBooking({
        bookingId,
        couponCode: couponCodeToRemove,
      }).unwrap();

      // Update state ngay lập tức cho UX tốt hơn
      setAppliedCoupons((prev) =>
        prev.filter((c) => c.code !== couponCodeToRemove)
      );

      // THAY ĐỔI: Hiển thị dialog
      showDialog("Đã xóa mã giảm giá", "success");
    } catch (err: any) {
      console.error("Remove coupon error:", err);
      // THAY ĐỔI: Hiển thị dialog
      showDialog(err?.data?.message || "Không thể xóa mã giảm giá", "error");
    }
  };
  useEffect(() => {
    if (booking && remainingAmount <= 0) {
      navigate(`/payment/${bookingId}`);
    }
  }, [booking, remainingAmount, bookingId, navigate]);

  const handlePayment = async (values: any) => {
    if (!booking) return;

    try {
      const returnUrl = `${window.location.origin}/payment-callback`;

      if (selectedMethod === PaymentMethod.VNPay) {
        const response = await createOnlinePayment({
          bookingId: booking.id,
          paymentMethod: selectedMethod,
          returnUrl: returnUrl,
          paymentNotes: values.paymentNotes,
        }).unwrap();

        if (response.success && response.data?.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        }
      } else {
        navigate(`/bookings/${bookingId}`, {
          state: {
            message: "Đã tạo yêu cầu thanh toán. Vui lòng hoàn tất thanh toán.",
          },
        });
      }
    } catch (error: any) {
      console.error("Payment error:", error);
    }
  };

  if (isLoadingBooking) {
    return <PaymentPageSkeleton />;
  }

  if (bookingError || !booking) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Không tìm thấy thông tin đặt phòng. Vui lòng thử lại.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h2"
        sx={{ mb: 3, fontWeight: 600, color: "#2d3436" }}
      >
        Thanh toán đặt phòng
      </Typography>

      <Grid container spacing={3}>
        {/* Booking Information */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: "4px", boxShadow: 1 }}>
            <Typography
              variant="h3"
              sx={{ mb: 3, fontWeight: 600, color: "#2d3436" }}
            >
              Thông tin đặt phòng
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Home size={20} color={colors.primary} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Homestay
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {booking.homestay.homestayTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.homestay.fullAddress}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Receipt size={18} color={colors.primary} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Mã đặt phòng
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {booking.bookingCode}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Calendar size={18} color={colors.primary} />
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Số đêm
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {booking.numberOfNights} đêm
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nhận phòng
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(booking.checkInDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.homestay.checkInTime}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Trả phòng
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {formatDate(booking.checkOutDate)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.homestay.checkOutTime}
                  </Typography>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Số khách
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {booking.numberOfGuests} khách
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.numberOfAdults} người lớn
                    {booking.numberOfChildren > 0 &&
                      `, ${booking.numberOfChildren} trẻ em`}
                    {booking.numberOfInfants > 0 &&
                      `, ${booking.numberOfInfants} em bé`}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Payment Method Selection */}
          <Paper sx={{ p: 3, borderRadius: "4px", boxShadow: 1 }}>
            <Typography
              variant="h3"
              sx={{ mb: 3, fontWeight: 600, color: "#2d3436" }}
            >
              Phương thức thanh toán
            </Typography>

            <Formik
              initialValues={{
                paymentMethod: PaymentMethod.VNPay,
                paymentNotes: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handlePayment}
            >
              {({ values, setFieldValue }) => (
                <Form>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={selectedMethod}
                      onChange={(e) => {
                        const method = Number(e.target.value) as PaymentMethod;
                        setSelectedMethod(method);
                        setFieldValue("paymentMethod", method);
                      }}
                    >
                      {paymentMethods.map((method) => (
                        <Card
                          key={method.value}
                          sx={{
                            mb: 2,
                            border: 2,
                            borderColor:
                              selectedMethod === method.value
                                ? method.color
                                : "transparent",
                            borderRadius: "4px",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: 0,
                            "&:hover": {
                              borderColor: method.color,
                              transform: "translateY(-1px)",
                              boxShadow: 1,
                            },
                          }}
                          onClick={() => {
                            setSelectedMethod(method.value);
                            setFieldValue("paymentMethod", method.value);
                          }}
                        >
                          <CardContent sx={{ py: 2 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <FormControlLabel
                                value={method.value}
                                control={<Radio />}
                                label=""
                                sx={{ m: 0 }}
                              />
                              <Box
                                sx={{
                                  color: method.color,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {method.icon}
                              </Box>
                              <Box flex={1}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={600}
                                >
                                  {method.label}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {method.description}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </RadioGroup>
                  </FormControl>

                  <Box sx={{ mt: 3 }}>
                    <FormTextField
                      name="paymentNotes"
                      label="Ghi chú thanh toán (tùy chọn)"
                      placeholder="Nhập ghi chú nếu có..."
                      multiline
                      rows={3}
                    />
                  </Box>

                  {selectedMethod === PaymentMethod.VNPay && (
                    <Alert severity="info" sx={{ mt: 3, borderRadius: "4px" }}>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Lưu ý khi thanh toán qua VNPay:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="ul"
                        sx={{ pl: 2, m: 0 }}
                      >
                        <li>Bạn sẽ được chuyển đến trang thanh toán VNPay</li>
                        <li>Giao dịch có hiệu lực trong 15 phút</li>
                        <li>
                          Sau khi thanh toán thành công, đặt phòng sẽ được xác
                          nhận tự động
                        </li>
                      </Typography>
                    </Alert>
                  )}

                  {selectedMethod === PaymentMethod.Momo && (
                    <Alert severity="info" sx={{ mt: 3, borderRadius: "4px" }}>
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Lưu ý khi thanh toán qua Momo:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="ul"
                        sx={{ pl: 2, m: 0 }}
                      >
                        <li>Bạn sẽ được chuyển đến ứng dụng hoặc web Momo</li>
                        <li>Giao dịch có hiệu lực trong 15 phút</li>
                        <li>
                          Sau khi thanh toán thành công, đặt phòng sẽ được xác
                          nhận tự động
                        </li>
                      </Typography>
                    </Alert>
                  )}

                  {selectedMethod === PaymentMethod.Cash && (
                    <Alert
                      severity="warning"
                      sx={{ mt: 3, borderRadius: "4px" }}
                    >
                      <Typography variant="body2" fontWeight={600} gutterBottom>
                        Lưu ý khi chọn thanh toán tiền mặt:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="ul"
                        sx={{ pl: 2, m: 0 }}
                      >
                        <li>
                          Bạn sẽ thanh toán trực tiếp cho chủ nhà khi nhận phòng
                        </li>
                        <li>
                          Vui lòng liên hệ chủ nhà để xác nhận chi tiết thanh
                          toán
                        </li>
                        <li>
                          Đặt phòng sẽ được xác nhận sau khi chủ nhà nhận được
                          tiền
                        </li>
                      </Typography>
                    </Alert>
                  )}

                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <AppButton
                      variant="outlined"
                      onClick={() => navigate(`/bookings/${bookingId}`)}
                      fullWidth
                      sx={{ borderRadius: "4px" }}
                    >
                      Quay lại
                    </AppButton>
                    <AppButton
                      type="submit"
                      success
                      fullWidth
                      isLoading={isCreatingPayment}
                      loadingText="Đang xử lý..."
                      sx={{ borderRadius: "4px" }}
                    >
                      {selectedMethod === PaymentMethod.VNPay
                        ? "Thanh toán ngay"
                        : "Xác nhận"}
                    </AppButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>

        {/* Payment Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              position: "sticky",
              top: 20,
              borderRadius: "4px",
              boxShadow: 1,
              backgroundColor: "#fafafa",
            }}
          >
            {/* Phần Mã giảm giá - Đặt lên đầu */}
            <Box sx={{ mb: 3, pb: 3, borderBottom: "1px solid #e0e0e0" }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: "#2d3436",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Tag size={20} color={colors.primary} />
                Mã giảm giá
              </Typography>

              <Box display="flex" gap={1} mb={2}>
                <TextField
                  name="couponCode"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Nhập mã"
                  size="small"
                  disabled={isValidatingCoupon || isApplyingCoupon}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyCoupon();
                    }
                  }}
                />
                <AppButton
                  onClick={handleApplyCoupon}
                  disabled={
                    !couponCode.trim() || isValidatingCoupon || isApplyingCoupon
                  }
                  isLoading={isValidatingCoupon || isApplyingCoupon}
                  size="small"
                  sx={{
                    minWidth: 80,
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Áp dụng
                </AppButton>
              </Box>

              {couponError && (
                <Alert
                  severity="error"
                  sx={{ mb: 2, borderRadius: "4px", py: 0.5 }}
                >
                  <Typography variant="caption">{couponError}</Typography>
                </Alert>
              )}

              {appliedCoupons.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1, display: "block" }}
                  >
                    Đã áp dụng ({appliedCoupons.length}):
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {appliedCoupons.map((coupon) => (
                      <Box
                        key={coupon.code}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#e8f5e9",
                          borderRadius: "4px",
                          px: 1.5,
                          py: 1,
                        }}
                      >
                        <Box flex={1}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="#2e7d32"
                          >
                            {coupon.code}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {coupon.couponName}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="#2e7d32"
                          >
                            -{formatCurrency(coupon.discountAmount)}
                          </Typography>
                          <Box
                            component="button"
                            onClick={() => handleRemoveCoupon(coupon.code)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              border: "none",
                              backgroundColor: "#2e7d32",
                              color: "white",
                              cursor: "pointer",
                              padding: 0,
                              "&:hover": {
                                backgroundColor: "#1b5e20",
                              },
                            }}
                          >
                            <X size={14} />
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            <Typography
              variant="h3"
              sx={{ mb: 3, fontWeight: 600, color: "#2d3436" }}
            >
              Chi tiết thanh toán
            </Typography>

            <Box sx={{ mb: 3 }}>
              {booking.baseAmount > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 1.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(
                      booking.baseAmount / booking.numberOfNights
                    )}{" "}
                    x {booking.numberOfNights} đêm
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(booking.baseAmount)}
                  </Typography>
                </Box>
              )}

              {booking.cleaningFee > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 1.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Phí vệ sinh
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(booking.cleaningFee)}
                  </Typography>
                </Box>
              )}

              {booking.serviceFee > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 1.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Phí dịch vụ
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(booking.serviceFee)}
                  </Typography>
                </Box>
              )}

              {booking.taxAmount > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 1.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Thuế
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(booking.taxAmount)}
                  </Typography>
                </Box>
              )}

              {booking.discountAmount > 0 && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 1.5 }}
                >
                  <Typography variant="body2" color="#27ae60">
                    Giảm giá
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#27ae60">
                    -{formatCurrency(booking.discountAmount)}
                  </Typography>
                </Box>
              )}

              {appliedCoupons.length > 0 && (
                <>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mb: 1.5 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Giảm giá từ mã coupon ({appliedCoupons.length})
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="#27ae60"
                    >
                      -
                      {formatCurrency(
                        appliedCoupons.reduce(
                          (sum, c) => sum + c.discountAmount,
                          0
                        )
                      )}
                    </Typography>
                  </Box>
                  {appliedCoupons.map((coupon) => (
                    <Box
                      key={coupon.code}
                      display="flex"
                      justifyContent="space-between"
                      sx={{ mb: 0.5, pl: 2 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        • {coupon.code}
                      </Typography>
                      <Typography variant="caption" color="#27ae60">
                        -{formatCurrency(coupon.discountAmount)}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body1" fontWeight={600}>
                  Tổng cộng
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={700}
                  color={colors.primary}
                >
                  {formatCurrency(booking.totalAmount)}
                </Typography>
              </Box>

              {totalPaid > 0 && (
                <>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Đã thanh toán
                    </Typography>
                    <Typography variant="body2" color="#27ae60">
                      {formatCurrency(totalPaid)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" fontWeight={600}>
                      Còn lại
                    </Typography>
                    <Typography variant="h3" fontWeight={700} color="#e74c3c">
                      {formatCurrency(remainingAmount)}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>

            <Alert
              severity="warning"
              icon={<Clock size={16} />}
              sx={{
                borderRadius: "4px",
                "& .MuiAlert-icon": { color: "#f39c12" },
              }}
            >
              <Typography variant="body2">
                Vui lòng hoàn tất thanh toán trong vòng <strong>24 giờ</strong>{" "}
                để giữ đặt phòng của bạn.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ pt: 3 }}>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            {dialogSeverity === "success" ? (
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "#e8f5e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="svg"
                  width={32}
                  height={32}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2e7d32"
                  strokeWidth={2}
                >
                  <polyline points="20 6 9 17 4 12" />
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "#ffebee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={32} color="#c62828" />
              </Box>
            )}

            <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
              {dialogSeverity === "success" ? "Thành công" : "Thất bại"}
            </Typography>

            <Typography variant="body1" align="center" color="text.secondary">
              {dialogMessage}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center" }}>
          <AppButton
            onClick={() => setDialogOpen(false)}
            success={dialogSeverity === "success"}
            sx={{ minWidth: 120 }}
          >
            Đóng
          </AppButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage;
