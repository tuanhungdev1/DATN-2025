import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { AppButton } from "@/components/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { PropertyType } from "@/types/propertyType.types";
import { AppImage } from "@/components/images";

interface PropertyTypeDetailDialogProps {
  open: boolean;
  propertyType: PropertyType | null;
  onClose: () => void;
}

export const PropertyTypeDetailDialog: React.FC<
  PropertyTypeDetailDialogProps
> = ({ open, propertyType, onClose }) => {
  if (!propertyType) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết loại chỗ ở</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {propertyType.iconUrl && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <AppImage
                src={propertyType.iconUrl}
                sx={{ width: "100%", height: "auto" }}
                alt="Property Type"
              />
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="textSecondary">
              Tên loại chỗ ở
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {propertyType.typeName}
            </Typography>
          </Box>

          {propertyType.description && (
            <Box>
              <Typography variant="caption" color="textSecondary">
                Mô tả
              </Typography>
              <Typography variant="body2">
                {propertyType.description}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="textSecondary">
              Thứ tự hiển thị
            </Typography>
            <Typography variant="body1">{propertyType.displayOrder}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">
              Trạng thái
            </Typography>
            <Typography variant="body1">
              <Chip
                label={propertyType.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                color={propertyType.isActive ? "success" : "default"}
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
                {format(new Date(propertyType.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </Typography>
            </Box>
            {propertyType.updatedAt && (
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Lần cập nhật cuối
                </Typography>
                <Typography variant="body2">
                  {format(
                    new Date(propertyType.updatedAt),
                    "dd/MM/yyyy HH:mm",
                    {
                      locale: vi,
                    }
                  )}
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
