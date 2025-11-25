// components/LoadingDialog.tsx
import React from "react";
import {
  Backdrop,
  Dialog,
  DialogContent,
  Typography,
  LinearProgress,
  Box,
} from "@mui/material";
import { UploadCloud } from "lucide-react";

const LoadingDialog = ({
  open,
  title = "Đang tạo Homestay",
  message = "Vui lòng đợi một chút, chúng tôi đang xử lý thông tin và hình ảnh của bạn...",
}: {
  open: boolean;
  title?: string;
  message?: string;
}) => {
  if (!open) return null;

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        color: "#fff",
        backdropFilter: "blur(4px)",
      }}
    >
      <Dialog
        open={open}
        maxWidth="sm"
        sx={{ zIndex: 10000 }}
        PaperProps={{
          sx: {
            background: "white",
            boxShadow: "none",
            overflow: "visible",
          },
        }}
        hideBackdrop
      >
        <DialogContent sx={{ textAlign: "center", py: 6, px: 8 }}>
          {/* Icon đơn giản */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <UploadCloud size={80} color="#4ecdc4" />
          </Box>

          {/* Tiêu đề */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {title}
          </Typography>

          {/* Thông báo */}
          <Typography
            variant="body1"
            sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
          >
            {message}
          </Typography>

          {/* Thanh progress đẹp */}
          <Box sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
            <LinearProgress
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(255,255,255,0.2)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  background:
                    "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                },
              }}
            />
          </Box>

          {/* Text nhỏ bên dưới (tùy chọn) */}
          <Typography
            variant="caption"
            sx={{ mt: 3, opacity: 0.7, display: "block" }}
          >
            Đang tải lên hình ảnh và lưu thông tin...
          </Typography>
        </DialogContent>
      </Dialog>
    </Backdrop>
  );
};

export default LoadingDialog;
