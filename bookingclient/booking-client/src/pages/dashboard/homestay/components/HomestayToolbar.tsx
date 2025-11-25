// src/pages/admin/HomestayManagement/components/HomestayToolbar.tsx
import React, { useState, useEffect } from "react";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import { RefreshCw, ListFilter, Plus } from "lucide-react";

import { AppButton } from "@/components/button";
import { SearchBox } from "@/components/searchBox";

interface HomestayToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateNew: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
  onToggleFilters?: () => void;
}

export const HomestayToolbar: React.FC<HomestayToolbarProps> = ({
  searchTerm = "",
  onSearchChange,
  onCreateNew,
  onRefresh,
  isLoading = false,
  onToggleFilters,
}) => {
  const [searchValue, setSearchValue] = useState(searchTerm);

  // Đồng bộ khi searchTerm từ bên ngoài thay đổi (ví dụ: xóa filter)
  useEffect(() => {
    setSearchValue(searchTerm);
  }, [searchTerm]);

  const handleTypingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        pb: 3,
        pt: 1,
      }}
    >
      {/* Ô tìm kiếm */}
      <Stack direction="row" alignItems="center">
        <SearchBox
          placeholder="Tìm kiếm homestay..."
          value={searchValue}
          onChange={handleTypingChange}
          disabled={isLoading}
        />
      </Stack>

      {/* Các nút hành động bên phải */}
      <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
        {/* Nút làm mới */}
        <Tooltip title="Làm mới dữ liệu">
          <span>
            <IconButton
              size="medium"
              onClick={onRefresh}
              disabled={isLoading}
              sx={{
                bgcolor: isLoading
                  ? "action.disabledBackground"
                  : "background.paper",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <RefreshCw
                size={20}
                className={isLoading ? "animate-spin" : ""}
              />
            </IconButton>
          </span>
        </Tooltip>

        {/* Nút bộ lọc */}
        {onToggleFilters && (
          <Tooltip title="Mở bộ lọc">
            <AppButton
              variant="outlined"
              startIcon={<ListFilter size={18} />}
              onClick={onToggleFilters}
              disabled={isLoading}
              size="medium"
            >
              Bộ lọc
            </AppButton>
          </Tooltip>
        )}

        {/* Nút thêm mới */}
        <AppButton
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onCreateNew}
          disabled={isLoading}
          size="medium"
        >
          Thêm homestay
        </AppButton>
      </Box>
    </Box>
  );
};
