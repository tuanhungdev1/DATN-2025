/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/user/PaymentManagement/MyPaymentFilterSidebar.tsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  TextField,
  MenuItem,
  Stack,
  useTheme,
} from "@mui/material";
import { AppButton } from "@/components/button";
import type { PaymentFilter } from "@/types/payment.types";
import { PaymentStatus, PaymentMethod } from "@/enums/payment.enums";
import {
  PaymentMethodDisplay,
  PaymentStatusDisplay,
} from "@/enums/paymentEnums";

interface MyPaymentFilterSidebarProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<PaymentFilter>) => void;
  onClearFilters: () => void;
  initialFilters: PaymentFilter;
}

export const MyPaymentFilterSidebar: React.FC<MyPaymentFilterSidebarProps> = ({
  open,
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters,
}) => {
  const theme = useTheme();
  const [filters, setFilters] =
    useState<Partial<PaymentFilter>>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (field: keyof PaymentFilter, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleClear = () => {
    setFilters({});
    onClearFilters();
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "4px",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.primary.light,
        borderWidth: 2,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
    },
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 3 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Lọc Thanh Toán
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          {/* Trạng thái thanh toán */}
          <TextField
            select
            fullWidth
            label="Trạng thái thanh toán"
            value={filters.paymentStatus ?? ""}
            onChange={(e) =>
              handleChange(
                "paymentStatus",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            sx={textFieldSx}
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>
            {Object.entries(PaymentStatus)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {PaymentStatusDisplay[value as PaymentStatus]}
                </MenuItem>
              ))}
          </TextField>

          {/* Phương thức thanh toán */}
          <TextField
            select
            fullWidth
            label="Phương thức thanh toán"
            value={filters.paymentMethod ?? ""}
            onChange={(e) =>
              handleChange(
                "paymentMethod",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            sx={textFieldSx}
          >
            <MenuItem value="">Tất cả phương thức</MenuItem>
            {Object.entries(PaymentMethod)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {PaymentMethodDisplay[value as PaymentMethod]}
                </MenuItem>
              ))}
          </TextField>

          {/* Khoảng thời gian */}
          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={500}>
              Khoảng thời gian thanh toán
            </Typography>
            <Stack spacing={2}>
              <TextField
                type="date"
                fullWidth
                label="Từ ngày"
                InputLabelProps={{ shrink: true }}
                value={filters.dateFrom || ""}
                onChange={(e) =>
                  handleChange("dateFrom", e.target.value || undefined)
                }
                sx={textFieldSx}
              />
              <TextField
                type="date"
                fullWidth
                label="Đến ngày"
                InputLabelProps={{ shrink: true }}
                value={filters.dateTo || ""}
                onChange={(e) =>
                  handleChange("dateTo", e.target.value || undefined)
                }
                sx={textFieldSx}
              />
            </Stack>
          </Box>

          {/* Khoảng giá tiền */}
          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={500}>
              Khoảng số tiền (VNĐ)
            </Typography>
            <Stack spacing={2}>
              <TextField
                type="number"
                fullWidth
                label="Số tiền tối thiểu"
                placeholder="0"
                value={filters.minAmount || ""}
                onChange={(e) =>
                  handleChange(
                    "minAmount",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                sx={textFieldSx}
              />
              <TextField
                type="number"
                fullWidth
                label="Số tiền tối đa"
                placeholder="Không giới hạn"
                value={filters.maxAmount || ""}
                onChange={(e) =>
                  handleChange(
                    "maxAmount",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                sx={textFieldSx}
              />
            </Stack>
          </Box>

          {/* Sắp xếp theo */}
          <TextField
            select
            fullWidth
            label="Sắp xếp theo"
            value={filters.sortBy || "createdAt"}
            onChange={(e) => handleChange("sortBy", e.target.value)}
            sx={textFieldSx}
          >
            <MenuItem value="createdAt">Ngày tạo</MenuItem>
            <MenuItem value="processedAt">Ngày xử lý</MenuItem>
            <MenuItem value="paymentAmount">Số tiền</MenuItem>
          </TextField>

          {/* Thứ tự sắp xếp */}
          <TextField
            select
            fullWidth
            label="Thứ tự"
            value={filters.sortDirection || "desc"}
            onChange={(e) => handleChange("sortDirection", e.target.value)}
            sx={textFieldSx}
          >
            <MenuItem value="asc">Tăng dần</MenuItem>
            <MenuItem value="desc">Giảm dần</MenuItem>
          </TextField>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2}>
          <AppButton variant="outlined" fullWidth onClick={handleClear}>
            Xóa bộ lọc
          </AppButton>
          <AppButton fullWidth onClick={handleApply}>
            Áp dụng
          </AppButton>
        </Stack>
      </Box>
    </Drawer>
  );
};
