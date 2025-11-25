/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/CouponManagement/components/ExtendExpiryDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  alpha,
  TextField,
  Alert,
} from "@mui/material";
import { AppButton } from "@/components/button";
import { Calendar, AlertCircle } from "lucide-react";
import type { Coupon } from "@/types/coupon.types";
import { useExtendCouponExpiryMutation } from "@/services/endpoints/coupon.api";
import { useToast } from "@/hooks/useToast";

interface ExtendExpiryDialogProps {
  open: boolean;
  coupon: Coupon | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ExtendExpiryDialog: React.FC<ExtendExpiryDialogProps> = ({
  open,
  coupon,
  onClose,
  onSuccess,
}) => {
  const toast = useToast();
  const [newEndDate, setNewEndDate] = useState("");
  const [extendCouponExpiry, { isLoading }] = useExtendCouponExpiryMutation();

  const handleClose = () => {
    setNewEndDate("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!coupon || !newEndDate) {
      toast.error("Vui lòng chọn ngày kết thúc mới");
      return;
    }

    const selectedDate = new Date(newEndDate);
    const currentEndDate = new Date(coupon.endDate);

    if (selectedDate <= currentEndDate) {
      toast.error("Ngày kết thúc mới phải sau ngày kết thúc hiện tại");
      return;
    }

    try {
      await extendCouponExpiry({
        id: coupon.id,
        newEndDate: new Date(newEndDate).toISOString(),
      }).unwrap();

      toast.success("Đã gia hạn coupon thành công");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Không thể gia hạn coupon");
    }
  };

  if (!coupon) return null;

  const minDate = new Date(coupon.endDate);
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split("T")[0];

  const currentEndDate = new Date(coupon.endDate);
  const daysLeft = Math.ceil(
    (currentEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
          }}
        >
          <Calendar size={24} color="#1976d2" />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Gia hạn Coupon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chọn ngày kết thúc mới cho coupon
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: (theme) => alpha(theme.palette.info.main, 0.05),
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
            mb: 3,
          }}
        >
          <Typography variant="body2" fontWeight={600} mb={0.5}>
            {coupon.couponCode} - {coupon.couponName}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Loại: {coupon.couponTypeDisplay} | Phạm vi: {coupon.scopeDisplay}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
            <Calendar size={14} />
            <Typography variant="body2">
              Ngày kết thúc hiện tại:{" "}
              <strong>
                {currentEndDate.toLocaleDateString("vi-VN", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
            </Typography>
          </Box>
          {daysLeft > 0 ? (
            <Typography
              variant="caption"
              color="success.main"
              sx={{ display: "block", mt: 0.5 }}
            >
              ✓ Còn {daysLeft} ngày
            </Typography>
          ) : (
            <Typography
              variant="caption"
              color="error.main"
              sx={{ display: "block", mt: 0.5 }}
            >
              ✗ Đã hết hạn {Math.abs(daysLeft)} ngày trước
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          type="date"
          label="Ngày kết thúc mới"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            min: minDateString,
          }}
          helperText={`Chọn ngày sau ${currentEndDate.toLocaleDateString(
            "vi-VN"
          )}`}
          sx={{ mb: 2 }}
        />

        {newEndDate && (
          <Alert severity="info" icon={<AlertCircle size={20} />}>
            <Typography variant="body2">
              Coupon sẽ được gia hạn đến:{" "}
              <strong>
                {new Date(newEndDate).toLocaleDateString("vi-VN", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Thêm{" "}
              {Math.ceil(
                (new Date(newEndDate).getTime() - currentEndDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              ngày
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <AppButton
          variant="outlined"
          onClick={handleClose}
          size="small"
          disabled={isLoading}
        >
          Hủy
        </AppButton>
        <AppButton
          variant="contained"
          onClick={handleSubmit}
          size="small"
          disabled={isLoading || !newEndDate}
        >
          {isLoading ? "Đang xử lý..." : "Gia hạn"}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
