import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import dayjs from "dayjs";

interface PaymentCountdownProps {
  expiresAt: string; // ISO string
}

export const PaymentCountdown = ({ expiresAt }: PaymentCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  console.log("expiresAt", expiresAt);
  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      const end = dayjs(expiresAt);
      const diff = end.diff(now);

      if (diff <= 0) {
        setTimeLeft("Đã hết hạn");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!expiresAt || dayjs(expiresAt).isBefore(dayjs())) {
    return (
      <Typography color="error" fontWeight={600}>
        Đã hết hạn thanh toán
      </Typography>
    );
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Thời gian còn lại để thanh toán
      </Typography>
      <Typography
        variant="h5"
        fontWeight={700}
        color="error"
        sx={{ fontFamily: "monospace", letterSpacing: 2 }}
      >
        {timeLeft}
      </Typography>
    </Box>
  );
};
