/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DollarSign } from "lucide-react";
import type { Payment } from "@/types/payment.types";
import { useGetRefundStatusQuery } from "@/services/endpoints/payment.api";

interface RefundPaymentDialogProps {
  open: boolean;
  payment: Payment | null;
  onConfirm: (amount: number, reason: string) => Promise<void>;
  onCancel: () => void;
}

export const RefundPaymentDialog: React.FC<RefundPaymentDialogProps> = ({
  open,
  payment,
  onConfirm,
  onCancel,
}) => {
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [refundReason, setRefundReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch refund status
  const { data: refundStatusData, isLoading: isLoadingStatus } =
    useGetRefundStatusQuery(payment?.id ?? 0, {
      skip: !payment?.id,
    });

  const refundStatus = refundStatusData?.data;

  useEffect(() => {
    if (open && payment) {
      setRefundAmount("");
      setRefundReason("");
      setError("");
    }
  }, [open, payment]);

  const handleConfirm = async () => {
    if (!payment || !refundStatus) return;

    // Validation
    const amount = parseFloat(refundAmount);

    if (isNaN(amount) || amount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (amount > refundStatus.refundableAmount) {
      setError(
        `Số tiền hoàn vượt quá số tiền có thể hoàn (${refundStatus.refundableAmount.toLocaleString()} VNĐ)`
      );
      return;
    }

    if (!refundReason.trim()) {
      setError("Vui lòng nhập lý do hoàn tiền");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await onConfirm(amount, refundReason);
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra khi hoàn tiền");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetFullRefund = () => {
    if (refundStatus) {
      setRefundAmount(refundStatus.refundableAmount.toString());
    }
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <DollarSign className="w-5 h-5" />
        Hoàn tiền thanh toán
      </DialogTitle>

      <DialogContent>
        {isLoadingStatus ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : !refundStatus?.canRefund ? (
          <Alert severity="warning">Thanh toán này không thể hoàn tiền</Alert>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {/* Payment Info */}
            <Box
              sx={{
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                Thông tin thanh toán
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mã GD: #{payment.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mã đặt phòng: {payment.booking?.bookingCode}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Số tiền gốc:{" "}
                <strong>
                  {refundStatus.originalAmount.toLocaleString()} VNĐ
                </strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đã hoàn:{" "}
                <strong>
                  {refundStatus.refundedAmount.toLocaleString()} VNĐ
                </strong>
              </Typography>
              <Typography variant="body2" color="primary.main" mt={1}>
                Có thể hoàn:{" "}
                <strong>
                  {refundStatus.refundableAmount.toLocaleString()} VNĐ
                </strong>
              </Typography>
            </Box>

            {/* Refund Amount Input */}
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Số tiền hoàn <span style={{ color: "red" }}>*</span>
                </Typography>
                <Button size="small" onClick={handleSetFullRefund}>
                  Hoàn toàn bộ
                </Button>
              </Box>
              <TextField
                fullWidth
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Nhập số tiền cần hoàn"
                inputProps={{
                  min: 0,
                  max: refundStatus.refundableAmount,
                  step: 1000,
                }}
                helperText={`Tối đa: ${refundStatus.refundableAmount.toLocaleString()} VNĐ`}
              />
            </Box>

            {/* Refund Reason */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Lý do hoàn tiền"
              required
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Nhập lý do hoàn tiền..."
            />

            {error && (
              <Alert severity="error" onClose={() => setError("")}>
                {error}
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="success"
          disabled={isSubmitting || !refundStatus?.canRefund}
          startIcon={isSubmitting && <CircularProgress size={16} />}
        >
          {isSubmitting ? "Đang xử lý..." : "Xác nhận hoàn tiền"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
