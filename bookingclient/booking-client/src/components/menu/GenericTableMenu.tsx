/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Table/GenericTableMenu.tsx

import React from "react";
import { Box, Menu, MenuItem, type MenuProps } from "@mui/material";

export interface MenuAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  color?: "inherit" | "error" | "success" | "warning";
  divider?: boolean;
}

export interface GenericTableMenuProps<T> extends Omit<MenuProps, "open"> {
  open: boolean;
  item: T | null;
  actions: MenuAction<T>[];
}

// Inner component: Đây là phần logic chính, generic <T,>
const GenericTableMenuInner = <T,>(
  { open, item, actions, onClose, ...props }: GenericTableMenuProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      {...props}
      ref={ref}
      sx={{
        "& .MuiPaper-root": {
          minWidth: 150, // Độ rộng tối thiểu
          padding: "4px 0", // Padding dọc cho toàn menu
          borderRadius: "4px", // Bo góc menu
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.12)",
        },
      }}
    >
      {actions.map((action, index) => (
        <MenuItem
          key={index}
          onClick={() => {
            if (item) {
              action.onClick(item);
            }
            // Đóng menu
            onClose?.({}, "backdropClick");
          }}
          sx={{
            color: action.color === "error" ? "error.main" : undefined,
          }}
        >
          {action.icon && (
            <Box
              component={"span"}
              style={{ marginRight: 8, minWidth: "30px" }}
            >
              {action.icon}
            </Box>
          )}

          {action.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

// Export: Wrap inner bằng forwardRef và assert type để hỗ trợ generic <T,> khi sử dụng
export const GenericTableMenu = React.forwardRef(GenericTableMenuInner) as (<T>(
  props: GenericTableMenuProps<T> & React.RefAttributes<HTMLDivElement>
) => ReturnType<typeof GenericTableMenuInner<T>>) & {
  displayName: string;
};

GenericTableMenu.displayName = "GenericTableMenu";
