import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
} from "@mui/material";
import { AppButton } from "@/components/button";
import { AlertTriangle } from "lucide-react";
import { Box } from "@mui/material";

interface DeleteConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  title,
  message,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={24} color="#d32f2f" />
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Typography color="textSecondary">{message}</Typography>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <AppButton variant="outlined" onClick={onCancel} disabled={isLoading}>
          Hủy
        </AppButton>
        <AppButton
          variant="contained"
          danger
          onClick={onConfirm}
          isLoading={isLoading}
        >
          Xóa
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
