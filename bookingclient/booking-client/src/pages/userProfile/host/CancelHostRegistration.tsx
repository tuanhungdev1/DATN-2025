/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/host-registration/CancelHostRegistration.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
} from "@mui/material";
import { AppButton } from "@/components/button";
import { useRemoveHostProfileMutation } from "@/services/endpoints/hostProfile.api";
import { useToast } from "@/hooks/useToast";

interface CancelHostRegistrationProps {
  open: boolean;
  onClose: () => void;
  hostProfileId: number;
}

const CancelHostRegistration = ({
  open,
  onClose,
  hostProfileId,
}: CancelHostRegistrationProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [removeProfile, { isLoading }] = useRemoveHostProfileMutation();
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    try {
      setError(null);
      const result = await removeProfile(hostProfileId).unwrap();
      if (result.success) {
        toast.success("Đã hủy đơn đăng ký thành công!");
        onClose();
        navigate("/user/profile/host-registration");
      }
    } catch (err: any) {
      const errMsg =
        err?.data?.message || "Có lỗi xảy ra khi hủy đơn. Vui lòng thử lại.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Xác nhận hủy đơn đăng ký</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Bạn có chắc chắn muốn hủy đơn đăng ký Host không? Hành động này không
          thể hoàn tác. Tất cả thông tin đã nộp sẽ bị xóa và bạn sẽ cần đăng ký
          lại từ đầu nếu muốn trở thành Host.
        </Typography>
      </DialogContent>
      <DialogActions>
        <AppButton onClick={onClose} variant="outlined" disabled={isLoading}>
          Không, giữ đơn
        </AppButton>
        <AppButton
          onClick={handleCancel}
          danger
          isLoading={isLoading}
          loadingText="Đang hủy..."
        >
          Có, hủy đơn
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default CancelHostRegistration;
