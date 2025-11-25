/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/PaymentManagement/MarkPaymentFailedDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Button,
} from "@mui/material";
import { AppButton } from "@/components/button";

interface MarkPaymentFailedDialogProps {
  open: boolean;
  payment: any | null;
  onConfirm: (reason: string) => Promise<void>;
  onCancel: () => void;
}

export const MarkPaymentFailedDialog: React.FC<
  MarkPaymentFailedDialogProps
> = ({ open, payment, onConfirm, onCancel }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (reason) {
      await onConfirm(reason);
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Đánh dấu thất bại #{payment?.id}</DialogTitle>
      <DialogContent>
        <Alert severity="error" sx={{ mb: 2 }}>
          Giao dịch sẽ được đánh dấu là thất bại.
        </Alert>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Lý do thất bại *"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={reason.length > 0 && reason.length < 10}
          helperText={
            reason.length > 0 && reason.length < 10
              ? "Lý do phải ít nhất 10 ký tự"
              : ""
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Hủy</Button>
        <AppButton
          danger
          onClick={handleSubmit}
          disabled={!reason || reason.length < 10}
        >
          Đánh dấu thất bại
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
