// src/pages/admin/UserManagement/components/DeleteConfirmDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
} from "@mui/material";
import { AppButton } from "@/components/button";
import type { User } from "@/types/user.types";

interface DeleteConfirmDialogProps {
  open: boolean;
  user: User | null;
  isDeleting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  user,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>Delete User</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2, borderRadius: "4px" }}>
          This action cannot be undone!
        </Alert>
        <Typography>
          Are you sure you want to delete user <strong>{user?.email}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          px: 2,
          pb: 2,
        }}
      >
        <AppButton
          onClick={onCancel}
          variant="outlined"
          disabled={isDeleting}
          size="large"
          color="warning"
        >
          Cancel
        </AppButton>
        <AppButton
          onClick={onConfirm}
          variant="contained"
          color="error"
          danger
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
