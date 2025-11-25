/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Payment/PaymentCallback.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { AppButton } from "@/components/button";
import { useVerifyPaymentCallbackQuery } from "@/services/endpoints/payment.api";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingId, setBookingId] = useState<string>("");

  const queryParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  const isVNPay = Object.keys(queryParams).some((k) => k.startsWith("vnp_"));
  const paymentMethod = isVNPay ? "vnpay" : "unknown";

  useEffect(() => {
    const txnRef = queryParams.vnp_TxnRef;
    if (txnRef) {
      const extracted = txnRef.split("_")[0];
      setBookingId(extracted);
      console.log("Extracted Booking ID:", extracted);
    }
  }, [queryParams.vnp_TxnRef]);

  const {
    data: verifyResult,
    isLoading,
    isError,
    error,
  } = useVerifyPaymentCallbackQuery(
    {
      paymentMethod,
      queryParams,
    },
    {
      skip: paymentMethod === "unknown",
    }
  );

  useEffect(() => {
    if (isError) {
      console.log("=== API ERROR ===");
      console.log("Error:", error);
    }
  }, [isError, error]);

  const isSuccess = Boolean(
    verifyResult?.success === true &&
      verifyResult?.data &&
      (verifyResult.data.paymentStatus.toString() === "Completed" ||
        verifyResult.data.paymentStatus === 2 ||
        verifyResult.data.paymentStatus?.toString().toLowerCase() ===
          "completed")
  );

  const errorMessage =
    isError && error && "data" in error
      ? (error.data as any)?.message || "Xác minh thanh toán thất bại."
      : verifyResult?.message || "Thanh toán thất bại. Vui lòng thử lại.";

  const getErrorMessage = (code?: string) => {
    if (!code) return errorMessage;
    const messages: Record<string, string> = {
      "07": "Giao dịch bị nghi ngờ. Vui lòng liên hệ ngân hàng.",
      "09": "Thẻ chưa đăng ký dịch vụ Internet Banking.",
      "10": "Xác thực thông tin không đúng quá 3 lần.",
      "11": "Đã hết hạn chờ thanh toán.",
      "12": "Thẻ bị khóa.",
      "13": "Mật khẩu OTP không đúng.",
      "24": "Giao dịch bị hủy.",
      "51": "Tài khoản không đủ số dư.",
      "65": "Vượt quá hạn mức giao dịch.",
      "75": "Ngân hàng đang bảo trì.",
      "79": "Nhập sai mật khẩu quá số lần quy định.",
    };
    return messages[code] || "Giao dịch thất bại. Vui lòng thử lại.";
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: "4px" }}>
        {/* LOADING STATE */}
        {isLoading && (
          <Box>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h3" gutterBottom>
              Đang xác minh thanh toán...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng đợi trong giây lát
            </Typography>
            <LinearProgress sx={{ mt: 2 }} />
          </Box>
        )}

        {/* SUCCESS STATE */}
        {!isLoading && isSuccess && (
          <Box>
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 3 }} />
            <Typography variant="h2" gutterBottom fontWeight={600}>
              Thanh toán thành công!
            </Typography>
            <Alert
              severity="success"
              sx={{ my: 3, textAlign: "left", borderRadius: "4px" }}
            >
              Thanh toán thành công! Đặt phòng của bạn đã được xác nhận.
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Cảm ơn bạn đã đặt phòng. Chúng tôi đã gửi email xác nhận.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center">
              <AppButton
                variant="outlined"
                onClick={() => navigate("/bookings")}
              >
                Xem đặt phòng
              </AppButton>
              <AppButton
                success
                onClick={() =>
                  navigate(
                    bookingId
                      ? `/user/profile/my-bookings/${bookingId}`
                      : "/user/profile/my-bookings"
                  )
                }
              >
                Xem chi tiết
              </AppButton>
            </Box>
          </Box>
        )}

        {/* FAILED STATE */}
        {!isLoading && !isSuccess && (
          <Box>
            <Error sx={{ fontSize: 80, color: "error.main", mb: 3 }} />
            <Typography variant="h2" gutterBottom fontWeight={600}>
              Thanh toán thất bại
            </Typography>
            <Alert
              severity="error"
              sx={{ my: 3, textAlign: "left", borderRadius: "4px" }}
            >
              {getErrorMessage(queryParams.vnp_ResponseCode)}
            </Alert>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Đặt phòng vẫn được giữ. Bạn có thể thử thanh toán lại.
            </Typography>
            <Box display="flex" gap={2} justifyContent="center">
              <AppButton variant="outlined" onClick={() => navigate("/")}>
                Về trang chủ
              </AppButton>
              <AppButton
                success
                onClick={() =>
                  navigate(
                    bookingId
                      ? `/payment/${bookingId}`
                      : "/user/profile/my-bookings"
                  )
                }
              >
                Thử lại
              </AppButton>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PaymentCallback;
