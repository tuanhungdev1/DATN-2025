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

const PaymentCallbackMomo = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error"
  >("processing");
  const [bookingId, setBookingId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const processCallback = async () => {
      try {
        const orderId = searchParams.get("orderId");
        const resultCode = searchParams.get("resultCode");
        const transId = searchParams.get("transId");
        const amount = searchParams.get("amount");

        console.log("Momo Callback:", { orderId, resultCode, transId, amount });

        if (orderId) {
          const extracted = orderId.split("_")[0];
          setBookingId(extracted);
        }

        // Kiểm tra kết quả từ Momo
        if (resultCode === "0") {
          setPaymentStatus("success");
        } else {
          setPaymentStatus("error");
          setErrorMessage(getMomoErrorMessage(resultCode || ""));
        }
      } catch (error) {
        console.error("Error processing Momo callback:", error);
        setPaymentStatus("error");
        setErrorMessage("Lỗi xử lý callback từ Momo");
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [searchParams]);

  const getMomoErrorMessage = (code: string | number) => {
    const messages: Record<string, string> = {
      "1001": "Yêu cầu không hợp lệ",
      "1002": "Lỗi xác thực merchant",
      "1003": "Yêu cầu bị từ chối",
      "1004": "Số tiền không hợp lệ",
      "1005": "Lỗi không xác định",
      "1006": "Giao dịch không thành công",
      "9000": "Giao dịch đã được xử lý trước đó",
      "9001": "Giao dịch đang được xử lý",
    };
    return messages[code.toString()] || "Giao dịch thất bại. Vui lòng thử lại.";
  };

  if (isProcessing) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: "4px" }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h3" gutterBottom>
            Đang xác minh thanh toán Momo...
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vui lòng đợi trong giây lát
          </Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: "4px" }}>
        {paymentStatus === "success" && (
          <Box>
            <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 3 }} />
            <Typography variant="h2" gutterBottom fontWeight={600}>
              Thanh toán Momo thành công!
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

        {paymentStatus === "error" && (
          <Box>
            <Error sx={{ fontSize: 80, color: "error.main", mb: 3 }} />
            <Typography variant="h2" gutterBottom fontWeight={600}>
              Thanh toán thất bại
            </Typography>
            <Alert
              severity="error"
              sx={{ my: 3, textAlign: "left", borderRadius: "4px" }}
            >
              {errorMessage}
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

export default PaymentCallbackMomo;
