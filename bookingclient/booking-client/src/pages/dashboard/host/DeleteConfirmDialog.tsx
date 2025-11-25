// src/pages/admin/HostManagement/components/DeleteConfirmDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";
import { AppButton } from "@/components/button";
import type { HostProfile } from "@/types/hostProfile.types";

interface DeleteConfirmDialogProps {
  open: boolean;
  host: HostProfile | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  host,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AlertTriangle size={24} color="#f44336" />
        Xác nhận xóa Host
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Bạn có chắc chắn muốn xóa host này không?
          </Typography>
          {host && (
            <Box
              sx={{
                mt: 2,
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
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            ⚠️ Hành động này sẽ xóa tất cả thông tin của host bao gồm ảnh CMND,
            giấy phép kinh doanh. Dữ liệu không thể khôi phục!
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onCancel} variant="outlined">
          Hủy
        </AppButton>
        <AppButton onClick={onConfirm} danger>
          Xóa Host
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
