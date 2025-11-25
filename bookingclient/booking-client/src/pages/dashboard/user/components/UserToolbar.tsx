// src/pages/admin/UserManagement/components/UserToolbar.tsx
import React, { useState } from "react";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { AppButton } from "@/components/button";
import { SearchBox } from "@/components/searchBox";
import { ListFilterPlus, Plus } from "lucide-react";

interface UserToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isActiveFilter?: boolean;
  onCreateNew: () => void;
  onRefresh: () => void;
  onExportCSV: () => void;
  isLoading?: boolean;
  onToggleFilters?: () => void;
}

export const UserToolbar: React.FC<UserToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onCreateNew,
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
      <Stack direction={"row"} alignItems={"center"} gap={2}>
        <SearchBox
          placeholder="Search..."
          onChange={handleTypingChange}
          value={searchValue}
        />
      </Stack>

      <Box sx={{ ml: "auto", display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip title="Refresh">
          <span>
            <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Export to CSV">
          <span>
            <IconButton size="small" onClick={onExportCSV} disabled={isLoading}>
              <DownloadIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Filter">
          <AppButton
            variant="outlined"
            startIcon={<ListFilterPlus size={18} />}
            size="small"
            onClick={onToggleFilters}
          >
            Filters
          </AppButton>
        </Tooltip>

        <AppButton
          variant="contained"
          startIcon={<Plus size={18} />}
          size="small"
          onClick={onCreateNew}
          disabled={isLoading}
        >
          New User
        </AppButton>
      </Box>
    </Box>
  );
};
