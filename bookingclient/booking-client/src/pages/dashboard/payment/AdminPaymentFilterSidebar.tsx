/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/PaymentManagement/AdminPaymentFilterSidebar.tsx
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { AppButton } from "@/components/button";
import {
  PaymentMethodDisplay,
  PaymentStatusDisplay,
} from "@/enums/paymentEnums";

interface AdminPaymentFilterSidebarProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  onClearFilters: () => void;
  initialFilters: any;
}

export const AdminPaymentFilterSidebar: React.FC<
  AdminPaymentFilterSidebarProps
> = ({ open, onClose, onApplyFilters, onClearFilters, initialFilters }) => {
  const [localFilters, setLocalFilters] = React.useState(initialFilters);

  const handleChange = (key: string, value: any) => {
    setLocalFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({
      paymentStatus: "",
      paymentMethod: "",
      minAmount: "",
      maxAmount: "",
      dateFrom: "",
      dateTo: "",
      bookingCode: "",
    });
    onClearFilters();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
      <Box sx={{ width: 380, p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Bộ lọc giao dịch
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <TextField
            select
            label="Trạng thái"
            value={localFilters.paymentStatus || ""}
            onChange={(e) =>
              handleChange("paymentStatus", e.target.value || undefined)
            }
            fullWidth
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.entries(PaymentStatusDisplay).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Phương thức"
            value={localFilters.paymentMethod || ""}
            onChange={(e) =>
              handleChange("paymentMethod", e.target.value || undefined)
            }
            fullWidth
          >
            <MenuItem value="">Tất cả</MenuItem>
            {Object.entries(PaymentMethodDisplay).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Số tiền từ"
            type="number"
            value={localFilters.minAmount || ""}
            onChange={(e) =>
              handleChange(
                "minAmount",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            fullWidth
          />

          <TextField
            label="Số tiền đến"
            type="number"
            value={localFilters.maxAmount || ""}
            onChange={(e) =>
              handleChange(
                "maxAmount",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            fullWidth
          />

          <TextField
            label="Từ ngày"
            type="date"
            value={localFilters.dateFrom || ""}
            onChange={(e) => handleChange("dateFrom", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Đến ngày"
            type="date"
            value={localFilters.dateTo || ""}
            onChange={(e) => handleChange("dateTo", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <AppButton fullWidth onClick={handleApply} variant="contained">
            Áp dụng
          </AppButton>
          <AppButton fullWidth variant="outlined" onClick={handleClear}>
            Xóa bộ lọc
          </AppButton>
        </Box>
      </Box>
    </Drawer>
  );
};
