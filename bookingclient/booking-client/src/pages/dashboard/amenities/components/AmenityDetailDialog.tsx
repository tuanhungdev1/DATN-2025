import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import { AppButton } from "@/components/button";
import type { Amenity } from "@/types/amenity.types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface AmenityDetailDialogProps {
  open: boolean;
  amenity: Amenity | null;
  onClose: () => void;
}

export const AmenityDetailDialog: React.FC<AmenityDetailDialogProps> = ({
  open,
  amenity,
  onClose,
}) => {
  if (!amenity) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết tiện nghi</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {amenity.iconUrl && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                src={amenity.iconUrl}
                sx={{ width: 100, height: 100 }}
                variant="rounded"
              />
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="textSecondary">
              Tên tiện nghi
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {amenity.amenityName}
            </Typography>
          </Box>

          {amenity.amenityDescription && (
            <Box>
              <Typography variant="caption" color="textSecondary">
                Mô tả
              </Typography>
              <Typography variant="body2">
                {amenity.amenityDescription}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="textSecondary">
              Danh mục
            </Typography>
            <Typography variant="body1">
              <Chip label={amenity.category} size="small" variant="outlined" />
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Thứ tự hiển thị
              </Typography>
              <Typography variant="body1">{amenity.displayOrder}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Lần sử dụng
              </Typography>
              <Typography variant="body1">{amenity.usageCount}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">
              Trạng thái
            </Typography>
            <Typography variant="body1">
              <Chip
                label={amenity.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                color={amenity.isActive ? "success" : "default"}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="caption" color="textSecondary">
                Ngày tạo
              </Typography>
              <Typography variant="body2">
                {format(new Date(amenity.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </Typography>
            </Box>
            {amenity.updatedAt && (
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Lần cập nhật cuối
                </Typography>
                <Typography variant="body2">
                  {format(new Date(amenity.updatedAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2 }}>
        <AppButton variant="outlined" onClick={onClose}>
          Đóng
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
