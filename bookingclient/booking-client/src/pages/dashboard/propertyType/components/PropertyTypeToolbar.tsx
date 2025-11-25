/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Box, IconButton, Stack, Tooltip, Collapse } from "@mui/material";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { AppButton } from "@/components/button";
import { SearchBox } from "@/components/searchBox";
import { ListFilterPlus, Plus } from "lucide-react";
import { Formik, Form } from "formik";
import { FormCheckbox } from "@/components/checkbox";
import { useDebounce } from "@/hooks/useDebounce";
import { FormTextField } from "@/components/Input";

interface PropertyTypeToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: { category?: string; isActive?: boolean }) => void;
  onCreateNew: () => void;
  onRefresh: () => void;
  onExportCSV: () => void;
  isLoading?: boolean;
}

export const PropertyTypeToolbar: React.FC<PropertyTypeToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onFilterChange,
  onCreateNew,
  onRefresh,
  onExportCSV,
  isLoading,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(searchTerm ?? "");

  const handleTypingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <>
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
            placeholder="Tìm tên loại bất động sản..."
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
              <IconButton
                size="small"
                onClick={onExportCSV}
                disabled={isLoading}
              >
                <DownloadIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Bộ lọc">
            <AppButton
              variant="outlined"
              startIcon={<ListFilterPlus size={18} />}
              size="small"
              onClick={() => setShowFilters(!showFilters)}
            >
              Lọc
            </AppButton>
          </Tooltip>

          <AppButton
            variant="contained"
            startIcon={<Plus size={18} />}
            size="small"
            onClick={onCreateNew}
            disabled={isLoading}
          >
            Tạo mới
          </AppButton>
        </Box>
      </Box>

      {/* Bộ lọc */}
      <Collapse in={showFilters}>
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: "action.hover",
            borderRadius: 1,
          }}
        >
          <Formik
            initialValues={{
              category: "",
              isActive: true,
            }}
            onSubmit={() => {}}
          >
            {({ values, resetForm }) => {
              const debouncedValues = useDebounce(values, 400);

              useEffect(() => {
                onFilterChange({
                  category: debouncedValues.category || undefined,
                  isActive: debouncedValues.isActive,
                });
              }, [debouncedValues, onFilterChange]);

              const handleClearFilters = () => {
                resetForm();
                onFilterChange({ category: "", isActive: true });
              };

              return (
                <Form>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box sx={{ flex: 1 }}>
                      <FormTextField
                        name="category"
                        label="Danh mục"
                        placeholder="Nhập danh mục bất động sản..."
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <FormCheckbox
                        name="isActive"
                        label="Chỉ hiển thị loại bất động sản hoạt động"
                      />
                    </Box>

                    <Tooltip title="Xóa bộ lọc">
                      <span>
                        <AppButton
                          type="button"
                          variant="outlined"
                          color="secondary"
                          startIcon={<ClearIcon />}
                          size="small"
                          onClick={handleClearFilters}
                        >
                          Xóa lọc
                        </AppButton>
                      </span>
                    </Tooltip>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Collapse>
    </>
  );
};
