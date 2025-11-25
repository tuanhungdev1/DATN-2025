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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { Rule } from "@/types/rule.type";

interface RuleDetailDialogProps {
  open: boolean;
  rule: Rule | null;
  onClose: () => void;
}

export const RuleDetailDialog: React.FC<RuleDetailDialogProps> = ({
  open,
  rule,
  onClose,
}) => {
  if (!rule) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chi tiết quy định</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {rule.iconUrl && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Avatar
                src={rule.iconUrl}
                sx={{ width: 100, height: 100 }}
                variant="rounded"
              />
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="textSecondary">
              Tên quy định
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {rule.ruleName}
            </Typography>
          </Box>

          {rule.ruleDescription && (
            <Box>
              <Typography variant="caption" color="textSecondary">
                Mô tả
              </Typography>
              <Typography variant="body2">{rule.ruleDescription}</Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" color="textSecondary">
              Loại quy định
            </Typography>
            <Typography variant="body1">
              <Chip label={rule.ruleType} size="small" variant="outlined" />
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">
              Thứ tự hiển thị
            </Typography>
            <Typography variant="body1">{rule.displayOrder}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">
              Trạng thái
            </Typography>
            <Typography variant="body1">
              <Chip
                label={rule.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                color={rule.isActive ? "success" : "default"}
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
                {format(new Date(rule.createdAt), "dd/MM/yyyy HH:mm", {
                  locale: vi,
                })}
              </Typography>
            </Box>
            {rule.updatedAt && (
              <Box>
                <Typography variant="caption" color="textSecondary">
                  Lần cập nhật cuối
                </Typography>
                <Typography variant="body2">
                  {format(new Date(rule.updatedAt), "dd/MM/yyyy HH:mm", {
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
