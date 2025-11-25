// src/pages/admin/BookingManagement/components/CancelBookingDialog.tsx
// Similar to the provided CancelMyBookingDialog, but for admin
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

export const CancelBookingDialog: React.FC<CancelBookingDialogProps> = ({
  open,
  booking,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a cancellation reason");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters");
      return;
    }

    onConfirm(reason);
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
      <DialogTitle>Cancel Booking (Admin)</DialogTitle>
      <DialogContent>
        {booking && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              You are about to cancel booking{" "}
              <strong>{booking.bookingCode}</strong>
            </Alert>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Homestay:</strong> {booking.homestay.homestayTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Guest:</strong> {booking.guestName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Host:</strong> {booking.homestay.ownerName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Check-in:</strong>{" "}
                {new Date(booking.checkInDate).toLocaleDateString("vi-VN")}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Check-out:</strong>{" "}
                {new Date(booking.checkOutDate).toLocaleDateString("vi-VN")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Amount:</strong>{" "}
                {booking.totalAmount.toLocaleString()} VNĐ
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Cancellation Reason *"
              placeholder="Please provide a reason for cancellation (minimum 10 characters)..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              error={!!error}
              helperText={error}
              sx={{ mt: 2 }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <AppButton onClick={handleClose} variant="outlined">
          Close
        </AppButton>
        <AppButton onClick={handleConfirm} danger disabled={!reason.trim()}>
          Confirm Cancel
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
