// src/pages/admin/UserManagement/components/UserActionsMenu.tsx
import React from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import type { UserProfile } from "@/types/user.types";

interface UserActionsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onView: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
}

export const UserActionsMenu: React.FC<UserActionsMenuProps> = ({
  anchorEl,
  open,
  onClose,
  user,
  onView,
  onEdit,
  onToggleStatus,
  onToggleLock,
  onDelete,
}) => {
  if (!user) return null;

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={onView}>
        <VisibilityIcon sx={{ mr: 1 }} /> View
      </MenuItem>

      <MenuItem onClick={onEdit}>
        <EditIcon sx={{ mr: 1 }} /> Edit
      </MenuItem>

      <MenuItem onClick={onToggleStatus}>
        {user.isActive ? (
          <>
            <BlockIcon sx={{ mr: 1 }} /> Deactivate
          </>
        ) : (
          <>
            <CheckCircleIcon sx={{ mr: 1 }} /> Activate
          </>
        )}
      </MenuItem>

      <MenuItem onClick={onToggleLock}>
        {user.isLocked ? (
          <>
            <LockOpenIcon sx={{ mr: 1 }} /> Unlock
          </>
        ) : (
          <>
            <LockIcon sx={{ mr: 1 }} /> Lock
          </>
        )}
      </MenuItem>

      <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
        <DeleteIcon sx={{ mr: 1 }} /> Delete
      </MenuItem>
    </Menu>
  );
};
