// src/pages/admin/HostManagement/components/ApproveRejectDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";
import { AppButton } from "@/components/button";
import type { HostProfile } from "@/types/hostProfile.types";

interface ApproveRejectDialogProps {
  open: boolean;
  mode: "approve" | "reject";
  host: HostProfile | null;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

export const ApproveRejectDialog: React.FC<ApproveRejectDialogProps> = ({
  open,
  mode,
  host,
  onConfirm,
  onCancel,
}) => {
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm(note);
    setNote("");
  };

  const isApprove = mode === "approve";

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {isApprove ? (
          <>
            <CheckCircle size={24} color="#4CAF50" />
            Duyệt Host
          </>
        ) : (
          <>
            <XCircle size={24} color="#f44336" />
            Từ chối Host
          </>
        )}
      </DialogTitle>
      <DialogContent>
        {host && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "background.default",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {host.businessName || "Chưa cập nhật tên doanh nghiệp"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ngân hàng: {host.bankName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Số TK: {host.bankAccountNumber}
            </Typography>
          </Box>
        )}

        {isApprove ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Sau khi duyệt, host sẽ có thể tạo và quản lý homestay trên hệ thống.
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mb: 2 }}>
            Sau khi từ chối, host sẽ nhận được thông báo và có thể nộp lại đơn
            đăng ký.
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={4}
          label={isApprove ? "Ghi chú (tùy chọn)" : "Lý do từ chối *"}
          placeholder={
            isApprove
              ? "Nhập ghi chú nếu cần..."
              : "Vui lòng nhập lý do từ chối..."
          }
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required={!isApprove}
        />
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onCancel} variant="outlined">
          Hủy
        </AppButton>
        <AppButton
          onClick={handleConfirm}
          success={isApprove}
          danger={!isApprove}
          disabled={!isApprove && !note.trim()}
        >
          {isApprove ? "Duyệt" : "Từ chối"}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
