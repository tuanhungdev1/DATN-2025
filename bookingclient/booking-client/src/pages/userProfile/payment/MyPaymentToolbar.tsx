// src/pages/user/PaymentManagement/MyPaymentToolbar.tsx
import React, { useState } from "react";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { AppButton } from "@/components/button";
import { SearchBox } from "@/components/searchBox";
import { ListFilterPlus } from "lucide-react";

interface MyPaymentToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onExportCSV: () => void;
  isLoading?: boolean;
  onToggleFilters?: () => void;
}

export const MyPaymentToolbar: React.FC<MyPaymentToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onExportCSV,
  isLoading,
  onToggleFilters,
}) => {
  const [searchValue, setSearchValue] = useState(searchTerm ?? "");

  const handleTypingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
        pb: 2,
      }}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        <SearchBox
          placeholder="Tìm theo mã đặt phòng..."
          onChange={handleTypingChange}
          value={searchValue}
        />
      </Stack>

      <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip title="Làm mới">
          <span>
            <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Xuất CSV">
          <span>
            <IconButton size="small" onClick={onExportCSV} disabled={isLoading}>
              <DownloadIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Bộ lọc">
          <AppButton
            variant="outlined"
            startIcon={<ListFilterPlus size={18} />}
            size="small"
            onClick={onToggleFilters}
          >
            Lọc
          </AppButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
