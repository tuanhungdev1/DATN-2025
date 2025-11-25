// src/components/homestay/MobileFilterDrawer.tsx
import React, { useState } from "react";
import { Drawer, Box, IconButton, Fab, Badge } from "@mui/material";
import { FilterList, Close } from "@mui/icons-material";
import HomestayFilterComponent from "./HomestayFilter";
import { AppButton } from "@/components/button";

interface MobileFilterDrawerProps {
  onReset: () => void;
  onApply: () => void;
  activeFiltersCount: number;
}

const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  onReset,
  onApply,
  activeFiltersCount,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleApply = () => {
    onApply();
    handleClose();
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="filter"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={handleOpen}
      >
        <Badge badgeContent={activeFiltersCount} color="error">
          <FilterList />
        </Badge>
      </Fab>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: "85vw",
            maxWidth: 400,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Bộ lọc tìm kiếm
          </Box>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          <HomestayFilterComponent onReset={onReset} />
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            gap: 2,
          }}
        >
          <AppButton
            variant="outlined"
            fullWidth
            onClick={() => {
              onReset();
              handleClose();
            }}
          >
            Đặt lại
          </AppButton>
          <AppButton fullWidth onClick={handleApply}>
            Áp dụng
          </AppButton>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileFilterDrawer;
