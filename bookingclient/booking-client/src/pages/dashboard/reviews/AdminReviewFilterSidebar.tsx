/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/ReviewManagement/AdminReviewFilterSidebar.tsx
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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AppButton } from "@/components/button";
import type { ReviewFilter } from "@/types/review.types";

interface AdminReviewFilterSidebarProps {
  open: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<ReviewFilter>) => void;
  onClearFilters: () => void;
  initialFilters: ReviewFilter;
}

export const AdminReviewFilterSidebar: React.FC<
  AdminReviewFilterSidebarProps
> = ({ open, onClose, onApplyFilters, onClearFilters, initialFilters }) => {
  const theme = useTheme();
  const [filters, setFilters] = useState<Partial<ReviewFilter>>(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (field: keyof ReviewFilter, value: any) => {
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
          Lọc Đánh Giá (Admin)
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          {/* Search Term */}
          <TextField
            fullWidth
            label="Tìm kiếm"
            value={filters.searchTerm ?? ""}
            onChange={(e) =>
              handleChange("searchTerm", e.target.value || undefined)
            }
            placeholder="Tìm trong nhận xét..."
            sx={textFieldSx}
          />

          {/* Homestay ID */}
          <TextField
            fullWidth
            type="number"
            label="Homestay ID"
            value={filters.homestayId ?? ""}
            onChange={(e) =>
              handleChange(
                "homestayId",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            sx={textFieldSx}
          />

          {/* Reviewer ID */}
          <TextField
            fullWidth
            type="number"
            label="Reviewer ID"
            value={filters.reviewerId ?? ""}
            onChange={(e) =>
              handleChange(
                "reviewerId",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            sx={textFieldSx}
          />

          {/* Reviewee ID (Host) */}
          <TextField
            fullWidth
            type="number"
            label="Reviewee ID (Chủ nhà)"
            value={filters.revieweeId ?? ""}
            onChange={(e) =>
              handleChange(
                "revieweeId",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            sx={textFieldSx}
          />

          {/* Booking ID */}
          <TextField
            fullWidth
            type="number"
            label="Booking ID"
            value={filters.bookingId ?? ""}
            onChange={(e) =>
              handleChange(
                "bookingId",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            sx={textFieldSx}
          />

          {/* Rating Range */}
          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={500}>
              Khoảng đánh giá
            </Typography>
            <Stack spacing={2}>
              <TextField
                type="number"
                fullWidth
                label="Đánh giá tối thiểu"
                placeholder="1"
                inputProps={{ min: 1, max: 5, step: 0.5 }}
                value={filters.minOverallRating ?? ""}
                onChange={(e) =>
                  handleChange(
                    "minOverallRating",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                sx={textFieldSx}
              />
              <TextField
                type="number"
                fullWidth
                label="Đánh giá tối đa"
                placeholder="5"
                inputProps={{ min: 1, max: 5, step: 0.5 }}
                value={filters.maxOverallRating ?? ""}
                onChange={(e) =>
                  handleChange(
                    "maxOverallRating",
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                sx={textFieldSx}
              />
            </Stack>
          </Box>

          {/* Checkboxes */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isVisible ?? false}
                  onChange={(e) =>
                    handleChange(
                      "isVisible",
                      e.target.checked ? true : undefined
                    )
                  }
                />
              }
              label="Chỉ hiển thị đánh giá công khai"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isRecommended ?? false}
                  onChange={(e) =>
                    handleChange(
                      "isRecommended",
                      e.target.checked ? true : undefined
                    )
                  }
                />
              }
              label="Chỉ khuyến nghị"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.hasHostResponse ?? false}
                  onChange={(e) =>
                    handleChange(
                      "hasHostResponse",
                      e.target.checked ? true : undefined
                    )
                  }
                />
              }
              label="Có phản hồi từ chủ nhà"
            />
          </Box>

          {/* Date Range */}
          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={500}>
              Khoảng thời gian tạo
            </Typography>
            <Stack spacing={2}>
              <TextField
                type="date"
                fullWidth
                label="Từ ngày"
                InputLabelProps={{ shrink: true }}
                value={filters.createdFrom || ""}
                onChange={(e) =>
                  handleChange("createdFrom", e.target.value || undefined)
                }
                sx={textFieldSx}
              />
              <TextField
                type="date"
                fullWidth
                label="Đến ngày"
                InputLabelProps={{ shrink: true }}
                value={filters.createdTo || ""}
                onChange={(e) =>
                  handleChange("createdTo", e.target.value || undefined)
                }
                sx={textFieldSx}
              />
            </Stack>
          </Box>

          {/* Sort By */}
          <TextField
            select
            fullWidth
            label="Sắp xếp theo"
            value={filters.sortBy || "CreatedAt"}
            onChange={(e) => handleChange("sortBy", e.target.value)}
            sx={textFieldSx}
          >
            <MenuItem value="CreatedAt">Ngày tạo</MenuItem>
            <MenuItem value="Rating">Đánh giá</MenuItem>
            <MenuItem value="Helpful">Hữu ích</MenuItem>
          </TextField>

          {/* Sort Direction */}
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
