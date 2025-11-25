/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/user/BookingManagement/components/FilterSidebar.tsx
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
import type { BookingFilter } from "@/types/booking.types";
import { BookingStatus, BookingStatusDisplay } from "@/enums/bookingStatus";

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<BookingFilter>) => void;
  onClearFilters: () => void;
  initialFilters: BookingFilter;
}

export const MyBookingFilterSidebar: React.FC<FilterSidebarProps> = ({
  open,
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters,
}) => {
  const theme = useTheme();
  const [filters, setFilters] =
    useState<Partial<BookingFilter>>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (field: keyof BookingFilter, value: any) => {
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

  // Style chung cho TextField
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
          Lọc Đặt Phòng
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          {/* Trạng thái */}
          <TextField
            select
            fullWidth
            label="Trạng thái"
            value={filters.status ?? ""}
            onChange={(e) =>
              handleChange(
                "status",
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            sx={textFieldSx}
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>
            {Object.entries(BookingStatus)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {BookingStatusDisplay[value as BookingStatus]}
                </MenuItem>
              ))}
          </TextField>

          {/* Khoảng ngày nhận phòng */}
          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={500}>
              Khoảng ngày nhận phòng
            </Typography>
            <Stack spacing={2}>
              <TextField
                type="date"
                fullWidth
                label="Từ ngày"
                InputLabelProps={{ shrink: true }}
                value={filters.checkInDateFrom || ""}
                onChange={(e) =>
                  handleChange("checkInDateFrom", e.target.value || undefined)
                }
                sx={textFieldSx}
              />
              <TextField
                type="date"
                fullWidth
                label="Đến ngày"
                InputLabelProps={{ shrink: true }}
                value={filters.checkInDateTo || ""}
                onChange={(e) =>
                  handleChange("checkInDateTo", e.target.value || undefined)
                }
                sx={textFieldSx}
              />
            </Stack>
          </Box>

          {/* Khoảng giá tiền */}
          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={500}>
              Khoảng giá (VNĐ)
            </Typography>
            <Stack spacing={2}>
              <TextField
                type="number"
                fullWidth
                label="Giá tối thiểu"
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
                label="Giá tối đa"
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
            <MenuItem value="checkInDate">Ngày nhận phòng</MenuItem>
            <MenuItem value="totalAmount">Tổng tiền</MenuItem>
            <MenuItem value="bookingCode">Mã đặt phòng</MenuItem>
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
