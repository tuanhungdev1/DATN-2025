// src/pages/user/BookingManagement/components/CancelBookingDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Box,
  Alert,
} from "@mui/material";
import { AppButton } from "@/components/button";
import type { Booking } from "@/types/booking.types";

interface CancelBookingDialogProps {
  open: boolean;
  booking: Booking | null;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export const CancelMyBookingDialog: React.FC<CancelBookingDialogProps> = ({
  open,
  booking,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Vui lòng nhập lý do hủy đặt phòng");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Lý do hủy phải có ít nhất 10 ký tự");
      return;
    }

    onConfirm(reason.trim());
    setReason("");
    setError("");
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>Hủy đặt phòng</DialogTitle>

      <DialogContent>
        {booking && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              Bạn đang chuẩn bị <strong>hủy đơn đặt phòng</strong> mã:{" "}
              <strong>{booking.bookingCode}</strong>
            </Alert>

            <Box sx={{ mb: 3, bgcolor: "grey.50", p: 2, borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Homestay:</strong> {booking.homestay.homestayTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Nhận phòng:</strong>{" "}
                {new Date(booking.checkInDate).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Trả phòng:</strong>{" "}
                {new Date(booking.checkOutDate).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Tổng tiền:</strong>{" "}
                <span style={{ color: "#d32f2f", fontWeight: 600 }}>
                  {booking.totalAmount.toLocaleString("vi-VN")} VNĐ
                </span>
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Lý do hủy đặt phòng *"
              placeholder="Vui lòng cho chúng tôi biết lý do bạn muốn hủy đặt phòng (tối thiểu 10 ký tự)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError("");
              }}
              error={!!error}
              helperText={
                error || "Lý do hủy giúp chúng tôi cải thiện dịch vụ tốt hơn"
              }
              sx={{ mt: 1 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
        <AppButton onClick={handleClose} variant="outlined" size="large">
          Quay lại
        </AppButton>
        <AppButton
          onClick={handleConfirm}
          danger
          size="large"
          disabled={!reason.trim() || reason.trim().length < 10}
        >
          Xác nhận hủy
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
