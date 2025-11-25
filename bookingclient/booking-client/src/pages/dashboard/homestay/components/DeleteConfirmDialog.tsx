// src/pages/admin/HomestayManagement/components/DeleteConfirmDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { AppButton } from "@/components/button";
import type { Homestay } from "@/types/homestay.types";

interface DeleteConfirmDialogProps {
  open: boolean;
  homestay: Homestay | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  homestay,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6">Confirm Delete</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete the homestay{" "}
          <strong>"{homestay?.homestayTitle}"</strong>?
        </Typography>
        <Typography color="error" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AppButton onClick={onCancel} variant="outlined">
          Cancel
        </AppButton>
        <AppButton onClick={onConfirm} variant="contained" color="error">
          Delete
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
