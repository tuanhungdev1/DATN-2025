// src/pages/admin/ReviewManagement/DeleteReviewDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Rating,
} from "@mui/material";
import { AppButton } from "@/components/button";
import type { Review } from "@/types/review.types";
import { AlertTriangle } from "lucide-react";

interface DeleteReviewDialogProps {
  open: boolean;
  review: Review | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteReviewDialog: React.FC<DeleteReviewDialogProps> = ({
  open,
  review,
  onConfirm,
  onCancel,
}) => {
  if (!review) return null;

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={24} color="#f44336" />
          <Typography variant="h6" fontWeight={600}>
            Xác nhận xóa đánh giá
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" mb={2}>
          Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn
          tác.
        </Typography>

        <Box
          sx={{
            p: 2,
            bgcolor: "grey.50",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} mb={1}>
            Thông tin đánh giá:
          </Typography>
          <Typography variant="body2" mb={0.5}>
            <strong>Người đánh giá:</strong> {review.reviewerName}
          </Typography>
          <Typography variant="body2" mb={0.5}>
            <strong>Homestay:</strong> {review.homestayTitle}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <strong>Đánh giá:</strong>
            <Rating value={review.overallRating} readOnly size="small" />
            <Typography variant="body2">({review.overallRating}/5)</Typography>
          </Box>
          {review.reviewComment && (
            <Typography
              variant="body2"
              mt={1}
              sx={{
                fontStyle: "italic",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              "{review.reviewComment}"
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AppButton variant="outlined" onClick={onCancel}>
          Hủy
        </AppButton>
        <AppButton variant="contained" color="error" onClick={onConfirm}>
          Xóa đánh giá
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
