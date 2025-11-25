// src/pages/admin/HomestayManagement/components/ApproveRejectDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from "@mui/icons-material";
import { AppButton } from "@/components/button";
import type { Homestay } from "@/types/homestay.types";

interface ApproveRejectDialogProps {
  open: boolean;
  mode: "approve" | "reject";
  homestay: Homestay | null;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

export const ApproveRejectDialog: React.FC<ApproveRejectDialogProps> = ({
  open,
  mode,
  homestay,
  onConfirm,
  onCancel,
}) => {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm(note);
    setNote("");
  };

  const handleCancel = () => {
    onCancel();
    setNote("");
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {mode === "approve" ? (
            <ApproveIcon color="success" />
          ) : (
            <RejectIcon color="error" />
          )}
          <Typography variant="h6">
            {mode === "approve" ? "Approve Homestay" : "Reject Homestay"}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          {mode === "approve"
            ? `Are you sure you want to approve "${homestay?.homestayTitle}"?`
            : `Are you sure you want to reject "${homestay?.homestayTitle}"?`}
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={4}
          label={
            mode === "approve"
              ? "Approval Note (Optional)"
              : "Rejection Reason (Required)"
          }
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            mode === "approve"
              ? "Add any notes for the host..."
              : "Please provide a reason for rejection..."
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AppButton onClick={handleCancel} variant="outlined">
          Cancel
        </AppButton>
        <AppButton
          onClick={handleConfirm}
          variant="contained"
          color={mode === "approve" ? "success" : "error"}
          disabled={mode === "reject" && !note.trim()}
        >
          {mode === "approve" ? "Approve" : "Reject"}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
