// src/pages/payment/PaymentResultPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { AppButton } from "@/components/button";

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  // VNPay return parameters
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
  const vnp_TxnRef = searchParams.get("vnp_TxnRef");
  const vnp_Amount = searchParams.get("vnp_Amount");

  const isSuccess = vnp_ResponseCode === "00" && vnp_TransactionStatus === "00";

  useEffect(() => {
    // Simulate processing delay
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isProcessing) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" fontWeight={600} mb={2}>
            Đang xử lý thanh toán...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vui lòng đợi trong giây lát
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, textAlign: "center" }}>
        {isSuccess ? (
          <>
            <CheckCircleIcon
              sx={{ fontSize: 80, color: "success.main", mb: 3 }}
            />
            <Typography variant="h4" fontWeight={600} mb={2}>
              Thanh toán thành công!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={1}>
              Đơn đặt phòng của bạn đã được xác nhận
            </Typography>
            {vnp_TxnRef && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                Mã giao dịch: {vnp_TxnRef}
              </Typography>
            )}
            {vnp_Amount && (
              <Typography variant="body2" color="text.secondary" mb={3}>
                Số tiền: {(parseInt(vnp_Amount) / 100).toLocaleString()} VNĐ
              </Typography>
            )}
            <Alert severity="success" sx={{ mb: 3, textAlign: "left" }}>
              Cảm ơn bạn đã đặt phòng! Chúng tôi đã gửi email xác nhận đến địa
              chỉ email của bạn.
            </Alert>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <AppButton
                onClick={() => navigate("/my-bookings")}
                success
                fullWidth
              >
                Xem đơn đặt phòng
              </AppButton>
              <AppButton
                onClick={() => navigate("/")}
                variant="outlined"
                fullWidth
              >
                Về trang chủ
              </AppButton>
            </Box>
          </>
        ) : (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: "error.main", mb: 3 }} />
            <Typography variant="h4" fontWeight={600} mb={2}>
              Thanh toán thất bại
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Rất tiếc, thanh toán của bạn không thành công
            </Typography>
            {vnp_ResponseCode && (
              <Alert severity="error" sx={{ mb: 3, textAlign: "left" }}>
                Mã lỗi: {vnp_ResponseCode}
                <br />
                {getErrorMessage(vnp_ResponseCode)}
              </Alert>
            )}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <AppButton
                onClick={() => navigate("/my-bookings")}
                variant="outlined"
                fullWidth
              >
                Xem đơn đặt phòng
              </AppButton>
              <AppButton
                onClick={() => window.history.back()}
                success
                fullWidth
              >
                Thử lại
              </AppButton>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

const getErrorMessage = (code: string): string => {
  const errorMessages: Record<string, string> = {
    "07": "Giao dịch nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)",
    "09": "Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking",
    "10": "Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
    "11": "Đã hết hạn chờ thanh toán",
    "12": "Thẻ/Tài khoản của khách hàng bị khóa",
    "13": "Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)",
    "24": "Khách hàng hủy giao dịch",
    "51": "Tài khoản của quý khách không đủ số dư để thực hiện giao dịch",
    "65": "Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày",
    "75": "Ngân hàng thanh toán đang bảo trì",
    "79": "KH nhập sai mật khẩu thanh toán quá số lần quy định",
    "99": "Lỗi không xác định",
  };

  return errorMessages[code] || "Đã xảy ra lỗi trong quá trình thanh toán";
};

export default PaymentResultPage;
