/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/host/HostAvatarUploadDialog.tsx
import { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { AppButton } from "@/components/button";
import AppImage from "@/components/images/AppImage";
import { useToast } from "@/hooks/useToast";
import {
  useUploadHostAvatarMutation,
  useDeleteHostAvatarMutation,
} from "@/services/endpoints/hostProfile.api";
import { useAppDispatch } from "@/store/hooks";

interface HostAvatarUploadDialogProps {
  open: boolean;
  onClose: () => void;
  currentAvatar: string | null;
  hostId: number;
}

const HostAvatarUploadDialog: React.FC<HostAvatarUploadDialogProps> = ({
  open,
  onClose,
  currentAvatar,
  hostId,
}) => {
  const toast = useToast();
  //const dispatch = useAppDispatch();
  const [uploadAvatar] = useUploadHostAvatarMutation();
  const [deleteAvatar] = useDeleteHostAvatarMutation();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận định dạng JPG hoặc PNG.");
      return;
    }
    if (file.size > maxSize) {
      toast.error("Kích thước file tối đa 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemovePreview = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpdate = async () => {
    try {
      if (selectedFile) {
        const result = await uploadAvatar({
          hostId,
          file: selectedFile,
        }).unwrap();

        if (result.avatarUrl) {
          // Cập nhật store nếu cần
          // dispatch(updateHostProfile({ avatarUrl: result.avatarUrl }));
          toast.success("Cập nhật ảnh đại diện thành công!");
          onClose();
        }
      } else if (!preview && currentAvatar) {
        await deleteAvatar(hostId).unwrap();
        toast.success("Xóa ảnh đại diện thành công!");
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(currentAvatar || null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
          }}
        >
          {preview ? (
            <Box sx={{ position: "relative" }}>
              <Avatar sx={{ width: 150, height: 150 }}>
                <AppImage src={preview} alt="Preview" />
              </Avatar>
              <IconButton
                size="small"
                onClick={handleRemovePreview}
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  bgcolor: "background.paper",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                width: 150,
                height: 150,
                border: "2px dashed grey",
                borderRadius: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadIcon sx={{ fontSize: 40, color: "grey" }} />
              <Typography variant="body2" color="text.secondary">
                Tải lên hình ảnh
              </Typography>
            </Box>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            mt={2}
            textAlign="center"
          >
            Định dạng: JPG, PNG. Tối đa: 5MB.
            <br />
            Nhấn "Cập nhật" khi không chọn ảnh để xóa ảnh hiện tại.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <AppButton variant="outlined" size="small" onClick={handleClose}>
          Hủy
        </AppButton>
        <AppButton
          onClick={handleUpdate}
          variant="contained"
          disabled={!selectedFile && !currentAvatar}
        >
          Cập nhật
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};

export default HostAvatarUploadDialog;
