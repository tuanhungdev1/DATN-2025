// src/pages/admin/CouponManagement/components/DeleteConfirmDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  alpha,
} from "@mui/material";
import { AppButton } from "@/components/button";
import { AlertTriangle, Tag, Calendar, Users } from "lucide-react";
import type { Coupon } from "@/types/coupon.types";

interface DeleteConfirmDialogProps {
  open: boolean;
  coupon: Coupon | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  coupon,
  onConfirm,
  onCancel,
}) => {
  if (!coupon) return null;

  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
          }}
        >
          <AlertTriangle size={24} color="#d32f2f" />
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Xác nhận xóa Coupon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hành động này không thể hoàn tác
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body1" mb={2}>
          Bạn có chắc chắn muốn xóa coupon này không?
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.05),
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.error.main, 0.2),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Tag size={16} />
            <Typography variant="body2" fontWeight={600}>
              {coupon.couponCode}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={1}>
            {coupon.couponName}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.5 }}>
            <Chip
              label={coupon.couponTypeDisplay}
              size="small"
              sx={{ fontSize: "0.75rem" }}
            />
            <Chip
              label={coupon.scopeDisplay}
              size="small"
              sx={{ fontSize: "0.75rem" }}
            />
            {coupon.isPublic && (
              <Chip
                label="Công khai"
                size="small"
                color="success"
                sx={{ fontSize: "0.75rem" }}
              />
            )}
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Users size={14} />
              <Typography variant="caption" color="text.secondary">
                Đã sử dụng: <strong>{coupon.currentUsageCount}</strong> lần
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Calendar size={14} />
              <Typography variant="caption" color="text.secondary">
                Hết hạn:{" "}
                <strong>
                  {new Date(coupon.endDate).toLocaleDateString("vi-VN")}
                </strong>
              </Typography>
            </Box>
          </Box>

          {coupon.currentUsageCount > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: (theme) =>
                  alpha(theme.palette.warning.main, 0.1),
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.warning.main, 0.3),
              }}
            >
              <Typography variant="body2" color="warning.dark" fontWeight={500}>
                ⚠️ Coupon này đã được sử dụng {coupon.currentUsageCount} lần.
                Việc xóa có thể ảnh hưởng đến các booking đã áp dụng coupon này.
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          ⚠️ Lưu ý: Sau khi xóa, dữ liệu sẽ không thể khôi phục!
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <AppButton variant="outlined" onClick={onCancel} size="small">
          Hủy
        </AppButton>
        <AppButton
          variant="contained"
          onClick={onConfirm}
          color="error"
          size="small"
        >
          Xóa Coupon
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
