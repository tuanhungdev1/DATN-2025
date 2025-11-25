// src/pages/admin/HostManagement/components/HostToolbar.tsx
import React, { useState } from "react";
import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";

import { AppButton } from "@/components/button";
import { SearchBox } from "@/components/searchBox";
import {
  Download,
  FileDown,
  FileSpreadsheet,
  FileText,
  ListFilterPlus,
  Loader2,
  RefreshCcw,
} from "lucide-react";

interface HostToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onExportExcel: () => Promise<void>;
  onExportPdf: () => Promise<void>;
  onExportCsv: () => Promise<void>;
  isExporting?: boolean;
  isLoading?: boolean;
  onToggleFilters?: () => void;
}

export const HostToolbar: React.FC<HostToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onRefresh,
  onExportExcel,
  onExportPdf,
  onExportCsv,
  isExporting = false,
  isLoading = false,
  onToggleFilters,
}) => {
  const [searchValue, setSearchValue] = useState(searchTerm ?? "");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (fn: () => Promise<void>) => {
    handleMenuClose();
    await fn();
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        pb: 2,
      }}
    >
      {/* Search */}
      <SearchBox
        placeholder="Tìm kiếm chủ Homestay..."
        value={searchValue}
        onChange={handleSearchChange}
      />

      {/* Right actions */}
      <Stack direction="row" alignItems="center" gap={1}>
        {/* Refresh */}
        <Tooltip title="Làm mới">
          <IconButton onClick={onRefresh} disabled={isLoading}>
            <RefreshCcw size={20} />
          </IconButton>
        </Tooltip>

        {/* Export Menu */}
        <Tooltip title="Xuất dữ liệu">
          <IconButton onClick={handleMenuOpen} disabled={isExporting}>
            {isExporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
          </IconButton>
        </Tooltip>

        {/* Filter */}
        {onToggleFilters && (
          <AppButton
            variant="outlined"
            size="small"
            startIcon={<ListFilterPlus size={18} />}
            onClick={onToggleFilters}
          >
            Bộ lọc
          </AppButton>
        )}
      </Stack>

      {/* Export Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 8,
          sx: { mt: 1, minWidth: 200 },
        }}
      >
        <MenuItem
          onClick={() => handleExport(onExportExcel)}
          disabled={isExporting}
        >
          <ListItemIcon>
            <FileSpreadsheet size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText primary="Excel (.xlsx)" />
        </MenuItem>

        <MenuItem
          onClick={() => handleExport(onExportPdf)}
          disabled={isExporting}
        >
          <ListItemIcon>
            <FileText size={18} className="text-red-600" />
          </ListItemIcon>
          <ListItemText primary="PDF (.pdf)" />
        </MenuItem>

        <MenuItem
          onClick={() => handleExport(onExportCsv)}
          disabled={isExporting}
        >
          <ListItemIcon>
            <FileDown size={18} className="text-blue-600" />
          </ListItemIcon>
          <ListItemText primary="CSV (.csv)" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
